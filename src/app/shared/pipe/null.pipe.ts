import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
	name: 'nullPipe',
	pure: true
})
export class NullPipe implements PipeTransform {
	transform(value: string, symbol: string = ';'): any {
		if (value) {
			return value;
		} else {
			return '无';
		}
	}
}
