"use strict";
const NONE_URI = '', XML_URI = 'http://www.w3.org/XML/1998/namespace', XMLNS_URI = 'http://www.w3.org/2000/xmlns/';
class XNamespaceClass {
    constructor(namespaceName) {
        this.namespaceName = namespaceName;
    }
    toString() {
        return this.namespaceName;
    }
    valueOf() {
        return this.namespaceName;
    }
    getName(name) {
        return XNameClass.get(this, name);
    }
    equals(other) {
        if (typeof other === 'string') {
            return this.namespaceName === other;
        }
        else {
            return (other instanceof XNamespaceClass) &&
                (this.namespaceName === other.namespaceName);
        }
    }
    static get(namespaceName) {
        if ((typeof namespaceName !== 'string') &&
            !(namespaceName instanceof XNamespaceClass)) {
            throw new TypeError('namespaceName');
        }
        if (namespaceName instanceof XNamespaceClass) {
            namespaceName = namespaceName.namespaceName;
        }
        return new XNamespaceClass(namespaceName);
    }
    static get none() {
        return new XNamespaceClass(NONE_URI);
    }
    static get xml() {
        return new XNamespaceClass(XML_URI);
    }
    static get xmlns() {
        return new XNamespaceClass(XMLNS_URI);
    }
}
exports.XNamespaceClass = XNamespaceClass;
class XNameClass {
    constructor($namespace, localName) {
        this.$namespace = $namespace;
        this.localName = localName;
    }
    get namespaceName() {
        return this.$namespace.namespaceName;
    }
    equals(other) {
        if (typeof other === 'string') {
            return other === this.toString();
        }
        else {
            return (other instanceof XNameClass) &&
                (this.localName === other.localName) &&
                (this.$namespace.equals(other.$namespace));
        }
    }
    valueOf() {
        return this.localName;
    }
    toString() {
        return `${this.$namespace}${this.localName}`;
    }
    static get(nameOrNamespace, name) {
        let $namespace;
        if (arguments.length === 1) {
            $namespace = XNamespaceClass.none;
            name = nameOrNamespace;
        }
        else {
            $namespace = nameOrNamespace;
            name = name;
        }
        validate($namespace, XNamespaceClass, 'namespaceName');
        validate(name, XNameClass, 'name');
        if (typeof $namespace === 'string') {
            $namespace = XNamespaceClass.get($namespace);
        }
        if (typeof name !== 'string') {
            $namespace = name.$namespace;
            name = name.localName;
        }
        return new XNameClass($namespace, name);
        function validate(arg, cls, name) {
            if ((typeof arg !== 'string') &&
                !(arg instanceof cls)) {
                throw new TypeError(name);
            }
        }
    }
}
exports.XNameClass = XNameClass;
function isXName(value) {
    return typeof value === 'string' ||
        value instanceof XNameClass;
}
exports.isXName = isXName;
