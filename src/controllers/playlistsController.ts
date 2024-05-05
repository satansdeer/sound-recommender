import { Request, Response } from 'express';
import { getDb } from '../database';
import { IPlaylist, validatePlaylist } from '../models/playlist';
import { ObjectId } from 'mongodb';
import handleError from '../utils/handleError';

const createPlaylist = async (req: Request, res: Response) => {
    const playlist: IPlaylist = req.body;
    if (!validatePlaylist(playlist)) {
        return res.status(400).json({ message: 'Invalid playlist data' });
    }

    try {
        const db = getDb();
        const result = await db.collection('playlists').insertOne(playlist);
        if (result.acknowledged) {
            const newPlaylist = await db.collection('playlists').findOne({_id: result.insertedId});
            res.status(201).json(newPlaylist);
        } else {
            res.status(500).json({ message: 'Insert operation failed' });
        }
    } catch (error: unknown) {
        handleError({
            res,
            error,
            message: 'Failed to create playlist'
        });
    }
};

const getRecommendedSounds = async (req: Request, res: Response) => {
    const playlistId = req.query.playlistId;
    if (!playlistId) {
        return res.status(400).json({ message: 'Playlist ID is required' });
    }

    try {
        const db = getDb();
        const playlist = await db.collection('playlists').findOne({_id: new ObjectId(playlistId as string)});
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        const sounds = await db.collection('sounds').find({_id: { $in: playlist.sounds.map((soundId: string) => new ObjectId(soundId)) }}).toArray();
        if (sounds.length > 0) {
            const recommendedSound = sounds[Math.floor(Math.random() * sounds.length)];
            res.status(200).json(recommendedSound);
        } else {
            res.status(404).json({ message: 'No sounds found in the playlist for recommendation' });
        }
    } catch (error: unknown) {
        handleError({
            res,
            error,
            message: 'Failed to get recommended sounds'
        });
    }
};

export default {
    createPlaylist,
    getRecommendedSounds
};

