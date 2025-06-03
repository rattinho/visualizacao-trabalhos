import { DuckDBTypeId } from './DuckDBTypeId';
import { DuckDBValueConverter } from './DuckDBValueConverter';
export declare function createDuckDBValueConverter<T>(convertersByTypeId: Record<DuckDBTypeId, DuckDBValueConverter<T> | undefined>): DuckDBValueConverter<T>;
