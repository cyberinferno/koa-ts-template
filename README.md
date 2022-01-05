# KoaJS Typescript Boilerplate

This is a boilerplate for KoaJS Typescript projects. It contains REST APIs built with KoaJS and Typescript.
Tests are written with Jest and Supertest. TypeORM is used for database connection and migrations.

## Requirements

  * NodeJS v16.x.x
  * Typescript
  * MySQL/MariaDB (Default database configured)

## Running the application

  * Create file `.env` file in the root directory of the project. For configuration options check `.example.env` file.
  * Create file `ormconfig.env` file in the root directory of the project. For configuration options check `ormconfig.example.env` file.
  * Run `npm run migrate-up` to create tables in the database.
  * Run the application with `npm run dev-server` for development.
  * Run test using `npm run test`.
  * Build the application using `npm run build` for production.
