import { XContainer } from './xcontainer';
import { IXElement, IXNode, IXAttribute, SaveOptions, NodeType, isXTextOrCData, isXElement, isXAttribute, isXText } from './interfaces';
import { XName, isXName, XNamespaceClass, XNamespace, XNameClass } from './xname';
import _ from 'ts-ninq';
import { TraverseMapping } from 'ts-ninq';
import { Maybe, Converter, ObjectConvertableConverter } from './converter';
import { Writable as Stream } from 'stream';
import AttributesList from './attributes-lists';
import XAttribute from './xattribute';
import { createWriteStream } from 'fs';
import { NotNull } from 'ts-ninq';
import { escape } from './xobject';
import XNode from './xnode';
import toObject from './json';

export class XElement extends XContainer implements IXElement {

	private _attriubtes: AttributesList;
	name: XNameClass;
	readonly to: ObjectConvertableConverter;
	readonly nodeType: 'element';
	protected readonly validNodeTypes: NodeType[];

	constructor(name: XName, ...content: any[]);
	constructor(other: IXElement);
	constructor(nameOrOther: XName | IXElement, ...content: any[]) {
		if (isXName(nameOrOther)) {
			super();
			this.name = XNameClass.get(nameOrOther);
			this.add(content);
		}
		else {
			super(nameOrOther);
			this.name = XNameClass.get(nameOrOther.name);
		}

		this._attriubtes = new AttributesList(
			this,
			this.document as any,
		);
		this.to = new ObjectConvertableConverter(
			() => this.value,
			(parser?, builder?) => toObject(this, parser, builder),
		);
		this.nodeType = 'element';
		this.validNodeTypes = [
			'attribute',
			'text',
			'cdata',
			'comment',
			'element',
		];
	}

	get value(): string {
		return this._nodes
			.filter(node => isXTextOrCData(node))
			.map(node => node.toString())
			.stringify('\n');
	}
	set value(val: string) {
		const replacedNodes = this._nodes
			.filter(node => isXTextOrCData(node));
		if (val) {
			if (replacedNodes.some()) {
				replacedNodes.first().addAfterSelf(val);
			}
			else {
				this.add(val);
			}
		}
		replacedNodes.forEach(node => node.remove());
	}

	get hasAttributes(): boolean {
		return this._attriubtes.some();
	}

	get hasElements(): boolean {
		return this._nodes.some(node => isXElement(node));
	}

	get isEmpty(): boolean {
		return !this.hasAttributes && !this.hasElements;
	}

	add(...content: any[]): void {
		const [
			attributes,
			nodes,
		] = _.of(content)
			.split(node => isXAttribute(node));

		super.add(...nodes);
		this._attriubtes.push(
			attributes.map(attr => this.getXAttrInstance(attr))
		);
	}

	addFirst(...content: any[]): void {
		const [
			attributes,
			nodes,
		] = _.of(content)
			.split(node => isXAttribute(node));

		super.add(...nodes);
		this._attriubtes.unshift(
			attributes.map(attr => this.getXAttrInstance(attr))
		);
	}

	replaceNodes(content: any, ...contents: any[]): void {
		const [
			attributes,
			nodes,
		] = _.of<any>(content)
			.split(node => isXAttribute(node));

		super.replaceNodes(nodes.first(), ...nodes.skip(1));
		this._attriubtes.push(
			attributes.map(attr => this.getXAttrInstance(attr))
		);
	}

	ancestorsAndSelf(name?: XName): _<IXElement> {
		return !this.name.equals(name)
			? this.ancestors(name)
			: this.ancestors(name)
				.concatTo([this]);
	}

	attribute(name: XName): Maybe<IXAttribute> {
		return this.attributes(name)
			.firstOrDefault();
	}

	attributes(name?: XName): _<IXAttribute> {
		return this._attriubtes
			.filter(attr => attr.name.equals(name));
	}

	descendantNodesAndSelf(): _<IXNode> {
		return super.descendantNodes()
			.concatTo([this]);
	}

	descendantsAndSelf(name?: XName): _<IXElement> {
		return !this.name.equals(name)
			? this.descendant(name)
			: this.descendant(name)
				.concatTo([this]);
	}

	getNamespaceOfPrefix(prefix: string): XNamespaceClass {
		return XNamespaceClass.get(
			this.ancestorsAndSelf()
				.flatMap(
				element => element.attributes(),
				attr => attr
				)
				.filter(attrFilter)
				.map(attr => attr.value)
				.first()
		);

		function attrFilter(attr: XAttribute) {
			const nameToLookFor = prefix
				? 'xmlns:' + prefix
				: 'xmlns';
			return attr.name.equals(nameToLookFor);
		}
	}
	getPrefixOfNamespace(namespace: XNamespace): string {
		const namespaceName = typeof namespace === 'string'
			? namespace
			: namespace.namespaceName;

		return this.ancestorsAndSelf()
			.flatMap(
			element => element.attributes(),
			attr => attr
			)
			.filter(attr =>
				attr.name.localName === 'xmlns' ||
				attr.name.localName.startsWith('xmlns:')
			)
			.filter(attr => attr.value === namespaceName)
			.map(attr => attr.name.localName.includes(':')
				? attr.name.localName.split(':')[1]
				: ''
			)
			.first();
	}

	removeAll(): void {
		this.removeNodes();
		this.removeAttributes();
	}

	removeAttributes(): void {
		this._attriubtes.clear();
	}

	replaceAll(content: any, ...contents: any[]): void {
		const {
			attributes,
			nodes,
		} = this.getValidatedContentAndAttributes(
			_.of([content])
				.concat(contents)
		);
		this._attriubtes.clear();
		this._attriubtes.push(attributes);
		this._nodes.clear();
		this._nodes.push(nodes);
	}

	replaceAttributes(content: any, ...contents: any[]): void {
		const {
			attributes,
			nodes,
		} = this.getValidatedContentAndAttributes(
			_.of([content])
				.concat(contents)
		);
		this._attriubtes.clear();
		this._attriubtes.push(attributes);
		this._nodes.push(nodes);
	}
	save(to: string | Stream, saveOptions: SaveOptions): Promise<void> {
		if (typeof to === 'string') {
			to = createWriteStream(to);
		}
		const callbackHandler = _.fromCallback<void>(),
			writeAwaiter = Promise.resolve(callbackHandler);
		to.on('error', err => callbackHandler(err));
		to.end(this.toString(saveOptions), callbackHandler);
		return writeAwaiter;
	}

	setAttributeValue(name: XName, value: any): void {
		const attribute = this.attribute(name);

		if (attribute) {
			if (value == null) {
				attribute.remove();
			}
			else {
				attribute.value = Converter.fromValue(value);
			}
		}
		else if (value != null) {
			this._attriubtes.push(
				new XAttribute(name, value)
			);
		}
	}

	setElementValue(name: XName, value: any): void {
		const element = this.element(name);

		if (element) {
			if (value == null) {
				element.remove();
			}
			else {
				element.value = Converter.fromValue(value);
			}
		}
		else if (value != null) {
			this._attriubtes.push(
				new XAttribute(name, value)
			);
		}
	}

	setValue(value: NotNull): void {
		this.value = Converter.fromValue(value);
	}

	toString(saveOptions?: SaveOptions): string {
		return this._toString(saveOptions);
	}

	protected _toString(saveOptions = SaveOptions.none, indentation = 0): string {
		const result: string[] = [];
		const prefix = this.getPrefixOfNamespace(this.name.$namespace),
			tagName = prefix
				? `${ prefix }:${ this.name.localName }`
				: this.name.localName,
			tagOpenning = escape`<${ tagName }`,
			tagClosing = this._nodes.some()
				? '>'
				: ' />',
			openTag = this.hasAttributes
				? `${ tagOpenning } ${ this.attributes().stringify(' ') }${ tagClosing }`
				: `${ tagOpenning }${ tagClosing }`;

		result.push(openTag);

		if (this._nodes.some()) {
			result.push(
				...this._nodes
					.traverse()
					.flatMap(({current, previous}: TraverseMapping<XNode>) =>
						isXText(previous) && isXText(current)
							? ['\n', current.toString()]
							: [
								(current instanceof XElement)
									? current._toString(saveOptions, indentation + 1)
									: current.toString(saveOptions)
							],
					val => val
					)
			);
			result.push(escape`</${ tagName }>`);
		}
		const separator = (saveOptions & SaveOptions.disableFormatting) === SaveOptions.disableFormatting
			? ''
			: '\n' + _.repeat('\t', indentation).stringify('');
		return separator + result.join(separator);
	}

	clone(): XElement {
		return new XElement(this);
	}

	private getXAttrInstance(attr: IXAttribute): XAttribute {
		return (attr instanceof XAttribute) && (!attr.parent || attr.parent === this)
			? attr
			: new XAttribute(attr);
	}

	private getValidatedContentAndAttributes(content: Iterable<any>) {
		const [
			attributes,
			filteredContent,
		] = _.split(content, node => isXAttribute(node));
		const nodes = [
			...this.convertContent(filteredContent)
		];
		return {
			attributes,
			nodes,
		};
	}
}

export default XElement;
