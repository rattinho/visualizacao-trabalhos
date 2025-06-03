import { DuckDBType } from './DuckDBType';
import { DuckDBValueConverter } from './DuckDBValueConverter';
import { DuckDBValue } from './values';
export declare function unsupportedConverter(_: DuckDBValue, type: DuckDBType): null;
export declare function nullConverter(_: DuckDBValue): null;
export declare function booleanFromValue(value: DuckDBValue): boolean;
export declare function numberFromValue(value: DuckDBValue): number;
export declare function jsonNumberFromValue(value: DuckDBValue): number | string;
export declare function bigintFromBigIntValue(value: DuckDBValue, type: DuckDBType): bigint;
export declare function stringFromValue(value: DuckDBValue): string;
export declare function bytesFromBlobValue(value: DuckDBValue): Uint8Array;
export declare function bytesFromBitValue(value: DuckDBValue): Uint8Array;
export declare function dateFromDateValue(value: DuckDBValue): Date;
export declare function bigintFromTimeValue(value: DuckDBValue): bigint;
export declare function dateFromTimestampValue(value: DuckDBValue): Date;
export declare function dateFromTimestampSecondsValue(value: DuckDBValue): Date;
export declare function dateFromTimestampMillisecondsValue(value: DuckDBValue): Date;
export declare function dateFromTimestampNanosecondsValue(value: DuckDBValue): Date;
export declare function objectFromTimeTZValue(value: DuckDBValue): {
    micros: bigint;
    offset: number;
};
export declare function dateFromTimestampTZValue(value: DuckDBValue): Date;
export declare function objectFromIntervalValue(value: DuckDBValue): {
    months: number;
    days: number;
    micros: bigint;
};
export declare function jsonObjectFromIntervalValue(value: DuckDBValue): {
    months: number;
    days: number;
    micros: string;
};
export declare function doubleFromDecimalValue(value: DuckDBValue): number;
export declare function arrayFromListValue<T>(value: DuckDBValue, type: DuckDBType, converter: DuckDBValueConverter<T>): (T | null)[];
export declare function objectFromStructValue<T>(value: DuckDBValue, type: DuckDBType, converter: DuckDBValueConverter<T>): {
    [key: string]: T | null;
};
export declare function objectArrayFromMapValue<T>(value: DuckDBValue, type: DuckDBType, converter: DuckDBValueConverter<T>): {
    key: T | null;
    value: T | null;
}[];
export declare function arrayFromArrayValue<T>(value: DuckDBValue, type: DuckDBType, converter: DuckDBValueConverter<T>): (T | null)[];
export declare function objectFromUnionValue<T>(value: DuckDBValue, type: DuckDBType, converter: DuckDBValueConverter<T>): {
    tag: string;
    value: T | null;
};
