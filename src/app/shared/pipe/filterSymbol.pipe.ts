import { Pipe , PipeTransform } from '@angular/core';

@Pipe({
	name: 'filterSymbol' ,
	pure: true
})
export class FilterSymbolPipe implements PipeTransform {
	transform( value: string , symbol: string = ';'): any {
		return value.replace(symbol , '') ;
	}
}
