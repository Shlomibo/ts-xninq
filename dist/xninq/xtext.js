"use strict";
const xnode_1 = require("./xnode");
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
    }
}
exports.XText = XText;
