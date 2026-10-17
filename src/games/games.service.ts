import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Game } from './entities/game.entity.js';
import type { CreateGameDto } from './dto/create-game.dto.js';
import type { UpdateGameDto } from './dto/update-game.dto.js';

@Injectable()
export class GamesService {
    constructor(
        @InjectRepository(Game)
        private readonly gamesRepository: EntityRepository<Game> 
    ) {}

    async findAll(): Promise<Game[]> {
        return this.gamesRepository.findAll({
            orderBy: { id: 'asc'},
        });
    }

    async findOne(id: number): Promise<Game> {
        const game = await this.gamesRepository.findOne({ id });

        if (!game) {
            throw new NotFoundException(`Jogo do ID ${id} não encontrado `);
        }
        return game;
    }
    async create(createGameDto: CreateGameDto): Promise<Game> {
        const game = new Game();
        game.name = createGameDto.name;
        game.active = createGameDto.active;

        const em = this.gamesRepository.getEntityManager();

        em.persist(game);
        await em.flush();

        return game;
    }
    async update(id: number, updateGameDto: UpdateGameDto): Promise<Game> {
        const game = await this.findOne(id);

        if (updateGameDto.name != null && updateGameDto.name != undefined) {
            game.name = updateGameDto.name;
        }

        if (updateGameDto.active != null && updateGameDto.active != undefined) {
            game.active = updateGameDto.active;
        }

        await this.gamesRepository.getEntityManager().flush();

        return game;
    }
    async remove(id: number): Promise<void> {
        const game = await this.findOne(id);

        const em = this.gamesRepository.getEntityManager();

        em.remove(game);
        await em.flush();
    }
}
