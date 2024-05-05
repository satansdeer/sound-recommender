import { ObjectId } from 'mongodb';

export interface ISound {
    _id?: ObjectId;
    title: string;
    bpm: number;
    genres: string[];
    durationInSeconds: number;
    credits: Array<{ name: string; role: string }>;
}

export function validateSound(sound: ISound): boolean {
    if (!sound.title || sound.bpm <= 0 || sound.durationInSeconds <= 0) {
        return false;
    }
    if (!sound.genres.length || sound.credits.some(credit => !credit.name || !credit.role)) {
        return false;
    }
    return true;
}
