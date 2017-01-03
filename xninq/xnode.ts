import XObject from './xobject';
import { IXNode, IXElement, SaveOptions, XNodeTypes } from './interfaces';
import _ from 'ts-ninq';
import { XName } from './xname';
import { isNodesContainer } from './nodes-list';
import NodeList from './nodes-list';
import { Converter } from './converter';
import { isValidParent } from './xobject';
import XAttribute from './xattribute';

const nodeTypes: XNodeTypes[] = [
	'cdata',
	'comment',
	'document',
	'documentType',
	'element',
];

export abstract class XNode extends XObject implements IXNode {
	constructor(other?: IXNode) {
		super(other);
	}

	addAfterSelf(...content: any[]): void {
		if (!isNodesContainer(this.parent)) {
			throw new Error('No parent to add nodes into');
		}
		this.parent._nodes.insert(this, _.map(content, value =>
			<IXNode>NodeList.fromValue(value)
		));
	}

	addBeforeSelf(...content: any[]): void {
		if (!isNodesContainer(this.parent)) {
			throw new Error('No parent to add nodes into');
		}
		this.parent._nodes.insertBefore(this, _.map(content, value =>
			<IXNode>NodeList.fromValue(value)
		));
	}
	ancestors(): _<IXNode> {
		const that = this;
		return new _(ancGenerator());

		function* ancGenerator() {
			if (that.parent) {
				yield that.parent;
				yield* that.parent.ancestors();
			}
		}
	}

	elementsAfterSelf(name?: XName): _<IXElement> {
		if (!isNodesContainer(this.parent)) {
			throw new Error('No parent to add nodes into');
		}
		return this.parent._nodes.after(this)
			.filter(node => node.nodeType === 'element')
			.cast<IXElement>();
	}

	elementsBeforeSelf(name?: XName): _<IXElement> {
		if (!isNodesContainer(this.parent)) {
			throw new Error('No parent to add nodes into');
		}
		return this.parent._nodes.before(this)
			.filter(node => node.nodeType === 'element')
			.cast<IXElement>();
	}

	isAfter(node: IXNode): boolean {
		let result = false;
		if (isNodesContainer(this.parent) && (node instanceof XNode)) {
			result = this.parent._nodes
				.before(this)
				.includes(node);
		}

		return result;
	}

	isBefore(node: IXNode): boolean {
		let result = false;
		if (isNodesContainer(this.parent) && (node instanceof XNode)) {
			result = this.parent._nodes
				.after(this)
				.includes(node);
		}

		return result;
	}

	nodesAfterSelf(): _<XNode> {
		return _.of(
			!isNodesContainer(this.parent)
				? _.empty<XNode>()
				: this.parent._nodes.after(this)
		);
	}

	nodesBeforeSelf(): _<XNode> {
		return _.of(
			!isNodesContainer(this.parent)
				? _.empty<XNode>()
				: this.parent._nodes.before(this)
		);
	}

	remove(): void {
		if (isNodesContainer(this.parent)) {
			this.parent._nodes.remove(this);
			this._setParent();
		}
	}

	replaceWith(content: any, ...contents: any[]): void {
		if (isValidParent(this.parent)) {
			this.parent._attriubtes.push(contents.filter(content => content instanceof XAttribute));
			this.parent._nodes.insert(
				this,
				_.of(contents)
					.map(Converter.from)
					.filter(obj => obj instanceof XNode)
					.cast<IXNode>()
			);
		}
	}
	abstract toString(saveOptions?: SaveOptions): string;
	abstract clone(): XNode;

	static from(node: IXNode): XNode {
		if (!(node instanceof XNode) || !!node.parent) {
			node = node.clone();
		}
		return node as XNode;
	}
	static isNode(obj: any): obj is IXNode {
		return obj && nodeTypes.includes(obj.nodeType);
	}
}