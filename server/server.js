
const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require("cors");
require('dotenv').config()

const { PORT_NUM, CLIENT_URL } = process.env

// Determine allowed origins
const allowedOrigins = CLIENT_URL
  ? [CLIENT_URL, CLIENT_URL.replace(':3005', ':4005')]
  : ["http://localhost:3005", "http://localhost:4005"];

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"]
  }
});

app.use(cors({
  origin: CLIENT_URL || "http://localhost:3005",
  // credentials: true
}));

// logs every request so you can SEE if /channels hits your server
// Log every request so we SEE what hits this process
app.use((req, _res, next) => { console.log('➡️ ', req.method, req.url); next(); });

// Health check
app.get('/health', (_req, res) => res.json({ ok: true }));

// TEMP: hard-coded /channels route to prove routing works
app.get('/channels', (_req, res) => {
  res.json({ rows: [{ channel_id: 1, channel_name: 'test', channel_url: 'https://x' }] });
});


console.log('🚀 Booting server from', __filename);

app.use(express.json())

const {seed, registerFunc, patchChannel, loginFunc, selectLeadsFunc, scrapeGoogleFunc, scrapeYPFunc, getDashboard, patchDashboard, postDashboard, getLead, postLead, patchLead, deleteLead, deleteDashboard, emailPull, emailVerify, getLeadNote, patchNote, getAnalyticsStats, getAnalyticsChannels, getAnalyticsNiches, getOpportunities, getAllChannels, getAllVideos, getNewChannels} = require('./controller.js');

app.get('/seed', seed)

app.post('/register', registerFunc)

app.post('/login', loginFunc)

app.post('/selectleads', selectLeadsFunc)

app.get('/dashboard', getDashboard)

app.patch('/dashboard/:lead_id', patchDashboard)

app.patch('/channel/:channel_id', patchChannel)


app.post('/dashboard/:user_id', postDashboard)

app.delete('/dashboard/:lead_id', deleteDashboard)

app.post('/google/:user_id', scrapeGoogleFunc)

app.post('/ypscrape/:user_id', scrapeYPFunc)

app.post('/pullEmail/:user_id', emailPull)

app.post('/verifyemail/:user_id', emailVerify)

app.get('/lead/:lead_id', getLead)

app.post('/lead/:lead_id', postLead)

app.patch('/lead/:lead_id', patchLead)

app.post('/notes/lead/:lead_id', getLeadNote)

app.patch('/notes/lead/:lead_id/:user_id/:notes_id', patchNote)

app.delete('/notes/lead/:lead_id/:user_id/:notes_id', deleteLead)

// Analytics endpoints
app.get('/analytics/stats', getAnalyticsStats)
app.get('/analytics/channels', getAnalyticsChannels)
app.get('/analytics/niches', getAnalyticsNiches)
app.get('/analytics/opportunities', getOpportunities)
app.get('/allchannels', getAllChannels)
app.get('/allvideos', getAllVideos)
app.get('/newchannels', getNewChannels)

// app.use((req, _res, next) => { console.log('➡️ ', req.method, req.url); next(); });


// Make io accessible to controller functions
app.set('io', io);

// Import sequelize for broadcasting updates
const Sequelize = require('sequelize');
const { CONNECTION_STRING } = process.env;
const sequelize = new Sequelize(CONNECTION_STRING, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

// Track active connections and polling interval
let activeConnections = 0;
let analyticsInterval = null;

// Function to broadcast analytics updates
const broadcastAnalytics = async () => {
  try {
    // Fetch total channels
    const channelsResult = await sequelize.query(`SELECT COUNT(*) FROM channel`);
    const totalChannels = parseInt(channelsResult[0][0].count);

    // Fetch total videos
    const videosResult = await sequelize.query(`SELECT COUNT(*) FROM videos`);
    const totalVideos = parseInt(videosResult[0][0].count);

    // Fetch new channels (4 weeks)
    const newChannelsResult = await sequelize.query(`
      SELECT COUNT(*)::int AS new_channels_count
      FROM public.channel c
      WHERE
        c.sub_count_num IS NOT NULL
        AND c.sub_count_num < 100000
        AND EXISTS (
          SELECT 1
          FROM public.videos v
          WHERE v.channel_url = c.channel_url
            AND v.views > 100000
        )
        AND c.not_interested IS FALSE
        AND c.first_upload_date >= (CURRENT_DATE - INTERVAL '4 weeks')
    `);
    const newChannelsCount = newChannelsResult[0][0]?.new_channels_count || 0;

    // Fetch viral small channels (subs < 100k, views > 100k)
    const viralSmallResult = await sequelize.query(`
      SELECT COUNT(DISTINCT c.channel_id)::int AS viral_small_count
      FROM public.channel c
      WHERE
        c.sub_count_num IS NOT NULL
        AND c.sub_count_num < 100000
        AND EXISTS (
          SELECT 1
          FROM public.videos v
          WHERE v.channel_url = c.channel_url
            AND v.views > 100000
        )
    `);
    const viralSmallChannels = viralSmallResult[0][0]?.viral_small_count || 0;

    // Broadcast to all connected clients
    io.emit('analytics:update', {
      totalChannels,
      totalVideos,
      newChannelsCount,
      viralSmallChannels,
      timestamp: new Date()
    });

    console.log('📊 Broadcasted analytics update:', { totalChannels, totalVideos, newChannelsCount, viralSmallChannels });
  } catch (error) {
    console.error('Error broadcasting analytics:', error);
  }
};

// Start polling when clients are connected
const startPolling = () => {
  if (!analyticsInterval) {
    console.log('🚀 Starting analytics polling (30s interval)');
    // Send initial update immediately
    broadcastAnalytics();
    // Then continue every 30 seconds
    analyticsInterval = setInterval(broadcastAnalytics, 30000);
  }
};

// Stop polling when no clients are connected
const stopPolling = () => {
  if (analyticsInterval) {
    console.log('⏸️  Stopping analytics polling (no active connections)');
    clearInterval(analyticsInterval);
    analyticsInterval = null;
  }
};

// Socket.io connection handling
io.on('connection', (socket) => {
  activeConnections++;
  console.log(`🔌 Client connected: ${socket.id} (${activeConnections} active)`);

  // Start polling if this is the first connection
  if (activeConnections === 1) {
    startPolling();
  }

  // Send initial data when client connects
  socket.emit('connected', { message: 'Connected to real-time updates' });

  socket.on('disconnect', () => {
    activeConnections--;
    console.log(`❌ Client disconnected: ${socket.id} (${activeConnections} active)`);

    // Stop polling if no more connections
    if (activeConnections === 0) {
      stopPolling();
    }
  });
});

const PORT = process.env.PORT_NUM || 4005;
server.listen(PORT, () => console.log(`API listening on http://localhost:${PORT} (pid ${process.pid})`));
