import { Schema, model } from 'mongoose';

const votesSchema = new Schema({
    openingId: {
        type: Schema.Types.ObjectId, 
        required: true,
        ref: 'Opening' 
    },
    userId: {
        type: Schema.Types.ObjectId, 
        required: true,
        ref: 'User' 
    },
    submittedBy: {
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
