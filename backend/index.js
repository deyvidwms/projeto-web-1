import express from 'express';
import setup from './api.js';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors({ origin: '*' }));

setup(app, PORT);
