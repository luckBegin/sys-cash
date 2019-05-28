import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http' ;
import {API} from '../API';
import {GET, POST} from '../../../decorators' ;
import { MsgService } from '../msg/msg.service' ;

@Injectable({
	providedIn: 'root'
})
export class WeChatService {
	constructor(
		private http: HttpClient ,
		private msg: MsgService
	) {
	}
	
	@GET(API.weChat.qrCode)
	getQrCode(): any{} ;
}
