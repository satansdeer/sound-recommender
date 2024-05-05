import { Request, Response } from 'express';

export default {
  createPlaylist: (req: Request, res: Response) => {
    res.status(201).send('Playlist created');
  },
  getRecommendedSounds: (req: Request, res: Response) => {
    res.status(200).send('Recommended sounds');
  }
};

