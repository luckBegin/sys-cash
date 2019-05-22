import {Injectable} from '@angular/core' ;
import {HttpClient} from '@angular/common/http' ;
import {MsgService} from '../msg/msg.service' ;
import {GET} from '../../../decorators' ;
import {API} from '../API' ;

@Injectable({providedIn: 'root'})
export class UtilsService {
	constructor(
		private readonly http: HttpClient,
		private readonly msg: MsgService
	) {};
	
	@GET(API.utils.currentDate)
	getCurrentDate( ): any{} ;
}
