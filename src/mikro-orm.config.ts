import { defineConfig } from '@mikro-orm/postgresql';
import { ReflectMetadataProvider } from '@mikro-orm/decorators/legacy';
import { Game } from './games/entities/game.entity.js';
import { Migrator } from '@mikro-orm/migrations';

export default defineConfig({
    host: '127.0.0.1',
    port: 5432,
    user: 'game_session',
    password: 'game_session_dev',
    dbName: 'game_session',

    entities:  [Game],
    metadataProvider: ReflectMetadataProvider,
    extensions: [Migrator],

    migrations: {
        path: '.dist/src/migrations',
        pathTs: 'src/migrations',
        emit: 'ts',
    }
});