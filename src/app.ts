import appConfig from './config';
import server from './server';

const PORT = appConfig.node.port;
const BASE_URL = appConfig.node.baseUrl;
(async () => {
    server.listen(PORT, () => {
        console.info(`Starting server on ${BASE_URL}:${PORT}`);
    });
})().catch(console.error);
