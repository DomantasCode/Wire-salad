// Complete and final backend/server.js for deployment

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Person from './personModel.js'; // Import our Mongoose model
import path from 'path';
import { fileURLToPath } from 'url';

// --- SETUP ---
// Load environment variables from .env file for local development
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
// Render sets a PORT environment variable, so we use that. For local, we use 3001.
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI;

// --- MIDDLEWARE ---

// ** THIS IS THE CRITICAL UPDATE FOR PHASE 3 **
// Configure CORS to only allow requests from your live frontend domain
const corsOptions = {
    origin: 'https://www.dmcademy.com',
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// --- PRODUCTION: SERVE FRONTEND FILES ---
// This tells Express to serve the built React app from the 'dist' folder
app.use(express.static(path.join(__dirname, '../my-team-app/dist')));

// --- DATABASE CONNECTION ---
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Successfully connected to MongoDB Atlas'))
    .catch(err => console.error('❌ Connection error', err));

// --- API ROUTES ---

// GET /api/people - Get all people
app.get('/api/people', async (req, res) => {
    try {
        const people = await Person.find({});
        res.json(people);
    } catch (error) {
        res.status(500).json({ message: "Error fetching people", error: error.message });
    }
});

// POST /api/people - Add a new person
app.post('/api/people', async (req, res) => {
    try {
        const newPerson = new Person(req.body);
        const savedPerson = await newPerson.save();
        res.status(201).json(savedPerson);
    } catch (error) {
        res.status(500).json({ message: "Error creating person", error: error.message });
    }
});

// DELETE /api/people/:id - Delete a person
app.delete('/api/people/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPerson = await Person.findByIdAndDelete(id);
        if (!deletedPerson) return res.status(404).json({ message: "Person not found" });
        res.status(204).send(); // Success, no content to send back
    } catch (error) {
        res.status(500).json({ message: "Error deleting person", error: error.message });
    }
});

// PUT /api/people/:id - Update a person
app.put('/api/people/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedPerson = await Person.findByIdAndUpdate(id, req.body, { new: true }); // {new: true} returns the updated document
        if (!updatedPerson) return res.status(404).json({ message: "Person not found" });
        res.json(updatedPerson);
    } catch (error) {
        res.status(500).json({ message: "Error updating person", error: error.message });
    }
});

// --- PRODUCTION: "CATCH-ALL" ROUTE ---
// This must be the LAST route. It sends the React app's index.html for any
// request that doesn't match an API route.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../my-team-app/dist', 'index.html'));
});

// --- START SERVER ---
app.listen(PORT, () => {
    console.log(`🚀 Backend server is running on port ${PORT}`);
});
