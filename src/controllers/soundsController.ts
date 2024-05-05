import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import { getDb, getClient } from '../database';
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

const getSound = async (req: Request, res: Response) => {
    try {
        const soundId = req.params.id;
        const db = getDb();
        const sound = await db.collection('sounds').findOne({ _id: new ObjectId(soundId) });

        if (!sound) {
            res.status(404).json({ message: 'Sound not found' });
        } else {
            const responseData = {
                id: sound._id.toString(),
                title: sound.title,
                bpm: sound.bpm,
                genres: sound.genres,
                durationInSeconds: sound.durationInSeconds,
                credits: sound.credits
            };
            res.status(200).json({ data: responseData });
        }
    } catch (error) {
        handleError({
            res,
            error,
            message: 'Failed to retrieve sound'
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

const deleteSound = async (req: Request, res: Response) => {
    let session;
    try {
        const soundId = req.params.id;
        const db = getDb();
        const client = getClient();

        session = await client.startSession();
        session.startTransaction();

        const playlists = await db.collection('playlists')
                                  .find({ sounds: new ObjectId(soundId) })
                                  .toArray();

        if (playlists.length > 0) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "Sound is referenced in playlists and cannot be deleted." });
        }

        await db.collection('sounds').deleteOne({ _id: new ObjectId(soundId) }, { session });

        await session.commitTransaction();
        session.endSession();
        
        res.send({ message: 'Sound deleted successfully' });
    } catch (error) {
        if (session) {
            await session.abortTransaction();
            session.endSession();
        }
        handleError({
            res,
            error,
            message: 'Failed to delete sound'
        });
    }
};

export default {
    deleteSound,
    createSound,
    listSounds,
    getSound
};

