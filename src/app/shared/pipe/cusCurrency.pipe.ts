import { Pipe , PipeTransform } from '@angular/core';

@Pipe({
	name: 'cusCurrency' ,
	pure: true
})
export class CusCurrencyPipe implements PipeTransform {
	transform( value: number | string ): any {
		return value ? '¥ ' + value : '¥ ' + '0' ;
	}
}
