import { Test, TestingModule } from '@nestjs/testing';
import { GamesController } from './games.controller.js';
import { GamesService } from './games.service.js';

describe('GamesController', () => {
  let controller: GamesController;

  const gamesServiceMock = {
    findAll: () => [
      { id: 1, name: 'Jungle Adventure', active: true },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GamesController],
      providers: [
        {
          provide: GamesService,
          useValue: gamesServiceMock,
        },
      ],
    }).compile();

    controller = module.get<GamesController>(GamesController);
  });

  it('deve retornar os jogos fornecidos pelo service', () => {
    expect(controller.findAll()).toEqual([
      { id: 1, name: 'Jungle Adventure', active: true },
    ]);
  });
});