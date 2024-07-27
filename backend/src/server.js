import app from '../index.js'; 
import http from 'http';
import { Server as socketIo } from 'socket.io';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import { ensureUsersTableExists } from './config/aws.js';
import { errorHandler } from './middleware/errorMiddleware.js';

const port = Number(process.env.PORT) || 5000;

const server = http.createServer(app);
const io = new socketIo(server);

app.set('socketio', io);
app.use(cors());
app.use(bodyParser.json());
app.use('/api', userRoutes);
app.use(errorHandler)
ensureUsersTableExists();

io.on('connection', (socket) => {
    console.log('New WebSocket connection');
    socket.on('disconnect', () => {
        console.log('WebSocket disconnected');
    });
    socket.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

app.get("/", (req, res) => {
    res.send("Hello, world!");
});

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
