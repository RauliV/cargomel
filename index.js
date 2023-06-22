
import handleRequest from './api.js'
import http from 'stream-http'
import mongoose from 'mongoose';

const PORT = 3000;

/*

// Connect to MongoDB
//mongoose.connect('mongo-db:/data/db:27017', { useNewUrlParser: true, useUnifiedTopology: true });
//mongoose.connect('mongodb://mongo-db/data/db:27017', { useNewUrlParser: true, useUnifiedTopology: true });
*/
mongoose.connect('mongodb://127.0.0.1:27017/fronius', { useNewUrlParser: true, useUnifiedTopology: true });


// Confirm that the connection has been established
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

// Handle any connection errors
mongoose.connection.on('error', (err) => {
  console.error('Error connecting to MongoDB', err);
});



const server = http.createServer(handleRequest);

server.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});

