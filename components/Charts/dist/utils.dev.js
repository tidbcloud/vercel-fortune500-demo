"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isTimeField = isTimeField;
exports.isYearLike = isYearLike;
exports.transformTimeData = transformTimeData;
exports.isNumberFiled = isNumberFiled;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function isTimeField(name) {
  return /date|time|year|month/.test(name);
}

function isYearLike(value) {
  if (typeof value === "number") {
    return value >= 1970 && value < 2100;
  } else {
    return isYearLike(Number(value));
  }
}

function transformTimeData(data, field) {
  return data.map(function (item) {
    var value = item[field];

    if (isYearLike(value)) {
      value = new Date(String(value));
    }

    return _objectSpread({}, item, _defineProperty({}, field, value));
  });
}

function isNumberFiled(column) {
  return ["DECIMAL", "INT", "DOUBLE", "BIGINT"].includes(column.data_type);
}