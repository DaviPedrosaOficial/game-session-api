import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { vi } from 'vitest';
import { GamesService } from './games.service.js';
import { Game } from './entities/game.entity.js';

describe('GamesService', () => {
  let service: GamesService;

  const entityManagerMock = {
    persist: vi.fn(),
    flush: vi.fn(),
    remove: vi.fn(),
  };

  const repositoryMock = {
    findAll: vi.fn(),
    findOne: vi.fn(),
    getEntityManager: vi.fn(),
  };

  beforeEach(async () => {
    vi.resetAllMocks();

    repositoryMock.getEntityManager.mockReturnValue(entityManagerMock);
    entityManagerMock.flush.mockResolvedValue(undefined);

    const module = await Test.createTestingModule({
      providers: [
        GamesService,
        {
          provide: getRepositoryToken(Game),
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<GamesService>(GamesService);
  });

  it('deve listar jogos ativos e inativos ordenados por ID', async () => {
    const jogos = [
      { id: 1, name: 'Jungle Adventure', active: true },
      { id: 3, name: 'Ocean Legends', active: false },
    ];

    repositoryMock.findAll.mockResolvedValueOnce(jogos);

    const resultado = await service.findAll();

    expect(resultado).toEqual(jogos);
    expect(repositoryMock.findAll).toHaveBeenCalledWith({
      orderBy: { id: 'asc' },
    });
  });

  it('deve buscar um jogo pelo ID', async () => {
    const jogo = {
      id: 1,
      name: 'Jungle Adventure',
      active: true,
    };

    repositoryMock.findOne.mockResolvedValueOnce(jogo);

    expect(await service.findOne(1)).toEqual(jogo);
    expect(repositoryMock.findOne).toHaveBeenCalledWith({ id: 1 });
  });

  it('deve lançar NotFoundException quando o jogo não existir', async () => {
    repositoryMock.findOne.mockResolvedValueOnce(null);

    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('deve persistir um novo jogo inativo e aguardar a gravação', async () => {
    const dados = {
      name: 'Twisted Island',
      active: false,
    };

    const resultado = await service.create(dados);

    expect(resultado).toBeInstanceOf(Game);
    expect(resultado).toMatchObject(dados);
    expect(entityManagerMock.persist).toHaveBeenCalledWith(resultado);
    expect(entityManagerMock.flush).toHaveBeenCalledTimes(1);
  });

  it('deve atualizar o status para false e preservar o nome', async () => {
    const jogo = {
      id: 1,
      name: 'Jungle Adventure',
      active: true,
    };

    repositoryMock.findOne.mockResolvedValueOnce(jogo);

    const resultado = await service.update(1, { active: false });

    expect(resultado).toEqual({
      id: 1,
      name: 'Jungle Adventure',
      active: false,
    });
    expect(entityManagerMock.flush).toHaveBeenCalledTimes(1);
  });

  it('deve atualizar o nome e preservar o status', async () => {
    const jogo = {
      id: 3,
      name: 'Ocean Legends',
      active: false,
    };

    repositoryMock.findOne.mockResolvedValueOnce(jogo);

    const resultado = await service.update(3, {
      name: 'Ocean Legends Updated',
    });

    expect(resultado).toEqual({
      id: 3,
      name: 'Ocean Legends Updated',
      active: false,
    });
    expect(entityManagerMock.flush).toHaveBeenCalledTimes(1);
  });

  it('não deve gravar ao tentar atualizar um jogo inexistente', async () => {
    repositoryMock.findOne.mockResolvedValueOnce(null);

    await expect(
      service.update(999, { active: false }),
    ).rejects.toThrow(NotFoundException);

    expect(entityManagerMock.flush).not.toHaveBeenCalled();
  });

  it('deve marcar o jogo encontrado para exclusão e gravar', async () => {
    const jogo = {
      id: 2,
      name: 'Crystal Quest',
      active: true,
    };

    repositoryMock.findOne.mockResolvedValueOnce(jogo);

    await service.remove(2);

    expect(repositoryMock.findOne).toHaveBeenCalledWith({ id: 2 });
    expect(entityManagerMock.remove).toHaveBeenCalledWith(jogo);
    expect(entityManagerMock.flush).toHaveBeenCalledTimes(1);
  });

  it('não deve excluir ao receber um ID inexistente', async () => {
    repositoryMock.findOne.mockResolvedValueOnce(null);

    await expect(service.remove(999)).rejects.toThrow(NotFoundException);

    expect(entityManagerMock.remove).not.toHaveBeenCalled();
    expect(entityManagerMock.flush).not.toHaveBeenCalled();
  });
});