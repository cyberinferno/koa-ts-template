import {MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex} from 'typeorm';

export class UserTable1641287301509 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(new Table({
        name: 'user',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'password_hash',
            type: 'varchar',
          },
          {
            name: 'auth_type',
            type: 'varchar',
            default: '\'local\'',
          },
          {
            name: 'auth_token',
            type: 'varchar',
            isNullable: true,
            isUnique: true,
          },
          {
            name: 'confirmation_token',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'password_reset_token',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'role',
            type: 'varchar',
            default: '\'user\'',
          },
          {
            name: 'profile_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'meta',
            type: 'json',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'smallint',
            default: 1,
          },
          {
            name: 'confirmed_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP'
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
      await queryRunner.createIndex('user', new TableIndex({
        name: 'idx_user_status',
        columnNames: ['status'],
      }));
      await queryRunner.createForeignKey('user', new TableForeignKey({
        columnNames: ['profile_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'profile',
      }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      const table = await queryRunner.getTable('user');
      const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('profile_id') !== -1);
      await queryRunner.dropForeignKey('user', foreignKey);
      await queryRunner.dropIndex('user', 'idx_user_status');
      await queryRunner.dropTable('user');
    }
}
