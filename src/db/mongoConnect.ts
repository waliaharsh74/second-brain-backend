import * as dotenv from 'dotenv'
import mongoose from "mongoose";
dotenv.config();
const mongoConnect = async () => {
    try {

        await mongoose.connect(process.env.MONGO_URI || '', {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });
        console.log('MongoDB connected');

    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}

export { mongoConnect }