import { Injectable } from '@nestjs/common';

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
}
