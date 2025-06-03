"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRowsFromChunks = getRowsFromChunks;
function getRowsFromChunks(chunks) {
    const rows = [];
    for (const chunk of chunks) {
        chunk.appendToRows(rows);
    }
    return rows;
}
