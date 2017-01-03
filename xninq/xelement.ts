import { XContainer } from './xcontainer';
import { IXElement } from './interfaces';
import { XName, isXName } from './xname';

export class XElement extends XContainer implements IXElement {
	constructor(name: XName, ...content: any[]);
	constructor(other: IXElement);
	constructor(nameOrOther: XName | IXElement, ...content: any[]) {
		if (isXName(nameOrOther)) {
			super();
		}
		else {
			super(nameOrOther);
		}
	}
}