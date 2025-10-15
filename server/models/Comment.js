import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
  },
  text : String,
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'Comment',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Comment', CommentSchema);    