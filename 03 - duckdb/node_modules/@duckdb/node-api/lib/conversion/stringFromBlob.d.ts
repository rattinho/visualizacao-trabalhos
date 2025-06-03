/** Matches BLOB-to-VARCHAR conversion behavior of DuckDB. */
export declare function stringFromBlob(bytes: Uint8Array): string;
export declare function stringFromBlobStringConcat(bytes: Uint8Array): string;
export declare function stringFromBlobArrayJoin(bytes: Uint8Array): string;
