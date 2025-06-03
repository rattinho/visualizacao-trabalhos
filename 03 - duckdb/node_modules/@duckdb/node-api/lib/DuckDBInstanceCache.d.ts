import { DuckDBInstance } from './DuckDBInstance';
export declare class DuckDBInstanceCache {
    private readonly cache;
    constructor();
    getOrCreateInstance(path?: string, options?: Record<string, string>): Promise<DuckDBInstance>;
    private static singletonInstance;
    static get singleton(): DuckDBInstanceCache;
}
