import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { GamesController } from './games.controller.js';
import { GamesService } from './games.service.js';
import { Game } from './entities/game.entity.js';

@Module({
  imports: [MikroOrmModule.forFeature([Game])],
  controllers: [GamesController],
  providers: [GamesService]
})
export class GamesModule {}
