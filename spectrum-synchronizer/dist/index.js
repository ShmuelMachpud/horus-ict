"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./helpers/pino");
const config_client_1 = require("./helpers/postgres/config-client");
const create_tables_1 = require("./helpers/postgres/create-tables");
const sync_tables_1 = require("./helpers/postgres/sync-tables");
const ORM_1 = require("./orm/models/ORM");
const handleError_1 = require("./utils/handleError");
ORM_1.ORM.connect(config_client_1.config)
    .then(() => (0, create_tables_1.createTables)())
    .then(() => (0, sync_tables_1.syncTables)())
    .catch((error) => (0, handleError_1.handleError)(error, 'Failed to run server:', 'INITIAL SERVER'));
