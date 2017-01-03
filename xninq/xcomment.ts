import { XNode } from './xnode';
import { IXComment } from './interfaces';
import { Converter } from './converter';

export class XComment extends XNode implements IXComment {
	value: string;
	nodeType: 'comment';

	constructor(value: string);
	constructor(other: IXComment);
	constructor(valueOrOther: string | IXComment) {
		let superArg;
		if (typeof valueOrOther === 'object') {
			superArg = valueOrOther;
			valueOrOther = valueOrOther.value;
		}
		super(superArg);
		this.value = valueOrOther;
		this.nodeType = 'comment';
	}

	clone(): XComment {
		return new XComment(this);
	}

	toString(): string {
		return escapeComment`<-- ${ this.value } -->`;
	}
}

function escapeComment(strings: TemplateStringsArray, ...values: any[]) {
	let result = [];
	for (let i = 0; i < values.length; i++) {
		result.push(strings[i]);
		result.push(
			Converter.fromValue(values[i])
				.replace(/-->/g, '- - >')
		);
	}
	result.push(strings[strings.length - 1]);
	return result.join('');
}

export default XComment;