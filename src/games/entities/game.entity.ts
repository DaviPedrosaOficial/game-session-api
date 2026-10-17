import { Entity, PrimaryKey, Property, } from '@mikro-orm/decorators/legacy';

@Entity({ tableName: 'games' })
export class Game {
    @PrimaryKey({ type: 'integer'})
    id!: number;

    @Property({ type: 'string' })
    name!: string;

    @Property({ type: 'boolean' })
    active: boolean = true;
}