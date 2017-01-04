import XContainer from './xcontainer';
import {
	IXDocument,
	SaveOptions,
	isXDocument,
	isXDeclaration,
	isXDocumentType,
	isXElement,
	isXComment,
	NodeType,
	IXDeclaration
} from './interfaces';
import XDeclaration from './xdeclaration';
import XDocumentType from './xdocument-type';
import { XElement } from './xelement';
import { Maybe, ObjectConverter, ObjectConvertableConverter } from './converter';
import _ from 'ts-ninq';
import { createWriteStream } from 'fs';
import XComment from './xcomment';
import XObject from './xobject';
import XNode from './xnode';
import { Writable as Stream } from 'stream';
import toObject from './json';

export class XDocument extends XContainer implements IXDocument {
	readonly parent: undefined;
	declaration?: XDeclaration;
	readonly documentType?: XDocumentType;
	readonly nodeType: 'document';
	readonly root: XElement;
	readonly to: ObjectConverter;
	protected readonly validNodeTypes: NodeType[];

	constructor(other: IXDocument);
	constructor(declaration: IXDeclaration, ...content: any[]);
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

		this.to = new ObjectConvertableConverter(
			() => { throw new Error('Not implemeneted'); },
			(parser?, builder?) => toObject(this, parser, builder)
		);
		this.nodeType = 'document';
		this.validNodeTypes = [
			'comment',
			'element',
			'documentType',
		];
	}

	get firstNode(): Maybe<XNode> {
		return this._nodes.firstOrDefault();
	}

	get lastNode(): Maybe<XNode> {
		return this._nodes.lastOrDefault();
	}

	save(to: string | Stream, saveOptions?: SaveOptions): Promise<void> {
		if (typeof to === 'string') {
			to = createWriteStream(to);
		}
		const callbackHandler = _.fromCallback<void>(),
			writeAwaiter = Promise.resolve(callbackHandler);
		to.on('error', err => callbackHandler(err));
		to.end(this.toString(saveOptions), callbackHandler);
		return writeAwaiter;
	}

	toString(saveOptions = SaveOptions.none): string {
		const result: string[] = [];
		if (this.declaration) {
			result.push(this.declaration.toString());
		}
		if (this.documentType) {
			result.push(this.documentType.toString());
		}
		result.push(...this._nodes.map(node =>
			node.toString(saveOptions)
		));
		return result.join(
			(saveOptions & SaveOptions.disableFormatting) === SaveOptions.disableFormatting
				? ''
				: '\n'
		);
	}

	protected _toString(saveOptions?: SaveOptions): string {
		return this.toString(saveOptions);
	}

	clone(): XDocument {
		return new XDocument(this);
	}

	protected validateNode(node?: XObject): boolean {
		const result = super.validateNode(node);
		if (node) {
			switch (node.nodeType) {
				case 'element': {
					if (this.root) {
						throw new Error('Duplicate root element');
					}
					break;
				}
				case 'documentType': {
					if (this.documentType) {
						throw new Error('Duplicate doc type');
					}
					break;
				}
				default: break;
			}
		}

		return result;
	}
}

export default XDocument;
