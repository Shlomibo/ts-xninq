import Ninq from 'ts-ninq';
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
export enum XmlNodeType {
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
	readonly baseUrl?: string;
	readonly document?: IXDocument;
	readonly nodeType: keyof typeof XmlNodeType;
	readonly parent?: IXElement;

	on(event: ChangeEvent, handler: IChangeEventHandler): this;
	once(event: ChangeEvent, handler: IChangeEventHandler): this;
	removeListener(event: ChangeEvent, handler: IChangeEventHandler): void;
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
}
export interface IXNode extends IXObject {
	readonly nextNode?: IXNode;
	readonly previousNode?: IXNode;

	addAfterSelf(...content: any[]): void;
	addBeforeSelf(...content: any[]): void;
	ancestors(): Ninq<IXNode>;
	elementsAfterSelf(name?: XName): Ninq<IXElement>;
	elementsBeforeSelf(name?: XName): Ninq<IXElement>;
	isAfter(node: IXNode): boolean;
	isBefore(node: IXNode): boolean;
	nodesAfterSelf(): Ninq<IXNode>;
	nodesBeforeSelf(): Ninq<IXNode>;
	remove(): void;
	replaceWith(content: any, ...contents: any[]): void;
	toString(saveOptions?: SaveOptions): string;
}
export interface IXDocumentType extends IXNode {
	internalSubset: string;
	name: string;
	readonly nodeType: 'documentType';
	publicId?: string;
	systemId?: string;
}
export interface IXComment extends IXNode {
	readonly nodeType: 'comment';
	value: string;
}
export interface IXText extends IXNode {
	readonly nodeType: 'text' | 'cdata';
	value: string;
}
export interface IXCData extends IXText {
	readonly nodeType: 'cdata';
}
export interface IXContainer extends IXNode {
	readonly firstNode?: IXNode;
	readonly lastNode?: IXNode;

	add(...content: any[]): void;
	addFirst(...content: any[]): void;
	descendantNodes(): Ninq<IXNode>;
	descendant(name?: XName): Ninq<IXElement>;
	element(name: XName): Maybe<IXElement>;
	elements(name?: XName): Ninq<IXElement>;
	nodes(): Ninq<IXNode>;
	removeNodes(): void;
	replaceNodes(content: any, ...contents: any[]): void;
}
export interface IXDeclaration {
	encoding: string;
	standalone?: 'yes' | 'no';
	version?: string;
}
export interface IXDocument extends IXContainer {
	declaration?: IXDeclaration;
	readonly documentType?: IXDocumentType;
	readonly nodeType: 'document';
	readonly root: IXElement;

	save(to: string | Stream, saveOptions?: SaveOptions): void;
	toString(saveOptions?: SaveOptions): string;
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

	ancestorsAndSelf(name?: XName): Ninq<IXElement>;
	attribute(name: XName): Maybe<IXAttribute>;
	attributes(name?: XName): Ninq<IXAttribute>;
	descendantNodesAndSelf(): Ninq<IXNode>;
	descendantsAndSelf(name?: XName): Ninq<IXElement>;
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
}