"use strict";
const xnode_1 = require("./xnode");
const ts_ninq_1 = require("ts-ninq");
const ts_ninq_2 = require("ts-ninq");
exports.isIterable = ts_ninq_2.isIterable;
exports.isArrayLike = ts_ninq_2.isArrayLike;
const xtext_1 = require("./xtext");
const converter_1 = require("./converter");
class NodeList extends ts_ninq_1.default {
    constructor(nodes) {
        const list = [];
        super(list);
        this._list = list;
        this._elementsMap = new Map();
        if (nodes) {
            this.push(nodes);
        }
    }
    get length() {
        return super.length;
    }
    get _elements() {
        if (!this._elementsMap) {
            this._elementsMap = this.map((node, index) => ({ node, index }))
                .filter(({ node }) => node.nodeType === 'element')
                .toMap(({ index }) => index, ({ node }) => node);
        }
        return this._elementsMap;
    }
    after(anchor) {
        anchor = typeof anchor === 'number'
            ? anchor
            : this._list.indexOf(anchor);
        return ts_ninq_1.default.of(new ts_ninq_2.ArrayLikeIterable(this._list, anchor));
    }
    before(anchor) {
        anchor = typeof anchor === 'number'
            ? anchor
            : this._list.indexOf(anchor);
        return ts_ninq_1.default.of(new ts_ninq_2.ReverseArrayLikeIterable(this._list, anchor));
    }
    insertBefore(node, nodes) {
        const nodeIndex = this._list.indexOf(node), count = ts_ninq_2.isIterable(nodes)
            ? ts_ninq_1.default.count(nodes)
            : 1;
        this.insert(nodeIndex - count, nodes);
    }
    insert(after, nodes) {
        const at = typeof after === 'number'
            ? after
            : this._list.indexOf(after);
        if ((at < 0) || (at > this.length)) {
            throw new RangeError('after is out of range, or unknown node');
        }
        if (!ts_ninq_2.isIterable(nodes)) {
            nodes = [nodes];
        }
        const xNodes = ts_ninq_1.default.map(nodes, xnode_1.XNode.from);
        this._list.splice(at, 0, ...xNodes);
        this._elementsMap = null;
    }
    remove(from, count) {
        if (typeof count !== 'number') {
            count = 1;
        }
        from = typeof from === 'number'
            ? from
            : this._list.indexOf(from);
        if ((from < 0) || (from >= this.length)) {
            throw new RangeError('after is out of range, or unknown node');
        }
        if (isNaN(count) || (count < 0) || (count + from > this.length)) {
            throw new Error('Invalid count');
        }
        let result = this._list.splice(from, count);
        this._elementsMap = null;
        return arguments.length === 0
            ? result[0]
            : result;
    }
    push(nodes) {
        this.insert(this.length, nodes);
    }
    pop(count) {
        count = typeof count === 'number'
            ? count
            : 1;
        return this.remove(this.length - count, count);
    }
    unshift(nodes) {
        this.insert(0, nodes);
    }
    shift(count) {
        return this.remove(0, count);
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
