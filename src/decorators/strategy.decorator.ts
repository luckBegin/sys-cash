export function  Strategy( map: any ) {
	return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		const raw = descriptor.value;
		target._strategy = map ;
		descriptor.value = function (...args) {
			const index = raw.apply(this, args);
			if( this._strategy[index] )
				target._strategy[index].apply(this , args ) ;
			else
				throw new Error(`strategy method  < ${ index } > not exist in this component`)
		};
	};
}
