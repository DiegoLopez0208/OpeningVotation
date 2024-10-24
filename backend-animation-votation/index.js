import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import cors from 'cors';
import { userHandler } from './handler/usersHandler.js';
import { openingsHandler } from './handler/openingsHandler.js';
import { votesHandler } from './handler/votesHandler.js'
import { adminHandler } from './handler/adminHandler.js';

import { config } from 'dotenv';
config()

// Get the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT

mongoose.connect(process.env.MONGODB, {})
.then(() => {
    console.log('Conectado a la base de datos!');
})

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use('/videos', express.static(path.join(__dirname, 'videos')));
app.use(express.json())
app.use(cors())

userHandler(app);
openingsHandler(app);
votesHandler(app);
adminHandler(app);

app.listen(PORT, () => {
    console.log("Escuchando en puerto", PORT);
})