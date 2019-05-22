import { Pipe , PipeTransform } from '@angular/core';
import {DateUtils, RegUtils} from '../utils' ;
@Pipe({
	name: 'datePie' ,
	pure: true
})
export class DatePipe implements PipeTransform {
	transform( value: number | string , format: string = 'y-m-d h:i:s'): any {
		return DateUtils.format(value , format ) ;
	}
}
