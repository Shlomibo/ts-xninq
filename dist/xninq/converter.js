"use strict";
const uuid = require("node-uuid");
class Converter {
    constructor(getter) {
        this._getter = getter;
    }
    boolean() {
        return Converter.boolean(this._getter());
    }
    date() {
        return Converter.date(this._getter());
    }
    number() {
        return Converter.number(this._getter());
    }
    uuid() {
        return Converter.uuid(this._getter());
    }
    string() {
        return Converter.string(this._getter());
    }
    static boolean(value) {
        const falseValues = [
            'undefined',
            'null',
            'no',
            'false',
            '0'
        ];
        return !!value &&
            falseValues.every(falseVal => falseVal !== value.toLowerCase());
    }
    static date(value) {
        return value
            ? new Date(value)
            : new Date(0);
    }
    static number(value) {
        return value
            ? Number(value)
            : 0;
    }
    static uuid(value) {
        return value
            ? uuid.parse(value)
            : Buffer.from([]);
    }
    static string(value) {
        return value || '';
    }
    static fromValue(value) {
        if (typeof value === 'string') {
            return value;
        }
        else if ((value === undefined) || (value === null)) {
            return '';
        }
        else if ((typeof value !== 'object') || (typeof value.toString === 'function')) {
            return value.toString();
        }
        else {
            return Object.prototype.toString.call(value);
        }
    }
    static from(value) {
    }
}
exports.Converter = Converter;
