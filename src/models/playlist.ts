import mongoose, { Document } from 'mongoose';

interface IPlaylist extends Document {
    title: string;
    sounds: mongoose.Schema.Types.ObjectId[];
}

const playlistSchema = new mongoose.Schema({
    title: { type: String, required: true },
    sounds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sound' }]
});

const Playlist = mongoose.model<IPlaylist>('Playlist', playlistSchema);

export default Playlist;

