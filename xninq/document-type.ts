import { XNode } from './xnode';
import { IXDocumentType } from './interfaces';
import { escape } from './xobject';

export class XDocumentType extends XNode implements IXDocumentType {

	readonly nodeType: 'documentType';
	name: string;
	publicId?: string;
	systemId?: string;
	internalSubset?: string;

	constructor(
		name: string,
		publicId: string,
		systemId: string,
		internalSubset: string,
	);
	constructor(other: IXDocumentType);
	constructor(
		nameOrOther: string | IXDocumentType,
		publicId?: string,
		systemId?: string,
		internalSubset?: string,
	) {
		let superArg;
		if (typeof nameOrOther === 'object') {
			superArg = nameOrOther;
			publicId = nameOrOther.publicId;
			systemId = nameOrOther.systemId;
			internalSubset = nameOrOther.internalSubset;
			nameOrOther = nameOrOther.name;
		}
		super(superArg);
		this.name = nameOrOther;
		this.publicId = publicId;
		this.systemId = systemId;
		this.internalSubset = internalSubset!;
		this.nodeType = 'documentType';
	}

	clone(): XDocumentType {
		return new XDocumentType(this);
	}

	toString(): string {
		return !this.internalSubset
			? escape`<!DOCTYPE ${ this.name } ${ this.publicId } "${ this.systemId }">`
			: escape`<!DOCTYPE ${ this.name } ${ this.publicId } "${ this.systemId }" [
				` + this.internalSubset + `
			]>`;
	}
}