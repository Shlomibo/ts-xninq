import XDocument from './xdocument';
import { XName } from './xname';
import { Hash } from 'ts-ninq/types';
import { isXTextOrCData, IXAttribute, IXText } from './interfaces';
import _ from 'ts-ninq';
import XElement from './xelement';
import XComment from './xcomment';

export interface Parser<TAttr, TText> {
	attribute(this: void, attr: IXAttribute): TAttr;
	text(this: void, xtext: IXText): TText;
}

export interface Builder<TDoc, TElement, TAttr, TText> {
	handleAttribute(this: void, name: XName, value: TAttr, parent: TElement): void;
	handleElement(this: void, name: XName, values: Iterable<TText>, parent: TDoc | TElement | undefined): TElement;
	handleDocument(this: void, doc: XDocument): TDoc | undefined;
	handleComment(this: void, value: string, parent: TDoc | TElement): void;
}

export const Symbols = {
	attributes: ' attributes' as ' attributes',
	value: ' value' as ' value',
};
interface SimpleElementHash extends Hash<SimpleElement | SimpleElement[]> { }
export type SimpleElement = SimpleElementHash & {
	' attributes'?: Hash<string>;
	' value': string;
};
const defaultParsers: Parser<string, string> = {
	attribute: attr => attr.value,
	text: xtext => xtext.value,
};
const defaultBuilders: Builder<SimpleElement, SimpleElement, string, string> = {
	handleDocument: doc => void 0,
	handleElement(name, values, parent) {
		name = name.toString();
		const element: SimpleElement = {
			[Symbols.value]: _.stringify(values, '\n'),
		} as any;
		if (parent) {
			const parentValue = parent[name];
			if (!parentValue) {
				parent[name] = element;
			}
			else if (parentValue instanceof Array) {
				parentValue.push(element);
			}
			else {
				parent[name] = [parentValue, element];
			}
		}
		return element;
	},
	handleAttribute(name, value, parent) {
		const attributes = parent[Symbols.attributes] || {};
		attributes[name.toString()] = value;

		parent[Symbols.attributes] = attributes;
	},
	handleComment: () => void 0,
};

function createElement<TDoc, TElement, TAttr, TText>(
	element: XElement,
	parent: TDoc | TElement | undefined,
	builder: Builder<TDoc, TElement, TAttr, TText>,
	parser: Parser<TAttr, TText>,
) {
	const result = builder.handleElement(
		element.name,
		element.nodes()
			.filter(node => isXTextOrCData(node))
			.map(node => parser.text(node as IXText)),
		parent
	);
	element.attributes()
		.map(attr => [
			attr.name,
			parser.attribute(attr),
			result
		] as [
				XName,
				TAttr,
				TElement
			]
		)
		.forEach(([name, value, parent]) =>
			builder.handleAttribute(name, value, parent)
		);

	element.nodes()
		.filter(node => (node instanceof XComment) || (node instanceof XElement))
		.cast<XComment | XElement>()
		.forEach(elementOrComment => {
			if (elementOrComment instanceof XElement) {
				createElement(elementOrComment, result, builder, parser);
			}
			else {
				builder.handleComment(elementOrComment.value, result);
			}
		});

	return result;
}

export function toObject(xml: XDocument | XElement): SimpleElement;
export function toObject<TAttr, TText>(
	xml: XDocument | XElement,
	parser: Partial<Parser<TAttr, TText>>,
): SimpleElement;
export function toObject<TDoc, TElement, TAttr, TText>(
	xml: XDocument | XElement,
	builder: Partial<Builder<TDoc, TElement, TAttr, TText>>,
): TDoc | TElement;
export function toObject<TDoc, TElement, TAttr, TText>(
	xml: XDocument | XElement,
	parser: Partial<Parser<TAttr, TText>>,
	builder: Partial<Builder<TDoc, TElement, TAttr, TText>>,
): TDoc | TElement;
export function toObject<TDoc, TElement, TAttr, TText>(
	xml: XDocument | XElement,
	parserOrBuilder?: Partial<Parser<TAttr, TText>> | Partial<Builder<TDoc, TElement, TAttr, TText>>,
	maybeBuilder?: Partial<Builder<TDoc, TElement, TAttr, TText>>,
): TDoc | TElement {

	let parser: Parser<TAttr, TText>,
		builder: Builder<TDoc, TElement, TAttr, TText>;
	if (isBuilder(parserOrBuilder)) {
		parser = defaultParsers as any;
		builder = Object.assign({}, defaultBuilders, parserOrBuilder) as any;
	}
	else if (isParser(parserOrBuilder)) {
		parser = Object.assign({}, defaultParsers, parserOrBuilder) as any;
		builder = Object.assign({}, defaultBuilders, maybeBuilder || {}) as any;
	}
	else {
		parser = defaultParsers as any;
		builder = Object.assign({}, defaultBuilders, maybeBuilder || {}) as any;
	}

	let result: TDoc | TElement | undefined;
	if (xml instanceof XDocument) {
		result = builder.handleDocument(xml);
		xml = xml.root;
	}

	const root = createElement(xml, result, builder, parser);
	return result || root;
}

export default toObject;

function isParser<TAttr, TText>(val: any): val is Partial<Parser<TAttr, TText>> {
	const parserKeys = new Set(
		Object.keys(defaultParsers)
	);
	return val && Object.keys(val).some(key => parserKeys.has(key));
}
function isBuilder<TDoc, TElement, TAttr, TText>(val: any):
	val is Partial<Builder<TDoc, TElement, TAttr, TText>> {

	const builderKeys = new Set(
		Object.keys(defaultBuilders)
	);
	return val && Object.keys(val).some(key => builderKeys.has(key));
}
