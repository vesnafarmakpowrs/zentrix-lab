import 'reflect-metadata';
import express from 'express';
import bodyparser from 'body-parser';
import routes from './routes/routes';
import AppDataSource from './config/database/data-source';
import { authenticateJWT } from './middlewares/authMiddleware';
import { errorHandler } from './middlewares/errorHandler';
import logger from './config/logger.config';

export const app = express();
const PORT = process.env.CHARACTER_SERVICE_PORT || 3002;

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(errorHandler);

// Initialize database before routes
const initializeApp = async () => {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
            logger.info('Database connection initialized');
        }

        app.use('/api', authenticateJWT, routes);

        if (process.env.NODE_ENV !== 'test') {
            app.listen(PORT, () => {
                logger.info(`Character service is running on port ${PORT}`);
            });
        }
    } catch (error) {
        logger.error('Failed to initialize app:', error);
        process.exit(1);
    }
};

initializeApp();

export default app;