import {Injectable} from '@angular/core' ;
import {HttpClient} from '@angular/common/http' ;
import {MsgService} from '../msg/msg.service' ;
import {GET, POST} from '../../../decorators' ;
import {API} from '../API' ;
import {ENUM, RESPONSE} from '../../models';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class RoomService {
	constructor(
		private readonly http: HttpClient,
		private readonly msg: MsgService
	) {
	}
	
	static ENUM_Status: ENUM[] = [
		{key: '空房', value: 0},
		{key: '预定', value: 1},
		{key: '待客', value: 2},
		{key: '清洁', value: 3},
		{key: '故障', value: 4},
		{key: '线上', value: 5},
		{key: '计时', value: 6},
		{key: '预买', value: 7},
		{key: '买断', value: 8},
	];
	
	@GET(API.room.area)
	getArea(): Observable<RESPONSE> | any {
	}
	
	@GET(API.room.type)
	getType(): Observable<RESPONSE> | any {
	}
	
	@GET(API.room.list)
	getList(): Observable<RESPONSE> | any {
	}
	
	@GET(API.room.time)
	getTime(): Observable<RESPONSE> | any {
	}
	
	@GET(API.room.getPriceByType)
	getPriceByType(query: any): Observable<RESPONSE> | any {
	}
	
	@POST(API.room.openByTime)
	openByTime(data: any): Observable<RESPONSE> | any {
	}
	
	@POST(API.room.openByOutright)
	openByOutright(data: any): Observable<RESPONSE> | any {
	}
	
	@GET(API.room.roomTodayOrder)
	roomTodayOrderList(query: any): Observable<RESPONSE> | any {
	}
	
	@GET(API.room.roomOrderItem)
	roomOrderItemList(query: any): Observable<RESPONSE> | any {
	}
	
	@POST(API.room.checkoutWithTime)
	checkoutWithTime(data: any): Observable<RESPONSE> | any {
	}
	
	@POST(API.room.reset)
	reset(data: any): Observable<RESPONSE> | any {
	}
	
	@POST(API.room.clean)
	clean(data: any): Observable<RESPONSE> | any {
	}
	
	@POST(API.room.openByAdvance)
	openByAdvance(data: any): Observable<RESPONSE> | any {
	}
	
	@POST(API.room.resetAll)
	resetAll(data ?: any): Observable<RESPONSE> | any {
	}
	
	@GET(API.room.getAllVipOrders)
	getAllVipOrders(para?: { vipId: number }): Observable<RESPONSE> | any {
	}
}
