import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/soundRecommender';
const client = new MongoClient(uri);

const connectDB = async () => {
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Connected successfully to MongoDB");
    } catch (error: unknown) {
        if(error instanceof Error) {
            console.error(`Connection error: ${error.message}`);
        } else {
            console.error("An unexpected error occured")
        }
        process.exit(1);
    }
};

const getDb = () => {
    return client.db();
}

export { connectDB, getDb };
