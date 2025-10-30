// === SERVICE DE BASE DE DONNÉES ===

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mysql from 'mysql2/promise';
import { LoggerService } from '../common/services/logger.service';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool: mysql.Pool;

  constructor(
    private configService: ConfigService,
    private logger: LoggerService,
  ) {}

  async onModuleInit() {
    this.pool = mysql.createPool({
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      user: this.configService.get<string>('DB_USER'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_NAME'),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    });

    // Tester la connexion
    try {
      const connection = await this.pool.getConnection();
      this.logger.log('✅ Connexion à la base de données établie');
      connection.release();
    } catch (error) {
      this.logger.error('❌ Erreur de connexion à la base de données', error.stack);
      throw error;
    }
  }

  async onModuleDestroy() {
    if (this.pool) {
      await this.pool.end();
      this.logger.log('Connexion à la base de données fermée');
    }
  }

  /**
   * Exécuter une requête SQL
   */
  async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
    try {
      const [rows] = await this.pool.execute(sql, params);
      return rows as T[];
    } catch (error) {
      this.logger.error(`Erreur SQL: ${sql}`, error.stack);
      throw error;
    }
  }

  /**
   * Obtenir une connexion pour les transactions
   */
  async getConnection(): Promise<mysql.PoolConnection> {
    return await this.pool.getConnection();
  }

  /**
   * Exécuter une transaction
   */
  async transaction<T>(
    callback: (connection: mysql.PoolConnection) => Promise<T>,
  ): Promise<T> {
    const connection = await this.getConnection();

    try {
      await connection.beginTransaction();
      const result = await callback(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      this.logger.error('Transaction échouée, rollback effectué', error.stack);
      throw error;
    } finally {
      connection.release();
    }
  }
}