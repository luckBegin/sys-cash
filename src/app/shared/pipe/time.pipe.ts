import { Pipe , PipeTransform } from '@angular/core';
import { RegUtils } from '../utils' ;
@Pipe({
	name: 'timePie' ,
	pure: true
})
export class TimePipe implements PipeTransform {
	transform( value: number | string , length: number = 3 , symbol: string = ',' ): any {
		return RegUtils.delimiter( value , length , symbol ) ;
	}
}
