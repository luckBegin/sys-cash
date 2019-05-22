import {Injectable} from '@angular/core' ;
import {HttpClient} from '@angular/common/http' ;
import {MsgService} from '../msg/msg.service' ;
import {GET} from '../../../decorators' ;
import {API} from '../API' ;
import {ENUM} from '../../models' ;

@Injectable({providedIn: 'root'})
export class PaymentService {
	constructor(
		private readonly http: HttpClient,
		private readonly msg: MsgService
	) {};
	
	@GET(API.basic.payment)
	getMethod( para: any ): any {}
}
