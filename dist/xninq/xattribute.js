"use strict";
const xobject_1 = require("./xobject");
const xname_1 = require("./xname");
const converter_1 = require("./converter");
const xobject_2 = require("./xobject");
class XAttribute extends xobject_1.default {
    constructor(nameOrOther, value) {
        if ((typeof nameOrOther !== 'object') || (nameOrOther instanceof xname_1.XNameClass)) {
            super();
            this.name = xname_1.XNameClass.get(nameOrOther);
            this.value = value;
        }
        else {
            super(nameOrOther);
            this.name = xname_1.XNameClass.get(nameOrOther.name);
            this.value = nameOrOther.value;
        }
        this.nodeType = 'attribute';
        this.to = new converter_1.Converter(() => this.value);
    }
    get isNamespaceDeclaration() {
        return this.name.localName.startsWith('xmlns');
    }
    get nextAttribute() {
    }
    get previousAttribute() {
    }
    remove() {
    }
    setValue(value) {
        this.value = converter_1.Converter.fromValue(value);
    }
    toString() {
        return xobject_2.escape `${this.name}=${this.value}`;
    }
}
exports.XAttribute = XAttribute;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = XAttribute;
