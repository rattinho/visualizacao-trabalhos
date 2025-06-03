"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unsupportedConverter = unsupportedConverter;
exports.nullConverter = nullConverter;
exports.booleanFromValue = booleanFromValue;
exports.numberFromValue = numberFromValue;
exports.jsonNumberFromValue = jsonNumberFromValue;
exports.bigintFromBigIntValue = bigintFromBigIntValue;
exports.stringFromValue = stringFromValue;
exports.bytesFromBlobValue = bytesFromBlobValue;
exports.bytesFromBitValue = bytesFromBitValue;
exports.dateFromDateValue = dateFromDateValue;
exports.bigintFromTimeValue = bigintFromTimeValue;
exports.dateFromTimestampValue = dateFromTimestampValue;
exports.dateFromTimestampSecondsValue = dateFromTimestampSecondsValue;
exports.dateFromTimestampMillisecondsValue = dateFromTimestampMillisecondsValue;
exports.dateFromTimestampNanosecondsValue = dateFromTimestampNanosecondsValue;
exports.objectFromTimeTZValue = objectFromTimeTZValue;
exports.dateFromTimestampTZValue = dateFromTimestampTZValue;
exports.objectFromIntervalValue = objectFromIntervalValue;
exports.jsonObjectFromIntervalValue = jsonObjectFromIntervalValue;
exports.doubleFromDecimalValue = doubleFromDecimalValue;
exports.arrayFromListValue = arrayFromListValue;
exports.objectFromStructValue = objectFromStructValue;
exports.objectArrayFromMapValue = objectArrayFromMapValue;
exports.arrayFromArrayValue = arrayFromArrayValue;
exports.objectFromUnionValue = objectFromUnionValue;
const DuckDBType_1 = require("./DuckDBType");
const values_1 = require("./values");
const MIN_DATE_DAYS = -100000000;
const MAX_DATE_DAYS = 100000000;
//                      -8640000000000
const MIN_DATE_MILLIS = -8640000000000000;
const MAX_DATE_MILLIS = 8640000000000000;
const MILLS_PER_DAY = 24 * 60 * 60 * 1000;
function unsupportedConverter(_, type) {
    throw new Error(`Unsupported type: ${type}`);
}
function nullConverter(_) {
    return null;
}
function booleanFromValue(value) {
    return Boolean(value);
}
function numberFromValue(value) {
    return Number(value);
}
function jsonNumberFromValue(value) {
    if (Number.isFinite(value)) {
        return Number(value);
    }
    return String(value);
}
function bigintFromBigIntValue(value, type) {
    if (typeof value === 'bigint') {
        return value;
    }
    throw new Error(`Expected bigint value for type ${type}`);
}
function stringFromValue(value) {
    return String(value);
}
function bytesFromBlobValue(value) {
    if (value instanceof values_1.DuckDBBlobValue) {
        return value.bytes;
    }
    throw new Error(`Expected DuckDBBlobValue`);
}
function bytesFromBitValue(value) {
    if (value instanceof values_1.DuckDBBitValue) {
        return value.data;
    }
    throw new Error(`Expected DuckDBBitValue`);
}
function dateFromDateValue(value) {
    if (value instanceof values_1.DuckDBDateValue) {
        if (MIN_DATE_DAYS <= value.days && value.days <= MAX_DATE_DAYS) {
            return new Date(value.days * MILLS_PER_DAY);
        }
        throw new Error(`DATE value out of range for JS Date: ${value.days} days`);
    }
    throw new Error(`Expected DuckDBDateValue`);
}
function bigintFromTimeValue(value) {
    if (value instanceof values_1.DuckDBTimeValue) {
        return value.micros;
    }
    throw new Error(`Expected DuckDBTimeValue`);
}
function dateFromTimestampValue(value) {
    if (value instanceof values_1.DuckDBTimestampValue) {
        const millis = value.micros / 1000n;
        if (MIN_DATE_MILLIS <= millis && millis <= MAX_DATE_MILLIS) {
            return new Date(Number(millis));
        }
        throw new Error(`TIMESTAMP value out of range for JS Date: ${value.micros} micros`);
    }
    throw new Error(`Expected DuckDBTimestampValue`);
}
function dateFromTimestampSecondsValue(value) {
    if (value instanceof values_1.DuckDBTimestampSecondsValue) {
        const millis = value.seconds * 1000n;
        if (MIN_DATE_MILLIS <= millis && millis <= MAX_DATE_MILLIS) {
            return new Date(Number(millis));
        }
        throw new Error(`TIMESTAMP_S value out of range for JS Date: ${value.seconds} seconds`);
    }
    throw new Error(`Expected DuckDBTimestampSecondsValue`);
}
function dateFromTimestampMillisecondsValue(value) {
    if (value instanceof values_1.DuckDBTimestampMillisecondsValue) {
        const millis = value.millis;
        if (MIN_DATE_MILLIS <= millis && millis <= MAX_DATE_MILLIS) {
            return new Date(Number(millis));
        }
        throw new Error(`TIMESTAMP_MS value out of range for JS Date: ${value.millis} millis`);
    }
    throw new Error(`Expected DuckDBTimestampMillisecondsValue`);
}
function dateFromTimestampNanosecondsValue(value) {
    if (value instanceof values_1.DuckDBTimestampNanosecondsValue) {
        const millis = value.nanos / 1000000n;
        if (MIN_DATE_MILLIS <= millis && millis <= MAX_DATE_MILLIS) {
            return new Date(Number(millis));
        }
        throw new Error(`TIMESTAMP_NS value out of range for JS Date: ${value.nanos} nanos`);
    }
    throw new Error(`Expected DuckDBTimestampNanosecondsValue`);
}
function objectFromTimeTZValue(value) {
    if (value instanceof values_1.DuckDBTimeTZValue) {
        return {
            micros: value.micros,
            offset: value.offset,
        };
    }
    throw new Error(`Expected DuckDBTimeTZValue`);
}
function dateFromTimestampTZValue(value) {
    if (value instanceof values_1.DuckDBTimestampTZValue) {
        const millis = value.micros / 1000n;
        if (MIN_DATE_MILLIS <= millis && millis <= MAX_DATE_MILLIS) {
            return new Date(Number(millis));
        }
        throw new Error(`TIMESTAMPTZ value out of range for JS Date: ${value.micros} micros`);
    }
    throw new Error(`Expected DuckDBTimestampTZValue`);
}
function objectFromIntervalValue(value) {
    if (value instanceof values_1.DuckDBIntervalValue) {
        return {
            months: value.months,
            days: value.days,
            micros: value.micros,
        };
    }
    throw new Error(`Expected DuckDBIntervalValue`);
}
function jsonObjectFromIntervalValue(value) {
    if (value instanceof values_1.DuckDBIntervalValue) {
        return {
            months: value.months,
            days: value.days,
            micros: String(value.micros),
        };
    }
    throw new Error(`Expected DuckDBIntervalValue`);
}
function doubleFromDecimalValue(value) {
    if (value instanceof values_1.DuckDBDecimalValue) {
        return value.toDouble();
    }
    throw new Error(`Expected DuckDBDecimalValue`);
}
function arrayFromListValue(value, type, converter) {
    if (value instanceof values_1.DuckDBListValue && type instanceof DuckDBType_1.DuckDBListType) {
        return value.items.map((v) => converter(v, type.valueType, converter));
    }
    throw new Error(`Expected DuckDBListValue and DuckDBListType`);
}
function objectFromStructValue(value, type, converter) {
    if (value instanceof values_1.DuckDBStructValue && type instanceof DuckDBType_1.DuckDBStructType) {
        const result = {};
        for (const key in value.entries) {
            result[key] = converter(value.entries[key], type.typeForEntry(key), converter);
        }
        return result;
    }
    throw new Error(`Expected DuckDBStructValue and DuckDBStructType`);
}
function objectArrayFromMapValue(value, type, converter) {
    if (value instanceof values_1.DuckDBMapValue && type instanceof DuckDBType_1.DuckDBMapType) {
        return value.entries.map((entry) => ({
            key: converter(entry.key, type.keyType, converter),
            value: converter(entry.value, type.valueType, converter),
        }));
    }
    throw new Error(`Expected DuckDBMapValue and DuckDBMapType`);
}
function arrayFromArrayValue(value, type, converter) {
    if (value instanceof values_1.DuckDBArrayValue && type instanceof DuckDBType_1.DuckDBArrayType) {
        return value.items.map((v) => converter(v, type.valueType, converter));
    }
    throw new Error(`Expected DuckDBArrayValue and DuckDBArrayType`);
}
function objectFromUnionValue(value, type, converter) {
    if (value instanceof values_1.DuckDBUnionValue && type instanceof DuckDBType_1.DuckDBUnionType) {
        return {
            tag: value.tag,
            value: converter(value.value, type.memberTypeForTag(value.tag), converter),
        };
    }
    throw new Error(`Expected DuckDBUnionValue and DuckDBUnionType`);
}
