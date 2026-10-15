import { Test, TestingModule } from '@nestjs/testing';
import { GamesController } from './games.controller.js';
import { GamesService } from './games.service.js';
import { vi } from 'vitest';

describe('GamesController', () => {
  let controller: GamesController;

  const gamesServiceMock = {
    findAll: () => [
      { id: 1, name: 'Jungle Adventure', active: true },
    ],
    create: vi.fn(),
    update: vi.fn(),
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

  it('deve encaminhar os dados de cadastro ao service e retornar o jogo', () => {
    
    const dados = {
      name: 'Twisted Island',
      active: false,
    };

    const jogoCriado = {
      id: 4,
      ...dados,
    };

    gamesServiceMock.create.mockReturnValueOnce(jogoCriado);

    const resultado = controller.create(dados);

    expect(gamesServiceMock.create).toHaveBeenCalledWith(dados);
    expect(resultado).toEqual(jogoCriado);
  });
  
  it('deve encaminhar o ID e os dados de atualização ao service', () => {
    const id = 1;
    const dados = { active: false };

    const jogoAtualizado = {
      id,
      name: 'Jungle Adventure',
      active: false,
    };

    gamesServiceMock.update.mockReturnValueOnce(jogoAtualizado);

    const resultado = controller.update(id, dados);

    expect(gamesServiceMock.update).toHaveBeenCalledWith(id, dados);
    expect(resultado).toEqual(jogoAtualizado);
  });
});