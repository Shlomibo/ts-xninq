import { XNode } from './xnode';
import { IXText, IXCData } from './interfaces';
import { escape } from './xobject';
import { createEscape } from './escape';
import { Converter } from './converter';

export class XText extends XNode implements IXText {
	nodeType: 'text' | 'cdata';
	value: string;

	constructor(value: string | IXText) {
		if (typeof value === 'string') {
			super();
			this.value = value;
		}
		else {
			super(value);
			this.value = value.value;
		}

		this.nodeType = 'text';
	}

	clone(): XText {
		return new XText(this);
	}

	toString(): string {
		return escape`${ this.value }`;
	}
}

export default XText;

export class XCData extends XText implements IXCData {
	nodeType: 'cdata';

	constructor(value: string);
	constructor(other: IXCData);
	constructor(valueOrOther: string | IXCData) {
		super(valueOrOther);
		this.nodeType = 'cdata';
	}

	clone(): XCData {
		return new XCData(this);
	}

	toString(): string {
		return cdataEscape`<![CDATA[${ this.value }]]>`;
	}
}

const cdataEscape = createEscape(val =>
	Converter.fromValue(val)
		.replace(/]]>/g, ']]]]><![CDATA[>')
);