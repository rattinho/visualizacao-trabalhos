"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getColumnsObjectFromChunks = getColumnsObjectFromChunks;
function getColumnsObjectFromChunks(chunks, columnNames) {
    const columnsObject = {};
    for (const chunk of chunks) {
        chunk.appendToColumnsObject(columnNames, columnsObject);
    }
    return columnsObject;
}
