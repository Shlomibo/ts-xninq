import XObjectList from './xobject-list';
import XAttribute from './xattribute';
import { isIterable } from 'ts-ninq';
import _ from 'ts-ninq';

export class AttributesList extends XObjectList<XAttribute> {
	insert(after: number | XAttribute, attributes: XAttribute | Iterable<XAttribute>): void {
		const attrNames = new Set<string>(this.map(attr => attr.name.toString()));
		let duplicates;
		if (!isIterable(attributes)) {
			if (attrNames.has(attributes.name.toString())) {
				duplicates = [attributes];
			}
		}
		else {
			duplicates = _.filter(
				attributes,
				attr => {
					const result = !attrNames.has(attr.name.toString());
					attrNames.add(attr.name.toString());
					return result;
				}
			);
		}
		duplicates = duplicates && _.of(duplicates);

		if (duplicates && duplicates.some()) {
			throw new Error(`Duplicate attributes: [${
				duplicates.map(attr => attr.name)
					.stringify(',')
				}]`);
		}

		super.insert(after, attributes);
	}
}

export default AttributesList;

export interface AttributesContainer {
	_attriubtes: AttributesList;
}

export function isAttributesContainer(obj: any): obj is AttributesContainer {
	return obj && (obj._attributes instanceof AttributesList);
}