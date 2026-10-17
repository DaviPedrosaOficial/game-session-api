import { Test } from '@nestjs/testing';
import { vi } from 'vitest';
import { GamesController } from './games.controller.js';
import { GamesService } from './games.service.js';

describe('GamesController', () => {
  let controller: GamesController;

  const gamesServiceMock = {
    findAll: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  };

  beforeEach(async () => {
    vi.resetAllMocks();

    const module = await Test.createTestingModule({
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

  it('deve retornar os jogos fornecidos pelo service', async () => {
    const jogos = [
      { id: 1, name: 'Jungle Adventure', active: true },
    ];

    gamesServiceMock.findAll.mockResolvedValueOnce(jogos);

    const resultado = await controller.findAll();

    expect(gamesServiceMock.findAll).toHaveBeenCalledTimes(1);
    expect(resultado).toEqual(jogos);
  });

  it('deve encaminhar o ID de busca ao service', async () => {
    const jogo = {
      id: 1,
      name: 'Jungle Adventure',
      active: true,
    };

    gamesServiceMock.findOne.mockResolvedValueOnce(jogo);

    const resultado = await controller.findOne(1);

    expect(gamesServiceMock.findOne).toHaveBeenCalledWith(1);
    expect(resultado).toEqual(jogo);
  });

  it('deve encaminhar os dados de cadastro e retornar o jogo', async () => {
    const dados = {
      name: 'Twisted Island',
      active: false,
    };

    const jogoCriado = { id: 4, ...dados };

    gamesServiceMock.create.mockResolvedValueOnce(jogoCriado);

    const resultado = await controller.create(dados);

    expect(gamesServiceMock.create).toHaveBeenCalledWith(dados);
    expect(resultado).toEqual(jogoCriado);
  });

  it('deve encaminhar o ID e os dados de atualização', async () => {
    const dados = { active: false };

    const jogoAtualizado = {
      id: 1,
      name: 'Jungle Adventure',
      active: false,
    };

    gamesServiceMock.update.mockResolvedValueOnce(jogoAtualizado);

    const resultado = await controller.update(1, dados);

    expect(gamesServiceMock.update).toHaveBeenCalledWith(1, dados);
    expect(resultado).toEqual(jogoAtualizado);
  });

  it('deve encaminhar o ID de exclusão ao service', async () => {
    gamesServiceMock.remove.mockResolvedValueOnce(undefined);

    const resultado = await controller.remove(2);

    expect(gamesServiceMock.remove).toHaveBeenCalledWith(2);
    expect(resultado).toBeUndefined();
  });
});