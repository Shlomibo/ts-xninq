import XContainer from './xcontainer';
import { IXDocument, IXNode, IXElement, SaveOptions, isXDocument, isXDeclaration, isXDocumentType, isXElement, isXComment } from './interfaces';
import XDeclaration from './xdeclaration';
import XDocumentType from './xdocument-type';
import { XElement } from './xelement';
import { Maybe } from './converter';
import _ from 'ts-ninq';
import { XName } from './xname';
import { Stream } from 'stream';
import XComment from './xcomment';

export class XDocument extends XContainer implements IXDocument {
	readonly parent: undefined;
	declaration?: XDeclaration;
	readonly documentType?: XDocumentType;
	readonly nodeType: 'document';
	readonly root: XElement;

	constructor(other: IXDocument);
	constructor(declaration: XDeclaration, ...content: any[]);
	constructor(...content: any[]);
	constructor(otherOrDecOrContent: any, ...content: any[]) {
		if (isXDocument(otherOrDecOrContent)) {
			super(otherOrDecOrContent);
			this.declaration = otherOrDecOrContent.declaration &&
				new XDeclaration(otherOrDecOrContent.declaration);
			this.root = this._nodes
				.single(node => node.nodeType === 'element') as XElement;
		}
		else {
			super();
			content.unshift(otherOrDecOrContent);

			for (let item of content) {
				if (isXDeclaration(item)) {
					if (this.declaration) {
						throw new Error('Duplicate declaration');
					}
					this.declaration = new XDeclaration(item);
				}
				else if (isXDocumentType(item)) {
					if (this.documentType) {
						throw new Error('Duplicate docType');
					}
					this.documentType = new XDocumentType(item);
				}
				else if (isXElement(item)) {
					if (this.root) {
						throw new Error('Duplicate root element');
					}
					this.root = new XElement(item);
					this._nodes.push(this.root);
				}
				else if (isXComment(item)) {
					this._nodes.push(new XComment(item));
				}
				else {
					throw new TypeError(`Invalid content: ${ item }`);
				}
			}
		}

		if (!this.root) {
			throw new Error('Missing root element');
		}
		
		this.nodeType = 'document';
	}

	get firstNode(): Maybe<IXNode> {

	}

	get lastNode(): Maybe<IXNode> {

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

	save(to: string | Stream, saveOptions?: SaveOptions): void {

	}

	toString(saveOptions?: SaveOptions): string {

	}

	clone(): XDocument {
		return new XDocument(this);
	}
}

export default XDocument;