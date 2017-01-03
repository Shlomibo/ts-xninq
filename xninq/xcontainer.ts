import { XNode } from './xnode';
import { IXContainer } from './interfaces';

export class XContainer extends XNode implements IXContainer {
	constructor(other?: IXContainer) {
		super(other);
	}
}