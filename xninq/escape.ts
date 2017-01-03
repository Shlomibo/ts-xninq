import _ from 'ts-ninq';

export type Escaper = (val: any) => string;
export type EscapeFunc = (strings: TemplateStringsArray, ...values: any[]) => string;

export function createEscape(escaper: Escaper): EscapeFunc {
	if (typeof escaper !== 'function') {
		throw new TypeError('escaper');
	}
	return function escape(strings: TemplateStringsArray, ...values: any[]) {
		const escapedValues = _.of(values)
			.map(escaper);

		return _.of(strings)
			.zip(escapedValues)
			.flatMap(
			pair => pair,
			str => str
			)
			.concat([_.last(strings)])
			.stringify('');
	};
}