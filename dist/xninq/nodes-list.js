"use strict";
const xnode_1 = require("./xnode");
const ts_ninq_1 = require("ts-ninq");
exports.isIterable = ts_ninq_1.isIterable;
exports.isArrayLike = ts_ninq_1.isArrayLike;
const xtext_1 = require("./xtext");
const converter_1 = require("./converter");
const xobject_list_1 = require("./xobject-list");
class NodeList extends xobject_list_1.default {
    constructor(nodes) {
        super();
        this._elementsMap = new Map();
        if (nodes) {
            this.push(nodes);
        }
    }
    get _elements() {
        if (!this._elementsMap) {
            this._elementsMap = this.map((node, index) => ({ node, index }))
                .filter(({ node }) => node.nodeType === 'element')
                .toMap(({ index }) => index, ({ node }) => node);
        }
        return this._elementsMap;
    }
    insert(after, objects) {
        super.insert(after, objects);
        this._elementsMap = undefined;
    }
    remove(from, count) {
        const result = super.remove(from, count);
        this._elementsMap = undefined;
        return result;
    }
    static fromValue(value) {
        if (xnode_1.XNode.isNode(value)) {
            return xnode_1.XNode.from(value);
        }
        else {
            return new xtext_1.XText(converter_1.Converter.fromValue(value));
        }
    }
}
exports.NodeList = NodeList;
function isNodesContainer(obj) {
    return obj && obj._nodes instanceof NodeList;
}
exports.isNodesContainer = isNodesContainer;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NodeList;
