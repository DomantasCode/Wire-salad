// backend/server.js - MERN Version
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Person from './personModel.js'; // Import our new Mongoose model

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// --- Middleware ---
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
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
        // Note: The `_id` will be created automatically by MongoDB
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
    console.log(`🚀 Backend server is running on http://localhost:${PORT}`);
});