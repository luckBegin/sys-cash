import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http' ;
import {API} from '../API';
import {GET, POST, PUT} from '../../../decorators' ;
import {MsgService} from '../msg/msg.service' ;
import {Observable} from 'rxjs';
import {RESPONSE} from '../../models';

@Injectable({
	providedIn: 'root'
})
export class VipService {
	constructor(
		private http: HttpClient,
		private msg: MsgService
	) {
	}
	
	@GET(API.vip.info)
	vipInfo(para?: any): Observable<RESPONSE> | any {
	
	}
	
	@GET(API.vip.type)
	vipType(para?: any): Observable<RESPONSE> | any {
	}
	
	@POST(API.vip.info)
	create(data?: any): Observable<RESPONSE> | any {
	}
	
	@PUT(API.vip.info)
	update(data?: any): Observable<RESPONSE> | any {
	}
	
	@POST(API.vip.info + '/freeze')
	freeze(data?: any): Observable<RESPONSE> | any {
	}
	
	@POST(API.vip.info + '/recover')
	recover(data?: any): Observable<RESPONSE> | any {
	}
	
	@POST(API.vip.bindCard)
	bindCard(data?: any): Observable<RESPONSE> | any {
	}
	
	@GET( API.vip.integral)
	integral( para?: any): Observable< RESPONSE > | any {
	}
}
