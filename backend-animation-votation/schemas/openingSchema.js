import { Schema, model } from 'mongoose';

const openingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    start: {
        type: Number,
        required: true,
    },
    chorus: {
        type: Number,
        required: true,
    },
    alphabeticalOrder: {
        type: Number,
    }
});

const Opening = model('Opening', openingSchema);

export default Opening;
