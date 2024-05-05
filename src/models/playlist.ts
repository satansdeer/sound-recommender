import { ObjectId } from 'mongodb';

export interface IPlaylist {
    _id?: ObjectId;
    title: string;
    sounds: string[];
}

export function validatePlaylist(playlist: IPlaylist): boolean {
    if (!playlist.title || !playlist.sounds.length) {
        return false;
    }
    return true;
}
