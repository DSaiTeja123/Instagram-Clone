import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MONGO_URI is not defined in environment variables.");
    process.exit(1);
  }
  await mongoose.connect(uri);
  console.log("Connected to MongoDB");
};

export default connectDB;
