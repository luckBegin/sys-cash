import {Injectable} from '@angular/core' ;
import {HttpClient} from '@angular/common/http' ;
import {MsgService} from '../msg/msg.service' ;
import {GET} from '../../../decorators' ;
import {API} from '../API' ;
import {ENUM} from '../../models' ;

@Injectable({providedIn: 'root'})
export class CalcService {
	constructor(
		private readonly http: HttpClient,
		private readonly msg: MsgService
	) {};
	
	@GET(API.calc.timePrice)
	timePrice( para: any ): any {}
	
	@GET(API.calc.outrightPrice , '计算金额失败 , 原因:')
	outrightPrice( para: any): any {} 
}
