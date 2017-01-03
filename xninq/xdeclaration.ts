import { IXDeclaration } from './interfaces';
import { Maybe, Converter } from './converter';
import { createEscape } from './escape';

type EnglishBoolean = 'yes' | 'no';

export class XDeclaration implements IXDeclaration {
	encoding?: string;
	_version: number;
	_standalone?: boolean;

	constructor(
		version: string,
		encoding?: string,
		standalone?: EnglishBoolean,
	);
	constructor(
		version: number,
		encoding?: string,
		standalone?: boolean,
	)
	constructor(other: IXDeclaration);
	constructor(
		versionOrOther: string | IXDeclaration | number,
		encoding?: string,
		standalone?: EnglishBoolean | boolean,
	) {
		if (typeof versionOrOther === 'object') {
			this.version = versionOrOther.version;
			this.encoding = versionOrOther.encoding;
			this.standalone = versionOrOther.standalone;
		}
		else if (typeof versionOrOther === 'string') {
			this.version = versionOrOther as string;
			this.encoding = encoding;
			this.standalone = standalone as EnglishBoolean;
		}
		else if (typeof versionOrOther === 'number') {
			this._version = versionOrOther;
			this.encoding = encoding;
			this._standalone = standalone as boolean;
		}
		else {
			throw new TypeError('encoding');
		}
	}

	get standalone(): Maybe<EnglishBoolean> {
		let result: Maybe<EnglishBoolean>;
		if (this._standalone !== undefined) {
			result = this._standalone
				? 'yes'
				: 'no';
		}
		return result;
	}
	set standalone(value: Maybe<EnglishBoolean>) {
		if (!value) {
			this._standalone = undefined;
		}
		else {
			if (!['yes', 'no'].includes(value)) {
				throw new TypeError('standalone');
			}
			this._standalone = value === 'yes';
		}
	}

	get version(): string {
		return this._version.toFixed(1);
	}
	set version(value: string) {
		const version = Number.parseInt(value);
		if (isNaN(version) || [Infinity, -Infinity].includes(version)) {
			throw new TypeError('version');
		}
		this._version = version;
	}

	toString(): string {
		let result = xDeclareEscape`<?xml version="${ this.version }"`;
		if (this.encoding) {
			result += xDeclareEscape` encoding="${ this.encoding }"`;
		}
		if (this._standalone !== undefined) {
			result += xDeclareEscape` standalone="${ this.standalone }"`;
		}
		result += '?>';
		return result;
	}
}

const xDeclareEscape = createEscape(val =>
	Converter.fromValue(val)
		.replace(/\'/g, '&apos;')
		.replace(/\"/g, '&quot;')
);

export default XDeclaration;
