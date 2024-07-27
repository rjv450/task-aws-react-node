import express from 'express';

const app = express();

app.use(express.json());

// Your route handlers would go here
// Example: app.use('/api', apiRoutes);

export default app;