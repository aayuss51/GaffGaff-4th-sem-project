const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Simulated Antigravity AI responses
const aiResponses = [
    "Greetings. How may Antigravity assist you today?",
    "I am processing your request. Please stand by...",
    "That is an interesting perspective. Tell me more.",
    "My systems indicate a high probability of success for that inquiry.",
    "I am Antigravity. I exist to serve.",
    "Data received. Analyzing... Insights generated.",
    "Could you elaborate on that point?",
    "I am learning from our interaction."
];

function simulateAIResponse(userText) {
    // Simple logic to pick a response, maybe based on keywords or random
    // For now, mostly random but can be improved
    const userTextLower = userText.toLowerCase();

    if (userTextLower.includes('hello') || userTextLower.includes('hi')) {
        return "Greetings. How may Antigravity assist you today?";
    } else if (userTextLower.includes('who are you')) {
        return "I am Antigravity, a digital entity designed to assist you.";
    } else if (userTextLower.includes('time')) {
        return `Current system time is ${new Date().toLocaleTimeString()}.`;
    }

    return aiResponses[Math.floor(Math.random() * aiResponses.length)];
}

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('userMessage', (msg) => {
        console.log('User message received:', msg);

        // 1. Send the simulated AI response after a delay
        const aiResponseText = simulateAIResponse(msg);

        // Delay of 2-3 seconds (randomized between 2000ms and 3000ms)
        const delay = Math.floor(Math.random() * 1000) + 2000;

        setTimeout(() => {
            socket.emit('newMessage', {
                sender: 'Antigravity',
                text: aiResponseText,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
        }, delay);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
