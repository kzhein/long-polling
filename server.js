const express = require('express');
const path = require('path');

const subscribers = new Map();

const subscribe = (req, res) => {
  res.header({
    'Content-Type': 'text/plain;charset=utf-8',
    'Cache-Control': 'no-cache, must-revalidate',
  });

  subscribers.set(req, res);

  req.on('close', () => {
    subscribers.delete(req);
  });
};

const publish = message => {
  subscribers.forEach(res => {
    res.send(message);
  });
};

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/messages', (req, res) => {
  subscribe(req, res);
});

app.post('/messages', (req, res) => {
  const { message } = req.body;
  publish(message);
  res.send('Success');
});

app.listen(4000, () => {
  console.log('Server listening on port 4000');
});
