import _ from 'ts-ninq';
import { isIterable, isArrayLike, ArrayLikeIterable, ReverseArrayLikeIterable } from 'ts-ninq';
import { IXObject } from './interfaces';
import { Converter } from './converter';
import XObject from './xobject';

export class XObjectList<TClass extends XObject, TInterface extends IXObject> extends _<TClass> {
	private _list: TClass[];

	constructor(objects?: Iterable<TInterface>) {
		const list: TClass[] = [];
		super(list);
		this._list = list;

		if (objects) {
			this.push(objects);
		}
	}

	get length() {
		return super.length!;
	}

	after(anchor: number | TClass): _<TClass> {
		anchor = typeof anchor === 'number'
			? anchor
			: this._list.indexOf(anchor);
		return _.of(new ArrayLikeIterable(this._list, anchor));
	}

	before(anchor: number | TClass): _<TClass> {
		anchor = typeof anchor === 'number'
			? anchor
			: this._list.indexOf(anchor);
		return _.of(new ReverseArrayLikeIterable(this._list, anchor));
	}

	insertBefore(TClass: TClass, objects: TInterface | Iterable<TInterface>) {
		const nodeIndex = this._list.indexOf(TClass),
			count = isIterable(objects)
				? _.count(objects)
				: 1;

		this.insert(nodeIndex - count, objects);
	}

	insert(after: number | TClass, objects: TInterface | Iterable<TInterface>) {
		const at = typeof after === 'number'
			? after
			: this._list.indexOf(after);
		if ((at < 0) || (at > this.length)) {
			throw new RangeError('after is out of range, or unknown node');
		}

		if (!isIterable(objects)) {
			objects = [objects];
		}
		const items = _.map(objects, Converter.from) as Iterable<TClass>;
		this._list.splice(at, 0, ...items);
	}

	remove(from: number | TClass): TClass;
	remove(from: number | TClass, count: number): TClass[];
	remove(from: number | TClass, count?: number): TClass | TClass[] {
		if (typeof count !== 'number') {
			count = 1;
		}
		from = typeof from === 'number'
			? from
			: this._list.indexOf(from);
		if ((from < 0) || (from >= this.length)) {
			throw new RangeError('after is out of range, or unknown node');
		}
		if (isNaN(count) || (count < 0) || (count + from > this.length)) {
			throw new Error('Invalid count');
		}
		let result = this._list.splice(from, count);
		return arguments.length === 0
			? result[0]
			: result;
	}

	push(nodes: TInterface | Iterable<TInterface>): void {
		this.insert(this.length, nodes);
	}

	pop(): TClass;
	pop(count: number): TClass[];
	pop(count?: number): TClass | TClass[] {
		count = typeof count === 'number'
			? count
			: 1;
		return this.remove(this.length - count, count);
	}

	unshift(nodes: TInterface | Iterable<TInterface>) {
		this.insert(0, nodes);
	}

	shift(): TClass;
	shift(count: number): TClass[];
	shift(count?: number): TClass | TClass[] {
		return this.remove(0, count as any);
	}
}

export default XObjectList;
export {
	isIterable,
	isArrayLike,
};