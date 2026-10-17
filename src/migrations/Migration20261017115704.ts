import { Migration } from '@mikro-orm/migrations';

export class Migration20261017115704 extends Migration {

  override name = 'Migration20261017115704';

  override up(): void | Promise<void> {
    this.addSql(`create table "games" ("id" serial primary key, "name" varchar(255) not null, "active" boolean not null default true);`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "games" cascade;`);
  }

}
