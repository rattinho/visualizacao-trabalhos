"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringFromBlob = stringFromBlob;
exports.stringFromBlobStringConcat = stringFromBlobStringConcat;
exports.stringFromBlobArrayJoin = stringFromBlobArrayJoin;
/** Matches BLOB-to-VARCHAR conversion behavior of DuckDB. */
function stringFromBlob(bytes) {
    // String concatenation appears to be faster for this function at smaller sizes.
    // Threshold of (2^16) experimentally determined on a MacBook Pro (M2 Max).
    // See stringFromBlob.bench.ts.
    if (bytes.length <= 65536) {
        return stringFromBlobStringConcat(bytes);
    }
    return stringFromBlobArrayJoin(bytes);
}
function stringFromBlobStringConcat(bytes) {
    let byteString = '';
    for (const byte of bytes) {
        if (byte <= 0x1f ||
            byte === 0x22 /* double quote */ ||
            byte === 0x27 /* single quote */ ||
            byte >= 0x7f) {
            byteString += `\\x${byte.toString(16).toUpperCase().padStart(2, '0')}`;
        }
        else {
            byteString += String.fromCharCode(byte);
        }
    }
    return byteString;
}
function stringFromBlobArrayJoin(bytes) {
    const byteStrings = [];
    for (const byte of bytes) {
        if (byte <= 0x1f ||
            byte === 0x22 /* double quote */ ||
            byte === 0x27 /* single quote */ ||
            byte >= 0x7f) {
            byteStrings.push(`\\x${byte.toString(16).toUpperCase().padStart(2, '0')}`);
        }
        else {
            byteStrings.push(String.fromCharCode(byte));
        }
    }
    return byteStrings.join('');
}
