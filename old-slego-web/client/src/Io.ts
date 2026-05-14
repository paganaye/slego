import * as IO from 'socket.io-client';


declare var io: typeof IO.io;

// Check if running on localhost
const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

// Dynamically create script element
const script = document.createElement('script');
script.type = 'text/javascript';

// Set script source based on environment
if (isLocalhost) {
  script.src = "https://ganaye.com/slego-io-dev/socket.io-client.js";
} else {
  script.src = "https://ganaye.com/slego-io/socket.io-client.js";
}

// Append to head
document.head.appendChild(script);

// Initialize Socket.io after script is loaded
script.onload = function () {
  // at this stage dev and production servers are the same but on a different path
  const socketUrl = isLocalhost ? 'https://ganaye.com/' : 'https://ganaye.com/';
  const path = isLocalhost ? '/slego-io-dev/io' : '/slego-io/io';
  const socket = io(socketUrl, { path });

  // When successfully connected to the server
  socket.on('connect', () => {
    console.log('Connected to the server.');
  });

  // When disconnected from the server
  socket.on('disconnect', () => {
    console.log('Disconnected from the server.');
  });

  // A simple test event to ensure client-server communication
  socket.on('message', (data) => {
    console.log('Received message:', data);
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  socket.on('connect_error', (error) => {
    console.error('Connection Error:', error);
  });

  socket.on('connect_timeout', () => {
    console.error('Connection Timeout');
  });

  socket.on('reconnect_attempt', () => {
    console.log('Attempting to Reconnect...');
  });

  socket.on('serverResponse', (data) => {
    console.log('Received serverResponse message:', data.message, 'from:', data.from);
  });

  // Sending a test message after connection (optional)
  socket.emit('send', JSON.stringify({ message: 'Hello from client!' }));
};
