import { EventEmitter } from 'events';
import { ChangeEvent, XObjectChange, XmlNodeType, IXObject } from './_xobject';

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

	abstract get nodeType(): XmlNodeType;

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