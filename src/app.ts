import 'dotenv/config';
import express from 'express';
import { connectDB } from './database';
import router from './routes/index';

const app = express();
const PORT = process.env.PORT || 8080;

connectDB();

app.use(express.json());
app.use('/', router);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
