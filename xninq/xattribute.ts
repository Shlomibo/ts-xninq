import { IXAttribute } from './interfaces';
import XObject from './xobject';
import { XName, XNameClass } from './xname';
import { Converter, Maybe } from './converter';
import { escape } from './xobject';
import { isAttributesContainer } from './attributes-lists';

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
		let result;
		if (isAttributesContainer(this.parent)) {
			result = this.parent._attriubtes.after(this)
				.firstOrDefault(undefined);
		}
		return result;
	}

	get previousAttribute(): Maybe<XAttribute> {
		let result;
		if (isAttributesContainer(this.parent)) {
			result = this.parent._attriubtes.before(this)
				.firstOrDefault(undefined);
		}
		return result;
	}

	clone(): XAttribute {
		return new XAttribute(this);
	}

	remove(): void {
		if (isAttributesContainer(this.parent)) {
			this.parent._attriubtes.remove(this);
			this._setParent();
		}
	}

	setValue(value: any): void {
		this.value = Converter.fromValue(value);
	}

	toString(): string {
		return escape`${this.name}=${this.value}`;
	}

	static from(attribute: IXAttribute): XAttribute {
		if (!(attribute instanceof XAttribute) || attribute.parent) {
			return new XAttribute(attribute);
		}
		return attribute;
	}
}

export default XAttribute;