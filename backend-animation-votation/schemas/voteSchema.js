import { Schema, model } from 'mongoose';

const votesSchema = new Schema({
    openingId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true
    },
    vote: {
        type: Number,
        required: true,
    }
});

const Vote = model('Vote', votesSchema);

export default Vote;
