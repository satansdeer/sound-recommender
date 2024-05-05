export interface IPlaylist {
    _id?: string;
    title: string;
    sounds: string[];
}

function validatePlaylist(playlist: IPlaylist): boolean {
    if (!playlist.title || !playlist.sounds.length) {
        return false;
    }
    return true;
}
