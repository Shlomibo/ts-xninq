import { isIterable, isArrayLike } from 'ts-ninq';
import { isXNode, NodeType } from './interfaces';
import { XText } from './xtext';
import { Converter, Maybe } from './converter';
import { XElement } from './xelement';
import XObjectList from './xobject-list';
import XNode from './xnode';

export class NodeList extends XObjectList<XNode> {
	private _elementsMap: Maybe<Map<number, XElement>>;

	constructor(nodes?: Iterable<XNode>) {
		super();
		if (nodes) {
			this.push(nodes);
		}
		else {
			this._elementsMap = new Map();
		}
	}

	get elements() {
		if (!this._elementsMap) {
			this._elementsMap = this.map((node, index) => ({ node, index }))
				.filter(({node}) => node.nodeType === 'element')
				.toMap(
					({index}) => index,
					({node}) => node as XElement,
				);
		}
		return this._elementsMap;
	}

	clear(): void {
		super.clear();
		this._elementsMap = undefined;
	}

	insert(after: number | XNode, objects: XNode | Iterable<XNode>) {
		super.insert(after, objects);
		this._elementsMap = undefined;
	}

	remove(from: number | XNode): XNode;
	remove(from: number | XNode, count: number): XNode[];
	remove(from: number | XNode, count?: number): XNode | XNode[] {
		const result: any = super.remove(from as any, count as any);
		this._elementsMap = undefined;
		return result;
	}

	static fromValue(value: any): XNode {
		if (value instanceof XNode) {
			return value;
		}
		else if (isXNode(value)) {
			return XNode.from(value);
		}
		else {
			return new XText(Converter.fromValue(value));
		}
	}
}

export interface NodeContainer {
	_nodes: NodeList;
	validNodeTypes: NodeType[];

	convertContent(content: Iterable<any>): Iterable<XNode>;
}

export function isNodesContainer(obj: any): obj is NodeContainer {
	return obj && obj._nodes instanceof NodeList;
}

export default NodeList;
export {
	isIterable,
	isArrayLike,
};