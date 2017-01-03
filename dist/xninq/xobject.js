"use strict";
const events_1 = require("events");
const converter_1 = require("./converter");
const ts_ninq_1 = require("ts-ninq");
class XObject {
    constructor(other) {
        this._emitter = new events_1.EventEmitter();
        if (other) {
            this._setBaseUri(other.baseUri)
                ._setDocument(other.document)
                ._setParent(other.parent);
        }
    }
    get baseUri() {
        return this._baseUri;
    }
    get document() {
        return this._document;
    }
    get parent() {
        return this._parent;
    }
    _setBaseUri(value) {
        this._baseUri = value;
        return this;
    }
    _setDocument(doc) {
        this._document = doc;
        return this;
    }
    _setParent(parent) {
        this._parent = parent;
        return this;
    }
    on(event, handler) {
        this._emitter.on(event, handler);
        return this;
    }
    once(event, handler) {
        this._emitter.once(event, handler);
        return this;
    }
    removeListener(event, handler) {
        this._emitter.removeListener(event, handler);
    }
    hasLineInfo() {
        return typeof this.lineNumber === 'number';
    }
    _onChanging(change) {
        this._emitter.emit('changing', {
            sender: this,
            change,
        });
    }
    _onChanged(change) {
        this._emitter.emit('changed', {
            sender: this,
            change,
        });
    }
}
exports.XObject = XObject;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = XObject;
function escape(strings, ...values) {
    const valueStrings = new ts_ninq_1.default(values)
        .map(converter_1.Converter.fromValue)
        .map(xmlEscape)
        .toArray();
    const joint = [];
    for (let i = 0; i < valueStrings.length; i++) {
        joint.push(strings[i]);
        joint.push(valueStrings[i]);
    }
    joint.push(ts_ninq_1.default.last(strings));
    return joint.join('');
    function xmlEscape(val) {
        return val;
    }
}
exports.escape = escape;
