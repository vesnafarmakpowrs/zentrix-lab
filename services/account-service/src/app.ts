import 'reflect-metadata';
import express from 'express';
import bodyParser from 'body-parser';
import AppDataSource, { initialize } from './config/orm.config';
import authRoutes from './routes/auth.routes';
import logger from './config/logger.config';

const app = express();
const PORT = process.env.ACCOUNT_SERVICE_PORT || 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);

const initializeApp = async () => {
    try {
        await initialize(); // This will create DB and initialize DataSource
        logger.info('Database connection initialized');

        if (process.env.NODE_ENV !== 'test') {
            app.listen(PORT, () => {
                logger.info(`Account Service running on port ${PORT}`);
            });
        }
    } catch (error) {
        logger.error('Failed to initialize app:', error);
        process.exit(1);
    }
};

initializeApp();

export default app;