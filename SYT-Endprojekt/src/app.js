import express from 'express';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { initWebSocket } from './websocket.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json' assert { type: 'json' };
import cors from 'cors';
import router from './routes/weather.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:4200', // oder '*' für alle
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json());
app.use(express.static('public'));

app.use('/api/v1/weather', router);
app.use('/api/v1/weather/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const server = createServer(app);
initWebSocket(server); 

server.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});
