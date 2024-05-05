import { Request, Response } from 'express';
import { getDb } from '../database';
import { ISound, validateSound } from '../models/sound';
import handleError from '../utils/handleError';

const createSound = async (req: Request, res: Response) => {
    const sounds: ISound[] = req.body.data;

    if (!Array.isArray(sounds) || sounds.length === 0) {
        return res.status(400).json({ message: 'Invalid sound data, expected an array of sounds' });
    }

    const invalidSound = sounds.find(sound => !validateSound(sound));
    if (invalidSound) {
        return res.status(400).json({ message: 'One or more sounds are invalid' });
    }

    try {
        const db = getDb();
        const result = await db.collection('sounds').insertMany(sounds);
        if (result.acknowledged) {
            const ids = Object.values(result.insertedIds);
            const newSounds = await db.collection('sounds').find({
                _id: { $in: ids }
            }).toArray();
            const responseData = newSounds.map(sound => ({
                id: sound._id.toString(),
                title: sound.title,
                bpm: sound.bpm,
                genres: sound.genres,
                durationInSeconds: sound.durationInSeconds,
                credits: sound.credits
            }));
            res.status(201).json({ data: responseData });
        } else {
            res.status(500).json({ message: 'Insert operation failed' });
        }
    } catch (error: unknown) {
        handleError({
            res,
            error,
            message: 'Failed to create sounds'
        });
    }
};

const listSounds = async (req: Request, res: Response) => {
    try {
        const db = getDb();
        const sounds = await db.collection('sounds').find({}).toArray();
        
        const responseData = sounds.map(sound => ({
            id: sound._id.toString(),
            title: sound.title,
            bpm: sound.bpm,
            genres: sound.genres,
            durationInSeconds: sound.durationInSeconds,
            credits: sound.credits
        }));

        if (responseData.length > 0) {
            res.status(200).json({ data: responseData });
        } else {
            res.status(404).json({ message: 'No sounds found' });
        }
    } catch (error: unknown) {
        handleError({
            res,
            error,
            message: 'Failed to list sounds'
        });
    }
};

export default {
    createSound,
    listSounds
};

