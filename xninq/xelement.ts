import { XContainer } from './xcontainer';
import { IXElement, IXNode, IXAttribute, SaveOptions } from './interfaces';
import { XName, isXName, XNamespaceClass, XNamespace, XNameClass } from './xname';
import _ from 'ts-ninq';
import { Maybe, Converter } from './converter';
import { Stream } from 'stream';

export class XElement extends XContainer implements IXElement {
	private _name: XNameClass;
	readonly nodeType: 'element';
	value: string;
	readonly to: Converter;

	constructor(name: XName, ...content: any[]);
	constructor(other: IXElement);
	constructor(nameOrOther: XName | IXElement, ...content: any[]) {
		if (isXName(nameOrOther)) {
			super();
		}
		else {
			super(nameOrOther);
		}
	}

	get hasAttributes(): boolean {

	}

	get hasElements(): boolean {

	}

	get isEmpty(): boolean {
		return !this.hasAttributes && !this.hasElements;
	}

	get name(): XName {
		return this._name;
	}
	set name(value: XName) {
		this._name = XNameClass.get(value);
	}

	add(...content: any[]): void {

	}

	addFirst(...content: any[]): void {

	}

	descendantNodes(): _<IXNode> {

	}

	descendant(name?: XName): _<IXElement> {

	}

	element(name: XName): Maybe<IXElement> {

	}

	elements(name?: XName): _<IXElement> {

	}

	nodes(): _<IXNode> {

	}

	removeNodes(): void {

	}

	replaceNodes(content: any, ...contents: any[]): void {

	}

	ancestorsAndSelf(name?: XName): _<IXElement> {

	}

	attribute(name: XName): Maybe<IXAttribute> {

	}

	attributes(name?: XName): _<IXAttribute> {

	}

	descendantNodesAndSelf(): _<IXNode> {

	}

	descendantsAndSelf(name?: XName): _<IXElement> {

	}

	getNamespaceOfPrefix(prefix: string): XNamespaceClass {

	}
	getPrefixOfNamespace(namespace: XNamespace): string {

	}

	removeAll(): void {

	}

	removeAttributes(): void {

	}

	replaceAll(content: any, ...contents: any[]): void {

	}

	replaceAttributes(content: any, ...contents: any[]): void {

	}
	save(to: string | Stream, ...saveOptions: SaveOptions[]): void {

	}

	setAttributeValue(name: XName, value: any): void {

	}

	setElementValue(name: XName, value: any): void {

	}

	setValue(value: any): void {

	}

	toString(saveOptions?: SaveOptions): string {

	}

	clone(): XElement {
		return new XElement(this);
	}
}