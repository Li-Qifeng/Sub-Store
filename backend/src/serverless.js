import express from 'express';
import bodyParser from 'body-parser';
import $ from './core/app.js';

import registerSubscriptionRoutes from './restful/subscriptions.js';
import registerCollectionRoutes from './restful/collections.js';
import registerArtifactRoutes from './restful/artifacts.js';
import registerFileRoutes from './restful/file.js';
import registerTokenRoutes from './restful/token.js';
import registerModuleRoutes from './restful/module.js';
import registerSyncRoutes from './restful/sync.js';
import registerDownloadRoutes from './restful/download.js';
import registerSettingRoutes from './restful/settings.js';
import registerPreviewRoutes from './restful/preview.js';
import registerSortingRoutes from './restful/sort.js';
import registerMiscRoutes from './restful/miscs.js';
import registerNodeInfoRoutes from './restful/node-info.js';
import registerParserRoutes from './restful/parser.js';

const DEFAULT_HEADERS = {
    'Content-Type': 'text/plain;charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST,GET,OPTIONS,PATCH,PUT,DELETE',
    'Access-Control-Allow-Headers':
        'Origin, X-Requested-With, Content-Type, Accept',
    'X-Powered-By': process.env.SUB_STORE_X_POWERED_BY || 'Sub-Store',
};

function rawBodySaver(req, _res, buf, encoding) {
    if (buf && buf.length) {
        req.rawBody = buf.toString(encoding || 'utf8');
    }
}

export function createApp() {
    const app = express();
    const limit = process.env.SUB_STORE_BODY_JSON_LIMIT || '1mb';
    $.info(`[BACKEND] body JSON limit: ${limit}`);

    app.use(
        bodyParser.json({
            verify: rawBodySaver,
            limit,
        }),
    );
    app.use(
        bodyParser.urlencoded({ verify: rawBodySaver, extended: true }),
    );
    app.use(bodyParser.raw({ verify: rawBodySaver, type: '*/*' }));
    app.use((_, res, next) => {
        res.set(DEFAULT_HEADERS);
        next();
    });

    registerCollectionRoutes(app);
    registerSubscriptionRoutes(app);
    registerDownloadRoutes(app);
    registerPreviewRoutes(app);
    registerSortingRoutes(app);
    registerSettingRoutes(app);
    registerArtifactRoutes(app);
    registerFileRoutes(app);
    registerTokenRoutes(app);
    registerModuleRoutes(app);
    registerSyncRoutes(app);
    registerNodeInfoRoutes(app);
    registerMiscRoutes(app);
    registerParserRoutes(app);

    app.get('*', function (_req, res) {
        res.status(404).end();
    });

    return app;
}

const app = createApp();

export default function handler(req, res) {
    return app(req, res);
}
