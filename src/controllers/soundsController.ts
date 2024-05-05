import { Request, Response } from 'express';

export default {
  createSound: (req: Request, res: Response) => {
    res.status(201).send('Sound created');
  },
  listSounds: (req: Request, res: Response) => {
    res.status(200).send('List of sounds');
  }
};

