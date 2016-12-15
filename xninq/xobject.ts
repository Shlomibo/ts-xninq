import { EventEmitter } from 'events';
import { ChangeEvent, XObjectChange, IXObject, NodeType, IXDocument, IXElement } from './interfaces';
import { Maybe, Converter } from './converter';
import _ from 'ts-ninq';

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

	protected _setBaseUri(value?: string): this {
		this._baseUri = value;
		return this;
	}
	protected _setDocument(doc?: IXDocument): this {
		this._document = doc;
		return this;
	}
	protected _setParent(parent?: IXElement): this {
		this._parent = parent;
		return this;
	}

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

export function escape(strings: TemplateStringsArray, ...values: any[]): string {
	const valueStrings = new _(values)
		.map(Converter.fromValue)
		.map(xmlEscape)
		.toArray();
	const joint = [];

	for (let i = 0; i < valueStrings.length; i++) {
		joint.push(strings[i]);
		joint.push(valueStrings[i]);
	}
	joint.push(_.last(strings));

	return joint.join('');

	function xmlEscape(val: string): string {
		return val;
	}
}