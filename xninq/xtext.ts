import { XNode } from './xnode';
import { IXText } from './interfaces';

export class XText extends XNode implements IXText {
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
	}
}