import { Test, TestingModule } from '@nestjs/testing';
import { GamesService } from './games.service.js';

describe('GamesService', () => {
  let service: GamesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GamesService],
    }).compile();

    service = module.get<GamesService>(GamesService);
  });

  it('deve listar todos os jogos, incluindo os inativos', () => {
    expect(service.findAll()).toEqual([
      { id: 1, name: 'Jungle Adventure', active: true },
      { id: 2, name: 'Crystal Quest', active: true },
      { id: 3, name: 'Ocean Legends', active: false },
    ]);
  });
});