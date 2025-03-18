import 'reflect-metadata';
import express from 'express';
import bodyparser from 'body-parser';
import routes from './routes/routes';
import AppDataSource from './config/orm.config';
import { authenticateJWT } from './middlewares/authMiddleware';
import { errorHandler } from './middlewares/errorHandler';

const app = express();
const PORT = process.env.PORT|| 3000;

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
app.use(errorHandler);
app.use('/api/', authenticateJWT, routes);

AppDataSource.initialize()
.then(() => {
    console.log('Database connection established');
    app.listen(PORT,() => {
        console.log(`Combat service is running on ${PORT}`);
    });
})
.catch((error) => console.error('Database connection error:', error));

export default app;
