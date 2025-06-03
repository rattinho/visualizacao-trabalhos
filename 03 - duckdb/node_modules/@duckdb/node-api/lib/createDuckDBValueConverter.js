"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDuckDBValueConverter = createDuckDBValueConverter;
function createDuckDBValueConverter(convertersByTypeId) {
    return (value, type, converter) => {
        if (value == null) {
            return null;
        }
        const converterForTypeId = convertersByTypeId[type.typeId];
        if (!converterForTypeId) {
            throw new Error(`No converter for typeId: ${type.typeId}`);
        }
        return converterForTypeId(value, type, converter);
    };
}
