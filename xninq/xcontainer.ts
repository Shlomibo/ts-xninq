import { IXContainer, IXNode, IXElement, isXContainer, NodeType, SaveOptions } from './interfaces';
import NodeList from './nodes-list';
import { isNodesContainer } from './nodes-list';
import _ from 'ts-ninq';
import { XName, XNameClass } from './xname';
import { Maybe, Converter } from './converter';
import XNode from './xnode';
import XObject from './xobject';

export abstract class XContainer extends XNode implements IXContainer {
	protected _nodes: NodeList;

	constructor(other?: IXContainer) {
		super(other);
		let content;
		if (isNodesContainer(other)) {
			content = other._nodes;
		}
		this._nodes = new NodeList(content);
	}

	add(...content: any[]): void {
		this._nodes.push(
			_.of(content)
				.map(Converter.from)
				.filter(_.identity)
				.cast<XNode>()
		);
	}
	addFirst(...content: any[]): void {
		this._nodes.unshift(
			_.of(content)
				.map(Converter.from)
				.filter(_.identity)
				.cast<XNode>()
		);
	}
	descendantNodes(): _<IXNode> {
		return this._nodes
			.flatMap(
			node => isXContainer(node)
				? _.concat([node], node.descendantNodes())
				: [node],
			node => node
			);
	}

	descendant(name?: XName): _<IXElement> {
		return this.elements()
			.flatMap(
			element => _.concat([element], element.descendant()),
			element => element
			);

	}
	element(name: XName): Maybe<IXElement> {
		return this.elements(name)
			.firstOrDefault();
	}
	elements(name?: XName): _<IXElement> {
		let result = _.of(this._nodes.elements.values());
		if (name) {
			result = result
				.filter(element => !name || (element.name as XNameClass).equals(name));
		}
		return result;
	}

	nodes(): _<IXNode> {
		return new _(this._nodes);
	}

	removeNodes(): void {
		this._nodes.clear();
	}

	replaceNodes(content: any, ...contents: any[]): void {
		const newNodes = [...this.convertContent(
			_.concat([content], contents)
		)];
		this._nodes.clear();
		this._nodes.push(newNodes);
	}

	protected convertContent(content: Iterable<any>): Iterable<XNode> {
		return _.of(content)
			.map(Converter.from)
			.filter(node => this.validateNode(node))
			.cast<XNode>();
	}

	protected validateNode(node?: XObject): boolean {
		if (node && !this.validNodeTypes.includes(node.nodeType)) {
			throw new TypeError('Invalid node type: ' + node.nodeType);
		}
		return !!node;
	}

	protected abstract get validNodeTypes(): NodeType[];
	abstract clone(): XContainer;

	protected abstract _toString(saveOtions: SaveOptions, indentation: number): string;
}

export default XContainer;
