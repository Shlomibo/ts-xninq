const NONE_URI = '',
	XML_URI = 'http://www.w3.org/XML/1998/namespace',
	XMLNS_URI = 'http://www.w3.org/2000/xmlns/';

export class XNamespaceClass {
	private constructor(
		readonly namespaceName: string
	) { }

	toString() {
		return this.namespaceName;
	}

	valueOf(): string {
		return this.namespaceName;
	}

	getName(name: string): XNameClass {
		return XNameClass.get(this, name);
	}

	equals(other: any): boolean {
		if (typeof other === 'string') {
			return this.namespaceName === other;
		}
		else {
			return (other instanceof XNamespaceClass) &&
				(this.namespaceName === other.namespaceName);
		}
	}

	static get(namespaceName: XNamespace) {
		if ((typeof namespaceName !== 'string') &&
			!(namespaceName instanceof XNamespaceClass)) {

			throw new TypeError('namespaceName');
		}
		if (namespaceName instanceof XNamespaceClass) {
			namespaceName = namespaceName.namespaceName;
		}
		return new XNamespaceClass(namespaceName);
	}

	static get none(): XNamespaceClass {
		return new XNamespaceClass(NONE_URI);
	}

	static get xml(): XNamespaceClass {
		return new XNamespaceClass(XML_URI);
	}

	static get xmlns(): XNamespaceClass {
		return new XNamespaceClass(XMLNS_URI);
	}
}

export class XNameClass {
	private constructor(
		readonly $namespace: XNamespaceClass,
		readonly localName: string,
	) { }

	get namespaceName(): string {
		return this.$namespace.namespaceName;
	}

	equals(other: any): boolean {
		if (typeof other === 'string') {
			return other === this.toString();
		}
		else {
			return (other instanceof XNameClass) &&
				(this.localName === other.localName) &&
				(this.$namespace.equals(other.$namespace));
		}
	}
	static equals(left: XName, right: any) {
		return XNameClass.get(left)
			.equals(right);
	}

	valueOf(): string {
		return this.localName;
	}

	toString() {
		return `${this.$namespace}${this.localName}`;
	}

	static get(name: XName): XNameClass;
	static get(namespaceName: XNamespace, name: XName): XNameClass;
	static get(nameOrNamespace: XName | XNamespace, name?: XName): XNameClass {
		let $namespace;
		if (arguments.length === 1) {
			$namespace = XNamespaceClass.none;
			name = nameOrNamespace as string | XNameClass;
		}
		else {
			$namespace = nameOrNamespace as string | XNamespaceClass;
			name = name!;
		}
		validate($namespace, XNamespaceClass, 'namespaceName');
		validate(name, XNameClass, 'name');

		if (typeof $namespace === 'string') {
			$namespace = XNamespaceClass.get($namespace);
		}
		if (typeof name !== 'string') {
			$namespace = name.$namespace;
			name = name.localName;
		}
		return new XNameClass($namespace, name);

		function validate(arg: any, cls: typeof XNameClass | typeof XNamespaceClass, name: string) {
			if ((typeof arg !== 'string') &&
				!(arg instanceof cls)) {
				throw new TypeError(name);
			}
		}
	}
}

export type XName = string | XNameClass;
export type XNamespace = string | XNamespaceClass;

export function isXName(value: any): value is XName {
	return typeof value === 'string' ||
		value instanceof XNameClass;
}