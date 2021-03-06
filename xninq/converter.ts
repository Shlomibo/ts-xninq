import * as uuid from 'node-uuid';
import XObject from './xobject';
import XText from './xtext';
import { isXObject } from './interfaces';
import { SimpleElement, Builder, Parser } from './json';

export type Maybe<T> = T | undefined;
export type ValueGetter = () => Maybe<string>;
export type ObjectGetter = (parser?: any, builder?: any) => {};

const valueConverters = {
	'undefined': (val: any) => undefined,
	string: (val: any) => new XText(val),
	boolean: (val: any) => valueConverters.string(val.toString()),
	number: (val: any) => valueConverters.string(val.toString()),
	symbol: (val: any) => valueConverters.string(val.toString()),
	object: (val: any) =>
		!val ? valueConverters.undefined(val) :
			isXObject(val) ? val :
				valueConverters.string(Converter.fromValue(val)),
	'function': (val: any) => valueConverters.object(val),
};

export class Converter {
	private readonly _getter: ValueGetter;

	constructor(getter: ValueGetter) {
		this._getter = getter;
	}

	boolean(): boolean {
		return Converter.boolean(this._getter());
	}

	date(): Date {
		return Converter.date(this._getter());
	}

	number(): number {
		return Converter.number(this._getter());
	}

	uuid(): Buffer {
		return Converter.uuid(this._getter());
	}

	string(): string {
		return Converter.string(this._getter());
	}

	static boolean(value?: string): boolean {
		const falseValues = [
			'undefined',
			'null',
			'no',
			'false',
			'0'
		];
		return !!value &&
			falseValues.every(falseVal =>
				falseVal !== value.toLowerCase());
	}

	static date(value?: string): Date {
		return value
			? new Date(value)
			: new Date(0);
	}

	static number(value?: string): number {
		return value
			? Number(value)
			: 0;
	}

	static uuid(value?: string): Buffer {
		return value
			? uuid.parse(value) as Buffer
			: Buffer.from([]);
	}

	static string(value?: string): string {
		return value || '';
	}

	static fromValue(value: any): string {
		if (typeof value === 'string') {
			return value;
		}
		else if ((value === undefined) || (value === null)) {
			return '';
		}
		else if ((typeof value !== 'object') || (typeof value.toString === 'function')) {
			return value.toString();
		}
		else {
			return Object.prototype.toString.call(value);
		}
	}

	static from(value: any): Maybe<XObject> {
		return valueConverters[typeof value](value);
	}
}

export default Converter;

export interface ObjectConverter {
	object(): SimpleElement;
	object<TDoc, TElement, TAttr, TText>(
		builder: Partial<Builder<TDoc, TElement, TAttr, TText>>
	): TDoc | TElement;
	object<TAttr, TText>(parser: Partial<Parser<TAttr, TText>>): SimpleElement;
	object<TDoc, TElement, TAttr, TText>(
		parser: Partial<Parser<TAttr, TText>>,
		builder: Partial<Builder<TDoc, TElement, TAttr, TText>>
	): TDoc | TElement;
}

export class ObjectConvertableConverter extends Converter implements ObjectConverter {
	private readonly _objectGetter: ObjectGetter;

	constructor(
		valueGetter: ValueGetter,
		objectGetter: ObjectGetter,
	) {
		super(valueGetter);
		this._objectGetter = objectGetter;
	}

	object(): SimpleElement;
	object<TDoc, TElement, TAttr, TText>(
		builder: Partial<Builder<TDoc, TElement, TAttr, TText>>
	): TDoc | TElement;
	object<TAttr, TText>(parser: Partial<Parser<TAttr, TText>>): SimpleElement;
	object<TDoc, TElement, TAttr, TText>(
		parser: Partial<Parser<TAttr, TText>>,
		builder: Partial<Builder<TDoc, TElement, TAttr, TText>>
	): TDoc | TElement;
	object(
		parser?: any,
		builder?: any
	): { } {

		return this._objectGetter(parser, builder);
	}
}
