"use strict";
const xcontainer_1 = require("./xcontainer");
const xname_1 = require("./xname");
class XElement extends xcontainer_1.XContainer {
    constructor(nameOrOther, ...content) {
        if (xname_1.isXName(nameOrOther)) {
            super();
        }
        else {
            super(nameOrOther);
        }
    }
}
exports.XElement = XElement;
