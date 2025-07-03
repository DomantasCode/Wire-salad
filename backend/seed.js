import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Person from './personModel.js';
import fs from 'fs/promises';
import path from 'path';

dotenv.config();

// This data is from your old database.json file
const seedData = [
    {
        "name": "Alex Johnson",
        "department": "Upper Management",
        "specialty": "CEO",
        "roleLevel": "Team Lead",
        "location": "San Francisco, CA",
        "shortBio": "Visionary leader with a passion for innovation and building high-performing teams.",
        "howIGotInto": "Started coding at a young age and was fascinated by how technology could solve real-world problems.",
        "hobbies": ["Hiking", "Reading", "Playing chess"],
        "funnyFact": "Once tried to teach a squirrel to fetch, with limited success. It preferred burying nuts.",
        "startDate": "2020-01-15",
        "imageUrl": "https://placehold.co/128x128/C3C2B9/FFFFFF?text=AJ"
    },
    {
        "name": "David Lee",
        "department": "Engineering",
        "specialty": "Lead Software Engineer",
        "roleLevel": "Team Lead",
        "location": "Austin, TX",
        "shortBio": "Experienced software engineer specializing in scalable backend systems.",
        "howIGotInto": "Was inspired by classic video games to understand how they worked, which led to a lifelong journey in software development.",
        "hobbies": ["Gaming", "Cycling", "Playing guitar"],
        "funnyFact": "His coffee mug is an actual keyboard. Don't ask how he drinks from it.",
        "startDate": "2020-06-20",
        "imageUrl": "https://placehold.co/128x128/C3C2B9/FFFFFF?text=DL"
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB to seed data...');

        // Clear existing data
        await Person.deleteMany({});
        console.log('🗑️  Old data deleted.');

        // Insert new data
        await Person.insertMany(seedData);
        console.log('🌱 Data seeded successfully!');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        // Disconnect from the database
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB.');
        process.exit();
    }
};

seedDB();