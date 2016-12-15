import * as uuid from 'node-uuid';
export type Maybe<T> = T | undefined;
export type Getter = () => Maybe<string>;

export class Converter {
	private readonly _getter: Getter;

	constructor(getter: Getter) {
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
}