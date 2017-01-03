"use strict";
const xobject_1 = require("./xobject");
const xname_1 = require("./xname");
const converter_1 = require("./converter");
const xobject_2 = require("./xobject");
const attributes_lists_1 = require("./attributes-lists");
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
        let result;
        if (attributes_lists_1.isAttributesContainer(this.parent)) {
            result = this.parent._attriubtes.after(this)
                .firstOrDefault(undefined);
        }
        return result;
    }
    get previousAttribute() {
        let result;
        if (attributes_lists_1.isAttributesContainer(this.parent)) {
            result = this.parent._attriubtes.before(this)
                .firstOrDefault(undefined);
        }
        return result;
    }
    clone() {
        return new XAttribute(this);
    }
    remove() {
        if (attributes_lists_1.isAttributesContainer(this.parent)) {
            this.parent._attriubtes.remove(this);
            this._setParent();
        }
    }
    setValue(value) {
        this.value = converter_1.Converter.fromValue(value);
    }
    toString() {
        return xobject_2.escape `${this.name}=${this.value}`;
    }
    static from(attribute) {
        if (!(attribute instanceof XAttribute) || attribute.parent) {
            return new XAttribute(attribute);
        }
        return attribute;
    }
}
exports.XAttribute = XAttribute;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = XAttribute;
