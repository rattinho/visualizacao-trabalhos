import { DuckDBLogicalType } from './DuckDBLogicalType';
import { DuckDBResult } from './DuckDBResult';
import { DuckDBType } from './DuckDBType';
import { DuckDBTypeId } from './DuckDBTypeId';
import { DuckDBValueConverter } from './DuckDBValueConverter';
import { ResultReturnType, StatementType } from './enums';
import { JS } from './JS';
import { Json } from './Json';
import { DuckDBValue } from './values';
export declare class DuckDBResultReader {
    private readonly result;
    private readonly chunks;
    private readonly chunkSizeRuns;
    private currentRowCount_;
    private done_;
    constructor(result: DuckDBResult);
    get returnType(): ResultReturnType;
    get statementType(): StatementType;
    get columnCount(): number;
    columnName(columnIndex: number): string;
    columnNames(): string[];
    deduplicatedColumnNames(): string[];
    columnTypeId(columnIndex: number): DuckDBTypeId;
    columnLogicalType(columnIndex: number): DuckDBLogicalType;
    columnType(columnIndex: number): DuckDBType;
    columnTypeJson(columnIndex: number): Json;
    columnTypes(): DuckDBType[];
    columnTypesJson(): Json;
    columnNamesAndTypesJson(): Json;
    columnNameAndTypeObjectsJson(): Json;
    get rowsChanged(): number;
    /** Total number of rows read so far. Call `readAll` or `readUntil` to read rows. */
    get currentRowCount(): number;
    /** Whether reading is done, that is, there are no more rows to read. */
    get done(): boolean;
    /**
     * Returns the value for the given column and row. Both are zero-indexed.
     *
     * Will return an error if `rowIndex` is greater than `currentRowCount`.
     */
    value(columnIndex: number, rowIndex: number): DuckDBValue;
    /** Read all rows. */
    readAll(): Promise<void>;
    /**
     * Read rows until at least the given target row count has been met.
     *
     * Note that the resulting row count could be greater than the target, since rows are read in chunks, typically of 2048 rows each.
     */
    readUntil(targetRowCount: number): Promise<void>;
    private fetchChunks;
    private updateChunkSizeRuns;
    getColumns(): DuckDBValue[][];
    convertColumns<T>(converter: DuckDBValueConverter<T>): (T | null)[][];
    getColumnsJS(): JS[][];
    getColumnsJson(): Json[][];
    getColumnsObject(): Record<string, DuckDBValue[]>;
    convertColumnsObject<T>(converter: DuckDBValueConverter<T>): Record<string, (T | null)[]>;
    getColumnsObjectJS(): Record<string, JS[]>;
    getColumnsObjectJson(): Record<string, Json[]>;
    getRows(): DuckDBValue[][];
    convertRows<T>(converter: DuckDBValueConverter<T>): (T | null)[][];
    getRowsJS(): JS[][];
    getRowsJson(): Json[][];
    getRowObjects(): Record<string, DuckDBValue>[];
    convertRowObjects<T>(converter: DuckDBValueConverter<T>): Record<string, T | null>[];
    getRowObjectsJS(): Record<string, JS>[];
    getRowObjectsJson(): Record<string, Json>[];
}
