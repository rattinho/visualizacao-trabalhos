"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRowObjectsFromChunks = getRowObjectsFromChunks;
function getRowObjectsFromChunks(chunks, columnNames) {
    const rowObjects = [];
    for (const chunk of chunks) {
        chunk.appendToRowObjects(columnNames, rowObjects);
    }
    return rowObjects;
}
