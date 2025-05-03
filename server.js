const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const basicAuth = require('express-basic-auth');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Projects & Contact APIs
app.get('/api/projects', (req, res) => {
  const data = fs.readFileSync('projects.json');
  res.json(JSON.parse(data));
});
app.post('/api/contact', (req, res) => {
  const {name,email,message} = req.body;
  if(!name||!email||!message) return res.status(400).json({error:'All fields required'});
  const line = `${new Date().toISOString()} | ${name}<${email}>: ${message}\n`;
  fs.appendFileSync('messages.txt', line);
  res.json({message:'Thank you for your message!'});
});

// Admin protection
app.use('/admin', basicAuth({
  users: { 'admin': 'StrongPassword123' },
  challenge: true
}));

// Serve admin dashboard & raw data
app.get('/admin', (req,res) => res.sendFile(path.join(__dirname,'admin.html')));
app.get('/admin/projects', (req,res) => res.sendFile(path.join(__dirname,'projects.json')));
app.get('/admin/messages', (req,res) => res.sendFile(path.join(__dirname,'messages.txt')));

// Start
app.listen(PORT, ()=>console.log(`Server → http://localhost:${PORT}`));
