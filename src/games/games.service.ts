import { Injectable, NotFoundException } from '@nestjs/common';
import type { CreateGameDto } from './dto/create-game.dto.js';
import type { UpdateGameDto } from './dto/update-game.dto.js';

export interface Game {
    id: number;
    name: string;
    active: boolean;
}

@Injectable()
export class GamesService {
    private readonly games: Game[] = [
        { id: 1, name: 'Jungle Adventure', active: true },
        { id: 2, name: 'Crystal Quest', active: true },
        { id: 3, name: 'Ocean Legends', active: false },
    ];

    findAll(): Game[] {
        return this.games;
    }
    findOne(id: number): Game {
        const game = this.games.find((game) => game.id === id);

        if (!game) {
            throw new NotFoundException(`Jogo do ID ${id} não encontrado `);
        }
        return game;
    }
    create(createGameDto: CreateGameDto): Game {
        const nextId = Math.max(0, ...this.games.map((game) => game.id)) + 1;

        const newGame: Game = {
            id: nextId,
            name: createGameDto.name,
            active: createGameDto.active,
        };

        this.games.push(newGame);
        return newGame;
    }
    update(id: number, updateGameDto: UpdateGameDto): Game {
        const game = this.findOne(id);

        if (updateGameDto.name != null && updateGameDto.name != undefined) {
            game.name = updateGameDto.name;
        }

        if (updateGameDto.active != null && updateGameDto.active != undefined) {
            game.active = updateGameDto.active;
        }

        return game;
    }
}
