"use strict";
const xnode_1 = require("./xnode");
const xobject_1 = require("./xobject");
class XText extends xnode_1.XNode {
    constructor(value) {
        if (typeof value === 'string') {
            super();
            this.value = value;
        }
        else {
            super(value);
            this.value = value.value;
        }
        this.nodeType = 'text';
    }
    clone() {
        return new XText(this);
    }
    toString() {
        return xobject_1.escape `${this.value}`;
    }
}
exports.XText = XText;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = XText;
class XCData extends XText {
    constructor(valueOrOther) {
        super(valueOrOther);
        this.nodeType = 'cdata';
    }
    clone() {
        return new XCData(this);
    }
    toString() {
    }
}
exports.XCData = XCData;
