
const express = require('express')
const cors = require("cors");
require('dotenv').config()

const { PORT_NUM } = process.env

const app = express();

app.use(cors({
  // origin: "https://dv-mtn-capstone.vercel.app",
  origin: "http://localhost:5023",
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

const {seed, registerFunc, patchChannel, loginFunc, selectLeadsFunc, scrapeGoogleFunc, scrapeYPFunc, getDashboard, patchDashboard, postDashboard, getLead, postLead, patchLead, deleteLead, deleteDashboard, emailPull, emailVerify, getLeadNote, patchNote} = require('./controller.js');

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

// app.use((req, _res, next) => { console.log('➡️ ', req.method, req.url); next(); });


const PORT = process.env.PORT_NUM || 5023;
app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT} (pid ${process.pid})`));

