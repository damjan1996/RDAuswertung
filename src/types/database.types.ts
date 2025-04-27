/**
 * Database related type definitions for the RDAuswertung application
 */

/**
 * Database configuration
 */
export interface DatabaseConfig {
  url: string;
  schema: string;
  connectionPoolSize?: number;
  ssl?: boolean;
}

/**
 * Row to object mapping type
 */
export type RowToObjectMapper<T> = (row: Record<string, any>) => T;

/**
 * Generic query result type
 */
export interface QueryResult<T> {
  data: T[];
  count: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
}

/**
 * Filter options for database queries
 */
export interface QueryFilter {
  field: string;
  operator:
    | 'eq'
    | 'neq'
    | 'gt'
    | 'gte'
    | 'lt'
    | 'lte'
    | 'in'
    | 'contains'
    | 'startsWith'
    | 'endsWith';
  value: string | number | boolean | Array<string | number>;
}

/**
 * Sort options for database queries
 */
export interface QuerySort {
  field: string;
  direction: 'asc' | 'desc';
}

/**
 * Pagination options for database queries
 */
export interface QueryPagination {
  page: number;
  pageSize: number;
}

/**
 * Query options for database queries
 */
export interface QueryOptions {
  filters?: QueryFilter[];
  sort?: QuerySort[];
  pagination?: QueryPagination;
  include?: string[];
}

/**
 * Generic database service interface
 */
export interface DatabaseService<T> {
  findAll(options?: QueryOptions): Promise<QueryResult<T>>;
  findById(id: number | string): Promise<T | null>;
  create(data: Partial<T>): Promise<T>;
  update(id: number | string, data: Partial<T>): Promise<T>;
  delete(id: number | string): Promise<boolean>;
}

/**
 * Base entity interface for all database models
 */
export interface BaseEntity {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
}
