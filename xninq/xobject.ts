import { EventEmitter } from 'events';
import { ChangeEvent, XObjectChange, IXObject, NodeType, IXDocument, IXElement } from './interfaces';
import { Maybe } from './converter';
import { isNodesContainer, NodeContainer } from './nodes-list';
import { isAttributesContainer, AttributesContainer } from './attributes-lists';
import { createEscape } from './escape';

export type ChangeEventHandler = (event: ChangeEvent, e: ChangeEventArgs) => void;

export interface XmlLineInfo {
	readonly lineNumber: number;
	readonly linePosition: number;
}
export interface MayHasLineInfo {
	hasLineInfo(): this is XmlLineInfo;
}
export interface ChangeEventArgs {
	readonly sender: XObject;
	readonly change: XObjectChange;
}

export abstract class XObject implements IXObject {

	private readonly _emitter = new EventEmitter();
	private _baseUri?: string;
	private _document?: IXDocument;
	private _parent?: IXElement;

	constructor(other?: IXObject) {
		if (other) {
			this._setBaseUri(other.baseUri)
				._setDocument(other.document)
				._setParent(other.parent);
		}
	}

	abstract get nodeType(): NodeType;

	get baseUri() {
		return this._baseUri;
	}
	get document(): Maybe<IXDocument> {
		return this._document;
	}
	get parent(): Maybe<IXElement> {
		return this._parent;
	}

	set parent(parent: Maybe<IXElement>) {
		if (this._parent && parent) {
			throw new Error('Cannot set parent for attached element');
		}

		this._parent = parent;
	}

	protected _setBaseUri(value?: string): this {
		this._baseUri = value;
		return this;
	}

	protected _setDocument(doc?: IXDocument): this {
		this._document = doc;
		return this;
	}

	_setParent(parent?: IXElement): this {
		if (this._parent && parent) {
			throw new Error('Cannot set parent on attached element');
		}
		if (parent && !isValidParent(parent)) {
			throw new TypeError('parent');
		}
		this._parent = parent;
		return this;
	}


	abstract clone(): XObject;

	on(event: ChangeEvent, handler: ChangeEventHandler): this {
		this._emitter.on(event, handler);
		return this;
	}
	once(event: ChangeEvent, handler: ChangeEventHandler): this {
		this._emitter.once(event, handler);
		return this;
	}
	removeListener(event: ChangeEvent, handler: ChangeEventHandler): void {
		this._emitter.removeListener(event, handler);
	}

	hasLineInfo(): this is XmlLineInfo {
		return typeof (this as any).lineNumber === 'number';
	}

	protected _onChanging(change: XObjectChange): void {
		this._emitter.emit('changing', {
			sender: this,
			change,
		});
	}
	protected _onChanged(change: XObjectChange): void {
		this._emitter.emit('changed', {
			sender: this,
			change,
		});
	}
}

export default XObject;

export function isValidParent(parent?: any): parent is NodeContainer & AttributesContainer {
	return isNodesContainer(parent) &&
		isAttributesContainer(parent);
}


export const escape = createEscape((val: any): string => {
	return val;
});