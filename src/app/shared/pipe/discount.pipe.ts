import {Pipe, PipeTransform} from '@angular/core';
import {RoomService} from '../../service' ;

@Pipe({
	name: 'discount',
	pure: true
})
export class DiscountPipe implements PipeTransform {
	transform(value: number | string): any {
		if (Number(value) === 100) {
			return '不打折';
		} else {
			return Number(value) / 10 + '折' ;
		}
	}
}
