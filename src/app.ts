import appConfig from './config';
import server from './server';
import { AppDataSource } from '@database/data-source';
import logger from '@loggers/index';

const PORT = appConfig.node.port;
const BASE_URL = appConfig.node.baseUrl;
(async () => {
    if (!AppDataSource.isInitialized) {
        const conn = await AppDataSource.initialize();
        const { isInitialized, isConnected, name } = conn;
        logger.info('db connected', { isInitialized, isConnected, name });
    } else {
        logger.info('db already connected', {
            isInitialized: AppDataSource.isInitialized,
            isConnected: AppDataSource.isConnected,
            name: AppDataSource.name,
        });
    }
    server.listen(PORT, () => {
        console.info(`Starting server on ${BASE_URL}:${PORT}`);
    });
})().catch(console.error);
