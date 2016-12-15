import { IXAttribute } from './interfaces';
import XObject from './xobject';
import { XName, XNameClass } from './xname';
import { Converter, Maybe } from './converter';
import { escape } from './xobject';

export class XAttribute extends XObject implements IXAttribute {

	readonly name: XNameClass;
	readonly to: Converter;
	readonly nodeType: 'attribute';
	value: string;

	constructor(other: IXAttribute);
	constructor(name: XName, value: any);
	constructor(nameOrOther: XName | IXAttribute, value?: any) {
		if ((typeof nameOrOther !== 'object') || (nameOrOther instanceof XNameClass)) {
			super();
			this.name = XNameClass.get(nameOrOther);
			this.value = value;
		}
		else {
			super(nameOrOther);
			this.name = XNameClass.get(nameOrOther.name);
			this.value = nameOrOther.value;
		}

		this.nodeType = 'attribute';
		this.to = new Converter(() => this.value);
	}

	get isNamespaceDeclaration(): boolean {
		return this.name.localName.startsWith('xmlns');
	}

	get nextAttribute(): Maybe<XAttribute> {

	}

	get previousAttribute(): Maybe<XAttribute> {

	}

	remove(): void {

	}

	setValue(value: any): void {
		this.value = Converter.fromValue(value);
	}

	toString(): string {
		return escape`${this.name}=${this.value}`;
	}
}

export default XAttribute;