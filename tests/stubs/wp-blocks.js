export const registered = [];

export function registerBlockType( name, settings ) {
	registered.push( { name, settings } );
	return settings;
}
