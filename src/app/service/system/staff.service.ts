import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http' ;
import {API} from '../API';
import {GET, POST} from '../../../decorators' ;
import { MsgService } from '../msg/msg.service' ;

@Injectable({
	providedIn: 'root'
})
export class StaffService {
	constructor(
		private http: HttpClient ,
		private msg: MsgService
	) {
	}

	@POST(API.system.staff + '/login' , true , '登录失败,原因:')
	login(data: any): any {};
	
	qrLogin( data ?: any ): any{
		return this.http.get(API.system.staff + '/login' , {
			params: data
		} )
	} ;
}
