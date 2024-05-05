import { Request, Response } from 'express';
import { getDb } from '../database';
import { IPlaylist, validatePlaylist } from '../models/playlist';
import { ObjectId } from 'mongodb';
import handleError from '../utils/handleError';

interface IPlaylistRequest {
    title: string;
    sounds: string[];
}

const createPlaylist = async (req: Request, res: Response) => {
    const playlistsData: IPlaylistRequest[] = req.body.data;

    if (!Array.isArray(playlistsData) || playlistsData.length === 0) {
        return res.status(400).json({ message: 'Invalid playlist data, expected an array of playlists' });
    }

    const invalidPlaylist = playlistsData.find(playlist => !validatePlaylist(playlist));
    if (invalidPlaylist) {
        return res.status(400).json({ message: 'One or more playlists are invalid' });
    }

    try {
        const db = getDb();
        const playlistsToInsert = playlistsData.map(playlist => ({
            title: playlist.title,
            sounds: playlist.sounds.map(soundId => new ObjectId(soundId))
        }));

        const result = await db.collection('playlists').insertMany(playlistsToInsert);
        if (result.acknowledged) {
            const ids = Object.values(result.insertedIds);
            const newPlaylists = await db.collection('playlists').find({_id: { $in: ids }}).toArray();
            const responseData = newPlaylists.map(playlist => ({
                id: playlist._id.toString(),
                title: playlist.title,
                sounds: playlist.sounds.map((id: ObjectId) => id.toString()) // Explicitly type the parameter as ObjectId
            }));
            res.status(201).json({ data: responseData });
        } else {
            res.status(500).json({ message: 'Insert operation failed' });
        }
    } catch (error: unknown) {
        handleError({
            res,
            error,
            message: 'Failed to create playlists'
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

