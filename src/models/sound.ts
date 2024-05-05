import mongoose, { Document } from 'mongoose';

interface ISound extends Document {
    title: string;
    bpm: number;
    genres: string[];
    durationInSeconds: number;
    credits: Array<{ name: string; role: string }>;
}

const soundSchema = new mongoose.Schema({
    title: { type: String, required: true },
    bpm: { type: Number, required: true },
    genres: [{ type: String, required: true }],
    durationInSeconds: { type: Number, required: true },
    credits: [{
        name: { type: String, required: true },
        role: { type: String, required: true }
    }]
});

const Sound = mongoose.model<ISound>('Sound', soundSchema);

export default Sound;

