import { Test, TestingModule } from '@nestjs/testing';
import { GamesService } from './games.service.js';
import { NotFoundException } from '@nestjs/common';

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

  it('deve retornar NotFoundException quando o jogo não for encontrado', () => {
    expect(() => service.findOne(999)).toThrow(NotFoundException);
  });

  it('deve criar um jogo inativo e permitir buscá-lo pelo ID', () => {
    const dados = {
      name: 'Twisted Island',
      active: false,
    };

    const jogoCriado = service.create(dados);

    expect(jogoCriado).toEqual({
      id: 4,
      name: 'Twisted Island',
      active: false,
    });

    expect(service.findOne(jogoCriado.id)).toEqual(jogoCriado);
  });

  it('deve atualizar o status para false e preservar o nome', () => {
    const resultado = service.update(1, { active: false });

    expect(resultado).toEqual({
      id: 1,
      name: 'Jungle Adventure',
      active: false,
    });

    expect(service.findOne(1)).toEqual(resultado);
});

  it('deve atualizar o nome e preservar o status', () => {
    const resultado = service.update(3, {
      name: 'Ocean Legends Updated',
    });

    expect(resultado).toEqual({
      id: 3,
      name: 'Ocean Legends Updated',
      active: false,
    });
  });

  it('deve lançar NotFoundException ao atualizar um jogo inexistente', () => {
    expect(() => service.update(999, { active: false }))
      .toThrow(NotFoundException);
  });
});