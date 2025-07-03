// Complete and final backend/server.js for deployment

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Person from './personModel.js'; // Import our Mongoose model

// --- SETUP ---
// Load environment variables from .env file for local development
dotenv.config();

const app = express();
// Render sets a PORT environment variable, so we use that. For local, we use 3001.
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI;

// --- MIDDLEWARE ---

// ** UPDATED CORS CONFIGURATION FOR PRODUCTION **
// This allows requests from both the 'www' and non-'www' versions of your domain.
const allowedOrigins = ['https://www.dmcademy.com', 'https://dmcademy.com'];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));


app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

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

// --- START SERVER ---
app.listen(PORT, () => {
    console.log(`🚀 Backend server is running on port ${PORT}`);
});
