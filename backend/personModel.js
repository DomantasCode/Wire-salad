import mongoose from 'mongoose';

const personSchema = new mongoose.Schema({
    name: { type: String, required: true },
    department: String,
    specialty: String,
    roleLevel: String,
    location: String,
    shortBio: String,
    howIGotInto: String,
    hobbies: [String],
    funnyFact: String,
    startDate: String,
    imageUrl: String,
}, {
    // This adds `createdAt` and `updatedAt` timestamps automatically
    timestamps: true
});

const Person = mongoose.model('Person', personSchema);

export default Person;
