# GameSession API

API REST para um domínio de jogos, desenvolvida com **NestJS, TypeScript, MikroORM e PostgreSQL**, com banco executado em Docker e testes unitários com Vitest.

O projeto está em desenvolvimento. A etapa atual implementa o gerenciamento de jogos com persistência no PostgreSQL. Jogadores, sessões, pontuações e ranking fazem parte da evolução planejada.

## Por que este projeto existe?

A GameSession API foi criada para aprofundar meus conhecimentos em desenvolvimento backend e colocar em prática conceitos importantes para minha preparação profissional.

Após experiências com Node.js e Express em projetos pessoais, o objetivo é avançar no uso de TypeScript e NestJS, entendendo como organizar uma aplicação com módulos, injeção de dependências, validação, acesso a banco de dados e testes automatizados.

O domínio de jogos oferece um cenário para evoluir de operações básicas de cadastro até regras envolvendo jogadores e sessões. O desenvolvimento acontece de forma incremental: implementar uma funcionalidade, compreender suas decisões, verificar seu comportamento e registrar a evolução no Git.

Além de compor meu portfólio, o projeto serve como laboratório de aprendizado. A intenção é conseguir explicar o funcionamento do código, justificar as escolhas técnicas e desenvolver uma base para funcionalidades mais complexas.

## Funcionalidades implementadas

- Cadastro, listagem, busca por ID, atualização parcial e exclusão de jogos.
- Validação de entrada com DTOs e `ValidationPipe` global.
- Rejeição de propriedades não previstas nos DTOs.
- Tratamento de IDs inválidos e registros não encontrados.
- Persistência com PostgreSQL e MikroORM.
- Migration inicial para criação da tabela `games`.
- PostgreSQL executado com Docker Compose e volume persistente.
- Configuração por variáveis de ambiente.
- Testes unitários de controllers e service, com dependências simuladas.

## Tecnologias

| Tecnologia | Papel no projeto |
| --- | --- |
| TypeScript | Tipagem estática do código |
| NestJS 12 | Organização da API em módulos, controllers e providers |
| MikroORM 7 | Mapeamento de entidades e persistência |
| PostgreSQL 17 | Banco de dados relacional |
| Docker Compose | Execução do banco e gerenciamento do volume |
| class-validator / class-transformer | Validação e transformação dos dados de entrada |
| dotenv | Carregamento das variáveis de ambiente |
| Vitest | Execução dos testes automatizados |

O projeto usa **ES Modules (ESM)**. Os imports locais utilizam a extensão `.js`, correspondente aos arquivos gerados pela compilação, mesmo quando o código-fonte está em `.ts`.

## Organização

```text
src/
├── games/
│   ├── dto/
│   │   ├── create-game.dto.ts
│   │   └── update-game.dto.ts
│   ├── entities/
│   │   └── game.entity.ts
│   ├── games.controller.ts
│   ├── games.controller.spec.ts
│   ├── games.module.ts
│   ├── games.service.ts
│   └── games.service.spec.ts
├── migrations/
├── app.module.ts
├── main.ts
└── mikro-orm.config.ts
```

O **controller** recebe as requisições HTTP e encaminha os dados ao **service**. O service coordena as operações usando o repositório e o EntityManager do MikroORM. A entidade `Game` define o mapeamento para a tabela, enquanto os DTOs descrevem e validam os dados recebidos pela API.

## Como executar

### Pré-requisitos

- Node.js 24 e npm — ambiente utilizado no desenvolvimento.
- Git.
- Docker com Docker Compose disponível e mecanismo em execução. No Windows, pode ser utilizado o Docker Desktop com containers Linux.

O PostgreSQL será executado no container; não é necessário instalá-lo diretamente no computador.

### 1. Clonar e instalar

```bash
git clone https://github.com/DaviPedrosaOficial/game-session-api.git
cd game-session-api
npm ci
```

### 2. Configurar o ambiente

Copie `.env.example` para `.env`. No PowerShell:

```powershell
Copy-Item .env.example .env
```

No Linux ou macOS:

```bash
cp .env.example .env
```

Edite os valores conforme seu ambiente:

| Variável | Finalidade |
| --- | --- |
| `PORT` | Porta HTTP da API; padrão no código: `3000` |
| `DB_HOST` | Endereço do banco acessado pela API; localmente: `127.0.0.1` |
| `DB_PORT` | Porta publicada para o banco no computador; exemplo: `5432` |
| `POSTGRES_USER` | Usuário do banco |
| `POSTGRES_PASSWORD` | Senha do banco; substitua o valor de exemplo |
| `POSTGRES_DB` | Nome do banco |

O `.env` é ignorado pelo Git; o `.env.example` documenta as variáveis necessárias. API, CLI do MikroORM e Compose usam esses valores. As variáveis obrigatórias de conexão e a porta do banco são verificadas pela configuração do ORM.

Em um banco novo, as variáveis `POSTGRES_*` definem as credenciais e o banco inicial. Em um volume já inicializado, alterar essas variáveis não altera automaticamente usuários, senhas ou bancos existentes. Nesse caso, mantenha os valores usados na criação ou faça a alteração diretamente no PostgreSQL.

### 3. Iniciar o PostgreSQL

```bash
docker compose up -d
docker compose ps
```

O banco fica disponível apenas no computador local, pela porta configurada. A API continua sendo executada pelo Node fora do container.

### 4. Aplicar as migrations

```bash
npx mikro-orm migration:up --config ./src/mikro-orm.config.ts
```

Esse comando cria as estruturas pendentes e registra as migrations executadas. Não é necessário gerar uma nova migration para executar o projeto pela primeira vez: utilize a que já está versionada.

### 5. Iniciar a API

```bash
npm run start:dev
```

Com a porta padrão, a API estará disponível em `http://localhost:3000`.

A tabela começa vazia em uma instalação nova. Os jogos são cadastrados pela API; os três exemplos usados na fase inicial em memória não são inseridos automaticamente no banco.

## Endpoints de jogos

| Método | Rota | Operação | Sucesso |
| --- | --- | --- | --- |
| GET | `/games` | Listar jogos por ID crescente | `200` |
| GET | `/games/:id` | Buscar um jogo | `200` |
| POST | `/games` | Cadastrar um jogo | `201` |
| PATCH | `/games/:id` | Atualizar campos de um jogo | `200` |
| DELETE | `/games/:id` | Excluir um jogo | `204`, sem corpo |

### Cadastrar

Envie `POST /games` com `Content-Type: application/json`:

```json
{
  "name": "Jungle Adventure",
  "active": true
}
```

Exemplo de resposta:

```json
{
  "id": 1,
  "name": "Jungle Adventure",
  "active": true
}
```

O ID é gerado pelo PostgreSQL e pode variar. O cliente não deve enviá-lo no cadastro. `name` e `active` são obrigatórios; `active` deve ser um booleano, sem aspas.

### Atualizar parcialmente

Envie `PATCH /games/1`:

```json
{
  "active": false
}
```

O nome é preservado. Também é possível enviar apenas `name` ou os dois campos. No comportamento atual, campos ausentes ou enviados como `null` são ignorados. Um corpo vazio mantém o registro sem alterações.

### Erros esperados

- **400 Bad Request:** ID não inteiro, dados inválidos ou propriedades extras.
- **404 Not Found:** jogo não encontrado em busca, atualização ou exclusão.

Atualmente, a validação de nome vazio não rejeita textos compostos apenas por espaços. O limite de 255 caracteres da coluna ainda não possui validação equivalente nos DTOs; esses ajustes fazem parte das melhorias de validação.

## Testes e compilação

```bash
npm test
npm run build
```

Para acompanhar os testes durante alterações:

```bash
npm run test:watch
```

A última verificação desta etapa teve **15 testes unitários aprovados**: 9 do service de jogos, 5 do controller de jogos e 1 do controller principal.

Os testes de jogos simulam o repositório, o EntityManager e o service conforme a camada testada. Não exigem PostgreSQL em execução. Verificam consultas, encaminhamento de parâmetros, persistência solicitada pelo service, atualização parcial, exclusão e tratamento de registros inexistentes.

Esses testes não substituem testes de integração HTTP ou de banco. O fluxo real de cadastro, consulta, atualização e exclusão foi verificado manualmente com Insomnia e consultas SQL, incluindo a permanência de um cadastro após reiniciar a API.

## Comandos de banco e migrations

Execute os comandos a partir da raiz do projeto:

```bash
# Verificar configuração e conexão
npx mikro-orm debug --config ./src/mikro-orm.config.ts

# Gerar uma migration após alterar entidades
npx mikro-orm migration:create --config ./src/mikro-orm.config.ts

# Aplicar migrations pendentes
npx mikro-orm migration:up --config ./src/mikro-orm.config.ts

# Parar o banco
docker compose stop

# Iniciar novamente
docker compose up -d
```

Revise o SQL gerado antes de aplicar uma nova migration. Os arquivos de migration e o snapshot de schema devem acompanhar a evolução do código no Git.

Os dados ficam no volume `postgres_data`. Parar ou recriar o container preserva esse volume. O comando `docker compose down -v` remove os volumes do projeto e apaga os dados armazenados neles.

## Próximas etapas

- [ ] Documentação interativa dos endpoints com Swagger/OpenAPI.
- [ ] Melhorias na validação de nomes e limites de tamanho.
- [ ] Testes de integração HTTP e persistência automatizados.
- [ ] Cadastro e gerenciamento de jogadores.
- [ ] Sessões de jogo relacionadas a jogos e jogadores.
- [ ] Registro de pontuações e consultas de ranking.
- [ ] Exploração de eventos assíncronos e comunicação em tempo real.
- [ ] Evolução da organização do domínio conforme a complexidade das regras.

## Autor

Desenvolvido por **Davi da Silva Pedrosa**, estudante de Ciência da Computação, como projeto de aprendizado e portfólio backend.

[Perfil no GitHub](https://github.com/DaviPedrosaOficial)

