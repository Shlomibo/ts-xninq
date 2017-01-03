import XObjectList from './xobject-list';
import XAttribute from './xattribute';
import { IXAttribute } from './interfaces';

export class AttributesList extends XObjectList<XAttribute, IXAttribute> {

}

export default AttributesList;

export interface AttributesContainer {
	_attriubtes: AttributesList;
}

export function isAttributesContainer(obj: any): obj is AttributesContainer {
	return obj && (obj._attributes instanceof AttributesList);
}