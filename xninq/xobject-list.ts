import _ from 'ts-ninq';
import { isIterable, isArrayLike, ArrayLikeIterable, ReverseArrayLikeIterable } from 'ts-ninq';
import XObject from './xobject';
import { XElement } from './xelement';
import XDocument from './xdocument';

export class XObjectList<T extends XObject> extends _<T> {
	private _list: T[];
	parent?: XElement;
	document?: XDocument;

	constructor(
		parent?: XElement,
		document?: XDocument,
		objects?: Iterable<T>,
	) {
		const list: T[] = [];
		super(list);
		this._list = list;
		this.parent = parent;
		this.document = document;

		if (objects) {
			this.push(objects);
		}
	}

	get length() {
		return super.length!;
	}

	after(anchor: number | T): _<T> {
		anchor = typeof anchor === 'number'
			? anchor
			: this._list.indexOf(anchor);
		return _.of(new ArrayLikeIterable(this._list, anchor));
	}

	before(anchor: number | T): _<T> {
		anchor = typeof anchor === 'number'
			? anchor
			: this._list.indexOf(anchor);
		return _.of(new ReverseArrayLikeIterable(this._list, anchor));
	}

	clear(): void {
		this._list.splice(0, this._list.length);
	}

	insertBefore(TClass: T, objects: T | Iterable<T>) {
		const nodeIndex = this._list.indexOf(TClass),
			count = isIterable(objects)
				? _.count(objects)
				: 1;

		this.insert(nodeIndex - count, objects);
	}

	insert(after: number | T, objects: T | Iterable<T>) {
		const at = typeof after === 'number'
			? after
			: this._list.indexOf(after);
		if ((at < 0) || (at > this.length)) {
			throw new RangeError('after is out of range, or unknown node');
		}

		if (!isIterable(objects)) {
			objects = [objects];
		}
		objects = _.map(objects, obj => {
			if (!(obj instanceof XObject) ||
				(obj.parent && obj.parent !== this.parent)) {

				obj = obj.clone() as T;
				obj._setParent(this.parent);
				obj._setDocument(this.document);
			}
			return obj;
		});
		this._list.splice(at, 0, ...objects);
	}

	remove(from: number | T): T;
	remove(from: number | T, count: number): T[];
	remove(from: number | T, count?: number): T | T[] {
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

	push(nodes: T | Iterable<T>): void {
		this.insert(this.length, nodes);
	}

	pop(): T;
	pop(count: number): T[];
	pop(count?: number): T | T[] {
		count = typeof count === 'number'
			? count
			: 1;
		return this.remove(this.length - count, count);
	}

	unshift(nodes: T | Iterable<T>) {
		this.insert(0, nodes);
	}

	shift(): T;
	shift(count: number): T[];
	shift(count?: number): T | T[] {
		return this.remove(0, count as any);
	}

	_setParent(parent?: XElement) {
		for (let item of this) {
			item._setParent(parent);
		}
		this.parent = parent;
	}
	_setDocument(doc?: XDocument) {
		for (let item of this) {
			item._setDocument(doc);
		}
		this.document = doc;
	}
}

export default XObjectList;
export {
	isIterable,
	isArrayLike,
};