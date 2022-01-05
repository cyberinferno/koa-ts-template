import {MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex} from 'typeorm';

export class ProfileTable1641286704730 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(new Table({
        name: 'profile',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'username',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'data',
            type: 'json',
            default: `'${JSON.stringify({
              salutation: 'Mr',
              firstName: '',
              middleName: '',
              lastName: '',
              dateOfBirth: '',
            })}'`,
          },
          {
            name: 'meta',
            type: 'json',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP'
          },
          {
            name: 'updated_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP'
          }
        ]
      }), true);
      await queryRunner.createIndex('profile', new TableIndex({
        name: 'idx_username_profile',
        columnNames: ['username'],
      }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropIndex('profile', 'idx_username_profile');
      await queryRunner.dropTable('profile');
    }
}
