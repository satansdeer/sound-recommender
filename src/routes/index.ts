import express from 'express';
import soundsController from '../controllers/soundsController';
import playlistsController from '../controllers/playlistsController';

const router = express.Router();

router.post('/admin/sounds', soundsController.createSound);
router.get('/sounds', soundsController.listSounds);

router.post('/playlists', playlistsController.createPlaylist);
router.get('/sounds/recommended', playlistsController.getRecommendedSounds);

export default router;
