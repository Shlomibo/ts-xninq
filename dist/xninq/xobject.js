"use strict";
const events_1 = require("events");
class XObject {
    constructor() {
        this._emitter = new events_1.EventEmitter();
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
