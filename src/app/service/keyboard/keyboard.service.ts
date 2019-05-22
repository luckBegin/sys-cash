import { Injectable , OnInit , OnDestroy } from '@angular/core' ;
import {fromEvent , Subject} from 'rxjs' ;

@Injectable({ providedIn: 'root'})
export class KeyboardService {
	constructor() {
		this.keyEvent$ = fromEvent(document , 'keydown')
			.subscribe( ( $event: KeyboardEvent ) => {
				this.keyboardEvent$.next( $event.key ) ;
			});
	}
	private keyEvent$: any  ;
	keyboardEvent$: Subject< string > = new Subject() ;
}
