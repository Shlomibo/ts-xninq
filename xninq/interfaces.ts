import _ from 'ts-ninq';
import { XName, XNameClass, XNamespaceClass, XNamespace } from './xname';
import { Converter, Maybe } from './converter';
import { Stream } from 'stream';

export type ChangeEvent = 'changing' | 'changed';
export type IChangeEventHandler = (event: ChangeEvent, e: IChangeEventArgs) => void;

export enum SaveOptions {
	none = 0x00,
	disableFormatting = 0x01,
	omitDuplicateNamespaces = 0x02,
}
export enum XObjectChange {
	add,
	name,
	remove,
	value,
};
export enum NodeTypeEnum {
	none,
	attribute,
	cdata,
	comment,
	document,
	documentFragment,
	documentType,
	element,
	endElement,
	entity,
	entityReference,
	notation,
	processingInstruction,
	significantWhitespace,
	text,
	whitespace,
	xmlDeclaration,
}
export enum XNodeTypesEnum {
	cdata = NodeTypeEnum.cdata,
	comment = NodeTypeEnum.comment,
	document = NodeTypeEnum.document,
	documentType = NodeTypeEnum.documentType,
	element = NodeTypeEnum.element,
	text = NodeTypeEnum.text,
}
export type NodeType = keyof typeof NodeTypeEnum;
export type XNodeTypes = keyof typeof XNodeTypesEnum;

export interface XmlLineInfo {
	readonly lineNumber: number;
	readonly linePosition: number;
}
export interface MayHasLineInfo {
	hasLineInfo(): this is XmlLineInfo;
}
export interface IChangeEventArgs {
	readonly sender: IXObject;
	readonly change: XObjectChange;
}
export interface IXObject extends MayHasLineInfo {
	readonly baseUri?: string;
	readonly document?: IXDocument;
	readonly nodeType: NodeType;
	readonly parent?: IXElement;

	on(event: ChangeEvent, handler: IChangeEventHandler): this;
	once(event: ChangeEvent, handler: IChangeEventHandler): this;
	removeListener(event: ChangeEvent, handler: IChangeEventHandler): void;

	clone(): IXObject;
}
export interface IXAttribute extends IXObject {
	readonly isNamespaceDeclaration: boolean;
	readonly name: XNameClass;
	readonly nextAttribute?: IXAttribute;
	readonly nodeType: 'attribute';
	readonly previousAttribute?: IXAttribute;
	value: string;
	readonly to: Converter;

	remove(): void;
	setValue(value: any): void;
	toString(): string;

	clone(): IXAttribute;
}
export interface IXNode extends IXObject {
	readonly nextNode?: IXNode;
	readonly previousNode?: IXNode;

	addAfterSelf(...content: any[]): void;
	addBeforeSelf(...content: any[]): void;
	ancestors(): _<IXNode>;
	elementsAfterSelf(name?: XName): _<IXElement>;
	elementsBeforeSelf(name?: XName): _<IXElement>;
	isAfter(node: IXNode): boolean;
	isBefore(node: IXNode): boolean;
	nodesAfterSelf(): _<IXNode>;
	nodesBeforeSelf(): _<IXNode>;
	remove(): void;
	replaceWith(content: any, ...contents: any[]): void;
	toString(saveOptions?: SaveOptions): string;

	clone(): IXNode;
}
export interface IXDocumentType extends IXNode {
	internalSubset?: string;
	name: string;
	readonly nodeType: 'documentType';
	publicId?: string;
	systemId?: string;

	clone(): IXDocumentType;
}
export interface IXComment extends IXNode {
	readonly nodeType: 'comment';
	value: string;

	clone(): IXComment;
}
export interface IXText extends IXNode {
	readonly nodeType: 'text' | 'cdata';
	value: string;

	clone(): IXText;
}
export interface IXCData extends IXText {
	readonly nodeType: 'cdata';
	clone(): IXCData;
}
export interface IXContainer extends IXNode {
	readonly firstNode?: IXNode;
	readonly lastNode?: IXNode;

	add(...content: any[]): void;
	addFirst(...content: any[]): void;
	descendantNodes(): _<IXNode>;
	descendant(name?: XName): _<IXElement>;
	element(name: XName): Maybe<IXElement>;
	elements(name?: XName): _<IXElement>;
	nodes(): _<IXNode>;
	removeNodes(): void;
	replaceNodes(content: any, ...contents: any[]): void;

	clone(): IXContainer;
}
export interface IXDeclaration {
	encoding?: string;
	standalone?: 'yes' | 'no';
	version: string;

	toString(): string;
}
export interface IXDocument extends IXContainer {
	declaration?: IXDeclaration;
	readonly documentType?: IXDocumentType;
	readonly nodeType: 'document';
	readonly root: IXElement;

	save(to: string | Stream, saveOptions?: SaveOptions): void;
	toString(saveOptions?: SaveOptions): string;
	clone(): IXDocument;
}
export interface IXElement extends IXContainer {
	readonly firstAttribute?: IXAttribute;
	readonly hasAttributes: boolean;
	readonly hasElements: boolean;
	readonly isEmpty: boolean;
	readonly lastAttribute?: IXAttribute;
	name: XName;
	readonly nodeType: 'element';
	value: string;
	readonly to: Converter;

	ancestorsAndSelf(name?: XName): _<IXElement>;
	attribute(name: XName): Maybe<IXAttribute>;
	attributes(name?: XName): _<IXAttribute>;
	descendantNodesAndSelf(): _<IXNode>;
	descendantsAndSelf(name?: XName): _<IXElement>;
	getNamespaceOfPrefix(prefix: string): XNamespaceClass;
	getPrefixOfNamespace(namespace: XNamespace): string;
	removeAll(): void;
	removeAttributes(): void;
	replaceAll(content: any, ...contents: any[]): void;
	replaceAttributes(content: any, ...contents: any[]): void;
	save(to: string | Stream, ...saveOptions: SaveOptions[]): void;
	setAttributeValue(name: XName, value: any): void;
	setElementValue(name: XName, value: any): void;
	setValue(value: any): void;
	toString(saveOptions?: SaveOptions): string;

	clone(): IXElement;
}
