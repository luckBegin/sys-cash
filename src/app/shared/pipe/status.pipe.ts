import { Pipe , PipeTransform } from '@angular/core';
import {RoomService} from '../../service' ;

@Pipe({
	name: 'statusPipe' ,
	pure: true
})
export class StatusPipe implements PipeTransform {
	transform( value: number | string ): any {
		const status = RoomService.ENUM_Status.find( item => item.value === value ) ;
		return status.key ;
	}
}
