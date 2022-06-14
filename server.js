const express = require('express');
const cors = require('cors');
const path = require('path');

let subscribers = {};

const subscribe = (req, res) => {
  const id = Date.now();

  res.header({
    'Content-Type': 'text/plain;charset=utf-8',
    'Cache-Control': 'no-cache, must-revalidate',
  });

  subscribers[id] = res;

  req.on('close', () => {
    delete subscribers[id];
  });
};

const publish = message => {
  for (let id in subscribers) {
    const res = subscribers[id];
    res.send(message);
  }

  subscribers = {};
};

const app = express();

app.use(express.json());
app.use(cors());
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
