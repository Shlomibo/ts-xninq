import { XNode } from './xnode';
import { isIterable, isArrayLike } from 'ts-ninq';
import { IXNode } from './interfaces';
import { XText } from './xtext';
import { Converter, Maybe } from './converter';
import { XElement } from './xelement';
import XObjectList from './xobject-list';

export class NodeList extends XObjectList<XNode, IXNode> {
	private _elementsMap: Maybe<Map<number, XElement>>;

	constructor(nodes?: Iterable<IXNode>) {
		super();
		this._elementsMap = new Map();

		if (nodes) {
			this.push(nodes);
		}
	}

	private get _elements() {
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

	insert(after: number | XNode, objects: IXNode | Iterable<IXNode>) {
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
		if (XNode.isNode(value)) {
			return XNode.from(value);
		}
		else {
			return new XText(Converter.fromValue(value));
		}
	}
}

export interface NodeContainer {
	_nodes: NodeList;
}

export function isNodesContainer(obj: any): obj is NodeContainer {
	return obj && obj._nodes instanceof NodeList;
}

export default NodeList;
export {
	isIterable,
	isArrayLike,
};