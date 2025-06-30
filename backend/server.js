// backend/server.js - FULL VERSION
import express from 'express';
import cors from 'cors';
import fs from 'fs/promises'; // Node.js File System module, for reading/writing files
import crypto from 'crypto'; // Node.js module to generate unique IDs

const app = express();
const PORT = 3001;

// --- Middleware ---
app.use(cors());
// This next line is very important! It allows your server to understand
// the JSON data sent from your frontend's forms.
// Increase the limit for JSON payloads
app.use(express.json({ limit: '50mb' }));
// Also add a limit for URL-encoded payloads (good practice)
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const DB_FILE_PATH = './database.json';

// --- API Endpoints ---

// GET /api/people
// This endpoint reads the database.json file and sends the list of people back.
app.get('/api/people', async (req, res) => {
    try {
        const fileContent = await fs.readFile(DB_FILE_PATH, 'utf-8');
        const data = JSON.parse(fileContent);
        console.log("Request for GET /api/people received. Sending data.");
        res.json(data.people);
    } catch (error) {
        console.error("Error reading database:", error);
        res.status(500).json({ message: "Error reading from database" });
    }
});

// POST /api/people
// This endpoint receives a new person's data, adds it to the database, and saves the file.
app.post('/api/people', async (req, res) => {
    try {
        const newPerson = req.body; // The new person data sent from the frontend
        console.log("Request for POST /api/people received with data:", newPerson.name);

        // Read the existing database
        const fileContent = await fs.readFile(DB_FILE_PATH, 'utf-8');
        const data = JSON.parse(fileContent);

        // Add a unique ID to the new person on the server
        newPerson.id = crypto.randomUUID();

        // Add the new person to the array
        data.people.push(newPerson);

        // Write the updated data back to the file
        await fs.writeFile(DB_FILE_PATH, JSON.stringify(data, null, 2));

        // Respond to the frontend with the newly created person (including the new ID)
        res.status(201).json(newPerson);
    } catch (error) {
        console.error("Error writing to database:", error);
        res.status(500).json({ message: "Error writing to database" });
    }
});
// DELETE /api/people/:id - Deletes a person by their ID
app.delete('/api/people/:id', async (req, res) => {
    try {
        const personIdToDelete = req.params.id;
        console.log("Request for DELETE /api/people/:id received for ID:", personIdToDelete);

        const fileContent = await fs.readFile(DB_FILE_PATH, 'utf-8');
        const data = JSON.parse(fileContent);

        // Filter the array to keep everyone EXCEPT the person to be deleted
        const updatedPeople = data.people.filter(p => p.id !== personIdToDelete);

        // Check if anyone was actually deleted. If not, the ID was not found.
        if (data.people.length === updatedPeople.length) {
            return res.status(404).json({ message: "Person not found" });
        }

        // Update the database with the new, shorter array
        data.people = updatedPeople;
        await fs.writeFile(DB_FILE_PATH, JSON.stringify(data, null, 2));

        // Send a success response with no content, which is standard for DELETE
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting from database:", error);
        res.status(500).json({ message: "Error deleting from database" });
    }
});
// PUT /api/people/:id - Updates a person by their ID
app.put('/api/people/:id', async (req, res) => {
    try {
        const personIdToUpdate = req.params.id;
        const updatedData = req.body;
        console.log("Request for PUT /api/people/:id received for ID:", personIdToUpdate);

        const fileContent = await fs.readFile(DB_FILE_PATH, 'utf-8');
        const data = JSON.parse(fileContent);

        let personFound = false;
        // Find the person and update their data
        const updatedPeople = data.people.map(person => {
            if (person.id === personIdToUpdate) {
                personFound = true;
                // Merge existing person data with the new updatedData from the form
                return { ...person, ...updatedData };
            }
            return person;
        });

        if (!personFound) {
            return res.status(404).json({ message: "Person not found" });
        }

        data.people = updatedPeople;
        await fs.writeFile(DB_FILE_PATH, JSON.stringify(data, null, 2));

        // Find and return the fully updated person as confirmation
        const savedPerson = data.people.find(p => p.id === personIdToUpdate);
        res.json(savedPerson);
    } catch (error) {
        console.error("Error updating database:", error);
        res.status(500).json({ message: "Error updating database" });
    }
});

// --- Start the server ---
app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
});