import _ from 'ts-ninq';
import { XName, XNameClass, XNamespaceClass, XNamespace } from './xname';
import { Converter, Maybe } from './converter';
import { Writable as Stream } from 'stream';

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
export function isXObject(val: any): val is IXObject {
	return val &&
		val.nodeType &&
		NodeTypeEnum[val.nodeType] !== undefined;
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
export function isXAttribute(val: any): val is IXAttribute {
	return isXObject(val) &&
		val.nodeType === 'attribute';
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
export function isXNode(obj: any): obj is IXNode {
	const nodeTypes: XNodeTypes[] = [
		'cdata',
		'comment',
		'document',
		'documentType',
		'element',
	];
	return obj && nodeTypes.includes(obj.nodeType);
}
export interface IXDocumentType extends IXNode {
	internalSubset?: string;
	name: string;
	readonly nodeType: 'documentType';
	publicId?: string;
	systemId?: string;

	clone(): IXDocumentType;
}
export function isXDocumentType(val: any): val is IXDocumentType {
	return isXObject(val) &&
		val.nodeType === 'documentType';
}
export interface IXComment extends IXNode {
	readonly nodeType: 'comment';
	value: string;

	clone(): IXComment;
}
export function isXComment(val: any): val is IXComment {
	return isXObject(val) &&
		val.nodeType === 'comment';
}
export interface IXText extends IXNode {
	readonly nodeType: 'text' | 'cdata';
	value: string;

	clone(): IXText;
}
export function isXText(val: any): val is IXText {
	return isXObject(val) &&
		['text', 'cdata'].includes(val.nodeType);
}
export interface IXCData extends IXText {
	readonly nodeType: 'cdata';
	clone(): IXCData;
}
export function isXCData(val: any): val is IXCData {
	return isXText(val) &&
		val.nodeType === 'cdata';
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
export function isXContainer(val: any): val is IXContainer {
	return isXObject(val) &&
		['element', 'document'].includes(val.nodeType);
}
export interface IXDeclaration {
	encoding?: string;
	standalone?: 'yes' | 'no';
	version: string;

	toString(): string;
}
export function isXDeclaration(val: any): val is IXDeclaration {
	return val &&
		val.version &&
		isInt(val.version);

	function isInt(val: string) {
		const num = Number.parseInt(val);
		return num === ~~num;
	}
}
export interface IXDocument extends IXContainer {
	declaration?: IXDeclaration;
	readonly documentType?: IXDocumentType;
	readonly nodeType: 'document';
	readonly root: IXElement;
	parent: undefined;

	save(to: string | Stream, saveOptions?: SaveOptions): Promise<void>;
	toString(saveOptions?: SaveOptions): string;
	clone(): IXDocument;
}
export function isXDocument(val: any): val is IXDocument {
	return isXObject(val) &&
		val.nodeType === 'document';
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
export function isXElement(val: any): val is IXElement {
	return isXObject(val) &&
		val.nodeType === 'element';
}
