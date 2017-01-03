"use strict";
const events_1 = require("events");
const nodes_list_1 = require("./nodes-list");
const attributes_lists_1 = require("./attributes-lists");
const escape_1 = require("./escape");
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
    set parent(parent) {
        if (this._parent && parent) {
            throw new Error('Cannot set parent for attached element');
        }
        this._parent = parent;
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
        if (this._parent && parent) {
            throw new Error('Cannot set parent on attached element');
        }
        if (parent && !isValidParent(parent)) {
            throw new TypeError('parent');
        }
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
function isValidParent(parent) {
    return nodes_list_1.isNodesContainer(parent) &&
        attributes_lists_1.isAttributesContainer(parent);
}
exports.isValidParent = isValidParent;
exports.escape = escape_1.createEscape((val) => {
    return val;
});
