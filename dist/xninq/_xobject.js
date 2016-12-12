"use strict";
var XObjectChange;
(function (XObjectChange) {
    XObjectChange[XObjectChange["add"] = 0] = "add";
    XObjectChange[XObjectChange["name"] = 1] = "name";
    XObjectChange[XObjectChange["remove"] = 2] = "remove";
    XObjectChange[XObjectChange["value"] = 3] = "value";
})(XObjectChange = exports.XObjectChange || (exports.XObjectChange = {}));
;
var XmlNodeType;
(function (XmlNodeType) {
    XmlNodeType[XmlNodeType["attribute"] = 0] = "attribute";
    XmlNodeType[XmlNodeType["cdata"] = 1] = "cdata";
    XmlNodeType[XmlNodeType["comment"] = 2] = "comment";
    XmlNodeType[XmlNodeType["document"] = 3] = "document";
    XmlNodeType[XmlNodeType["documentFragment"] = 4] = "documentFragment";
    XmlNodeType[XmlNodeType["documentType"] = 5] = "documentType";
    XmlNodeType[XmlNodeType["element"] = 6] = "element";
    XmlNodeType[XmlNodeType["endElement"] = 7] = "endElement";
    XmlNodeType[XmlNodeType["entity"] = 8] = "entity";
    XmlNodeType[XmlNodeType["entityReference"] = 9] = "entityReference";
    XmlNodeType[XmlNodeType["none"] = 10] = "none";
    XmlNodeType[XmlNodeType["notation"] = 11] = "notation";
    XmlNodeType[XmlNodeType["processingInstruction"] = 12] = "processingInstruction";
    XmlNodeType[XmlNodeType["significantWhitespace"] = 13] = "significantWhitespace";
    XmlNodeType[XmlNodeType["text"] = 14] = "text";
    XmlNodeType[XmlNodeType["whitespace"] = 15] = "whitespace";
    XmlNodeType[XmlNodeType["xmlDeclaration"] = 16] = "xmlDeclaration";
})(XmlNodeType = exports.XmlNodeType || (exports.XmlNodeType = {}));
