// Horse1986!
const express = require('express')
const cors = require("cors");
require('dotenv').config()

const { PORT_NUM } = process.env

const app = express();

// app.use(express.static('public'))
app.use(cors())
app.use(express.json())

const {seed, registerFunc, loginFunc, selectLeadsFunc, scrapeGoogleFunc, scrapeYPFunc, getDashboard, patchDashboard, postDashboard, getLead, postLead, patchLead, deleteLead, deleteDashboard, emailPull, emailVerify, getLeadNote, patchNote} = require('./controller.js');

app.get('/seed', seed)

app.post('/register', registerFunc)

app.post('/login', loginFunc)

app.post('/selectleads', selectLeadsFunc)

app.get('/dashboard/:user_id', getDashboard)

app.patch('/dashboard/:lead_id', patchDashboard)

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


app.listen(PORT_NUM, ()=>{
  console.log(`Server running on port # ${PORT_NUM}`)
})