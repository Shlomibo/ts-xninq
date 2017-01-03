"use strict";
const xobject_1 = require("./xobject");
const ts_ninq_1 = require("ts-ninq");
const nodes_list_1 = require("./nodes-list");
const nodes_list_2 = require("./nodes-list");
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
