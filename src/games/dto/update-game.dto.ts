import { IsBoolean, IsNotEmpty, IsOptional, IsString, } from 'class-validator';

export class UpdateGameDto {
    @IsOptional()
    @IsString({ message: 'O nome do jogo deve ser uma string.'})
    @IsNotEmpty({ message: 'O nome do jogo não pode estar vazio.'})
    name?: string;

    @IsOptional()
    @IsBoolean({ message: 'O status do jogo deve ser um booleano.'})
    active?: boolean;
}