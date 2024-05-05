import express from 'express';
import soundsController from '../controllers/soundsController';
import playlistsController from '../controllers/playlistsController';

const router = express.Router();

router.post('/playlists', playlistsController.createPlaylist);
router.get('/sounds/recommended', playlistsController.getRecommendedSounds);

router.post('/admin/sounds', soundsController.createSound);
router.get('/sounds', soundsController.listSounds);
router.get('/sounds/:id', soundsController.getSound);
router.delete('/sounds/:id', soundsController.deleteSound);

export default router;

