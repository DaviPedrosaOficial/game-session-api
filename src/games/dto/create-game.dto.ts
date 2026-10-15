import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateGameDto {
    @IsString({ message: 'O nome do jogo deve ser uma string' })
    @IsNotEmpty({ message: 'O nome do jogo não pode estar vazio'})
    name!: string;

    @IsBoolean({ message: 'O status do jogo deve ser um booleano' })
    active!: boolean;
}