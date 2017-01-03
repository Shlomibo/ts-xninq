"use strict";
var SaveOptions;
(function (SaveOptions) {
    SaveOptions[SaveOptions["none"] = 0] = "none";
    SaveOptions[SaveOptions["disableFormatting"] = 1] = "disableFormatting";
    SaveOptions[SaveOptions["omitDuplicateNamespaces"] = 2] = "omitDuplicateNamespaces";
})(SaveOptions = exports.SaveOptions || (exports.SaveOptions = {}));
var XObjectChange;
(function (XObjectChange) {
    XObjectChange[XObjectChange["add"] = 0] = "add";
    XObjectChange[XObjectChange["name"] = 1] = "name";
    XObjectChange[XObjectChange["remove"] = 2] = "remove";
    XObjectChange[XObjectChange["value"] = 3] = "value";
})(XObjectChange = exports.XObjectChange || (exports.XObjectChange = {}));
;
var NodeTypeEnum;
(function (NodeTypeEnum) {
    NodeTypeEnum[NodeTypeEnum["none"] = 0] = "none";
    NodeTypeEnum[NodeTypeEnum["attribute"] = 1] = "attribute";
    NodeTypeEnum[NodeTypeEnum["cdata"] = 2] = "cdata";
    NodeTypeEnum[NodeTypeEnum["comment"] = 3] = "comment";
    NodeTypeEnum[NodeTypeEnum["document"] = 4] = "document";
    NodeTypeEnum[NodeTypeEnum["documentFragment"] = 5] = "documentFragment";
    NodeTypeEnum[NodeTypeEnum["documentType"] = 6] = "documentType";
    NodeTypeEnum[NodeTypeEnum["element"] = 7] = "element";
    NodeTypeEnum[NodeTypeEnum["endElement"] = 8] = "endElement";
    NodeTypeEnum[NodeTypeEnum["entity"] = 9] = "entity";
    NodeTypeEnum[NodeTypeEnum["entityReference"] = 10] = "entityReference";
    NodeTypeEnum[NodeTypeEnum["notation"] = 11] = "notation";
    NodeTypeEnum[NodeTypeEnum["processingInstruction"] = 12] = "processingInstruction";
    NodeTypeEnum[NodeTypeEnum["significantWhitespace"] = 13] = "significantWhitespace";
    NodeTypeEnum[NodeTypeEnum["text"] = 14] = "text";
    NodeTypeEnum[NodeTypeEnum["whitespace"] = 15] = "whitespace";
    NodeTypeEnum[NodeTypeEnum["xmlDeclaration"] = 16] = "xmlDeclaration";
})(NodeTypeEnum = exports.NodeTypeEnum || (exports.NodeTypeEnum = {}));
var XNodeTypesEnum;
(function (XNodeTypesEnum) {
    XNodeTypesEnum[XNodeTypesEnum["cdata"] = 2] = "cdata";
    XNodeTypesEnum[XNodeTypesEnum["comment"] = 3] = "comment";
    XNodeTypesEnum[XNodeTypesEnum["document"] = 4] = "document";
    XNodeTypesEnum[XNodeTypesEnum["documentType"] = 6] = "documentType";
    XNodeTypesEnum[XNodeTypesEnum["element"] = 7] = "element";
    XNodeTypesEnum[XNodeTypesEnum["text"] = 14] = "text";
})(XNodeTypesEnum = exports.XNodeTypesEnum || (exports.XNodeTypesEnum = {}));
