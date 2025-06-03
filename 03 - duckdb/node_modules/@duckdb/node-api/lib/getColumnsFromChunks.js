"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getColumnsFromChunks = getColumnsFromChunks;
function getColumnsFromChunks(chunks) {
    const columns = [];
    for (const chunk of chunks) {
        chunk.appendToColumns(columns);
    }
    return columns;
}
