import 'dotenv/config';
import { defineConfig } from '@mikro-orm/postgresql';
import { ReflectMetadataProvider } from '@mikro-orm/decorators/legacy';
import { Game } from './games/entities/game.entity.js';
import { Migrator } from '@mikro-orm/migrations';

function requiredEnv(name: string): string {
    const value = process.env[name];

    if (value === undefined || value.trim() === '') {
        throw new Error(`Variavel de ambiente obriatória: ${name}`);
    }
    return value;
}

const dbPort = Number(requiredEnv('DB_PORT'));

if (!Number.isInteger(dbPort) || dbPort < 1 || dbPort > 65535) {
    throw new Error(`DB_PORT deve ser um inteiro entre 1 e 65535.`);
}

export default defineConfig({
    host: requiredEnv('DB_HOST'),
    port: dbPort,
    user: requiredEnv('POSTGRES_USER'),
    password: requiredEnv('POSTGRES_PASSWORD'),
    dbName: requiredEnv('POSTGRES_DB'),

    entities:  [Game],
    metadataProvider: ReflectMetadataProvider,
    extensions: [Migrator],

    migrations: {
        path: '.dist/src/migrations',
        pathTs: 'src/migrations',
        emit: 'ts',
    }
});