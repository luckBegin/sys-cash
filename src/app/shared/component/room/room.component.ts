import {Component, Input} from '@angular/core' ;
import {CONFIG} from "../../../CONFIG";
import {DateUtils} from "../../utils";

@Component({
	selector: 'common-room' ,
	templateUrl: './room.component.html' ,
	styleUrls : ['./room.component.less']
})
export class RoomComponent {
	@Input() roomInfo: any = {} ;
	@Input() timeStamp: number ;
	
	showNotify( startTime: string , endTime: string ): boolean{
		if ( startTime && endTime ) {
			const notifyTimeDiff = CONFIG.notifyTimeDiff ;
			const timeDiff = DateUtils.timeDiff( startTime , endTime ) ;
			return timeDiff.m > notifyTimeDiff ;
		}
		return false ;
	}
}
