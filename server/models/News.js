import mongoose from 'mongoose';

const NewsSchema = new mongoose.Schema({
    title: String,
    content: String,
    image: String,
    date: { type: Date, default: Date.now }
});

export default mongoose.model('News', NewsSchema);
