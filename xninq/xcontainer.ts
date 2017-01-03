import { XNode } from './xnode';
import { IXContainer, IXNode, IXElement } from './interfaces';
import NodeList from './nodes-list';
import { isNodesContainer } from './nodes-list';
import _ from 'ts-ninq';
import { XName } from './xname';
import { Maybe } from './converter';

export abstract class XContainer extends XNode implements IXContainer {
	private _nodes: NodeList;

	constructor(other?: IXContainer) {
		super(other);
		let content;
		if (isNodesContainer(other)) {
			content = other._nodes;
		}
		this._nodes = new NodeList(content);
	}

	abstract add(...content: any[]): void;
	abstract addFirst(...content: any[]): void;
	abstract descendantNodes(): _<IXNode>;
	abstract descendant(name?: XName): _<IXElement>;
	abstract element(name: XName): Maybe<IXElement>;
	abstract elements(name?: XName): _<IXElement>;
	abstract nodes(): _<IXNode>;
	abstract removeNodes(): void;
	abstract replaceNodes(content: any, ...contents: any[]): void;
	abstract clone(): XContainer;
}

export default XContainer;
