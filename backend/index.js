import express from 'express';
import setup from './api.js';

const app = express();
const port = 3000;

setup(app, port);
