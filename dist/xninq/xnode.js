"use strict";
const xobject_1 = require("./xobject");
const ts_ninq_1 = require("ts-ninq");
const nodes_list_1 = require("./nodes-list");
const nodes_list_2 = require("./nodes-list");
const converter_1 = require("./converter");
const xobject_2 = require("./xobject");
const xattribute_1 = require("./xattribute");
const nodeTypes = [
    'cdata',
    'comment',
    'document',
    'documentType',
    'element',
];
class XNode extends xobject_1.default {
    constructor(other) {
        super(other);
    }
    addAfterSelf(...content) {
        if (!nodes_list_1.isNodesContainer(this.parent)) {
            throw new Error('No parent to add nodes into');
        }
        this.parent._nodes.insert(this, ts_ninq_1.default.map(content, value => nodes_list_2.default.fromValue(value)));
    }
    addBeforeSelf(...content) {
        if (!nodes_list_1.isNodesContainer(this.parent)) {
            throw new Error('No parent to add nodes into');
        }
        this.parent._nodes.insertBefore(this, ts_ninq_1.default.map(content, value => nodes_list_2.default.fromValue(value)));
    }
    ancestors() {
        const that = this;
        return new ts_ninq_1.default(ancGenerator());
        function* ancGenerator() {
            if (that.parent) {
                yield that.parent;
                yield* that.parent.ancestors();
            }
        }
    }
    elementsAfterSelf(name) {
        if (!nodes_list_1.isNodesContainer(this.parent)) {
            throw new Error('No parent to add nodes into');
        }
        return this.parent._nodes.after(this)
            .filter(node => node.nodeType === 'element')
            .cast();
    }
    elementsBeforeSelf(name) {
        if (!nodes_list_1.isNodesContainer(this.parent)) {
            throw new Error('No parent to add nodes into');
        }
        return this.parent._nodes.before(this)
            .filter(node => node.nodeType === 'element')
            .cast();
    }
    isAfter(node) {
        let result = false;
        if (nodes_list_1.isNodesContainer(this.parent) && (node instanceof XNode)) {
            result = this.parent._nodes
                .before(this)
                .includes(node);
        }
        return result;
    }
    isBefore(node) {
        let result = false;
        if (nodes_list_1.isNodesContainer(this.parent) && (node instanceof XNode)) {
            result = this.parent._nodes
                .after(this)
                .includes(node);
        }
        return result;
    }
    nodesAfterSelf() {
        return ts_ninq_1.default.of(!nodes_list_1.isNodesContainer(this.parent)
            ? ts_ninq_1.default.empty()
            : this.parent._nodes.after(this));
    }
    nodesBeforeSelf() {
        return ts_ninq_1.default.of(!nodes_list_1.isNodesContainer(this.parent)
            ? ts_ninq_1.default.empty()
            : this.parent._nodes.before(this));
    }
    remove() {
        if (nodes_list_1.isNodesContainer(this.parent)) {
            this.parent._nodes.remove(this);
            this._setParent();
        }
    }
    replaceWith(content, ...contents) {
        if (xobject_2.isValidParent(this.parent)) {
            this.parent._attriubtes.push(contents.filter(content => content instanceof xattribute_1.default));
            this.parent._nodes.insert(this, ts_ninq_1.default.of(contents)
                .map(converter_1.Converter.from)
                .filter(obj => obj instanceof XNode)
                .cast());
        }
    }
    static from(node) {
        if (!(node instanceof XNode) || !!node.parent) {
            node = node.clone();
        }
        return node;
    }
    static isNode(obj) {
        return obj && nodeTypes.includes(obj.nodeType);
    }
}
exports.XNode = XNode;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = XNode;
