import {Injectable, OnInit} from '@angular/core';
import {API} from '../API';
import {interval, Subject} from 'rxjs';

export interface WsEvent {
	event: string;
	data: any;
}

@Injectable({providedIn: 'root'})
export class WebsocketService {
	private ws!: WebSocket;
	private state: { state: boolean , msg: string } ;
	public readonly WSEvent$: Subject<WsEvent> = new Subject();
	constructor(
	) {
		try {
			this.ws = new WebSocket(API.WSUrl);
		} catch (e) {
			this.state = {
				state: false ,
				msg: '客户端未启动'
			};
			this.notify('state' , this.state ) ;
		}
		
		this.ws.onopen = () => {
			this.state = {
				state: true ,
				msg: '连接成功'
			};
			this.notify('state' , this.state ) ;
			this.heartBeat();
		};
		
		this.ws.onerror = (e) => {
			this.state =  {
				state: false ,
				msg: '连接异常'
			};
			this.notify('state' , this.state ) ;
		};
		
		this.ws.onclose = ( e ) => {
			this.state = {
				state: false ,
				msg: '客户端断开连接'
			} ;
			this.notify('state' , this.state ) ;
		};
		
		this.ws.onmessage = ( event: MessageEvent ) => {
			const msg = event.data ;
			try {
				const objMsg = JSON.parse( msg ) ;
				if ( objMsg.event !== 'heartBeat') {
					this.notify( objMsg.event , objMsg.data ) ;
				}
			} catch (e) {
				console.log( e ) ;
			}
		};
	}
	
	public getState(): { state: boolean , msg: string } {
		return this.state ;
	}
	
	private notify(event: string , data: any ): void {
		this.WSEvent$.next( { event , data }) ;
	}
	
	public sendMsg( event: string , data: any ): void {
		this.ws.send( JSON.stringify( { event , data })) ;
	}
	// 300000
	private heartBeat(): void {
		interval( 300000 )
			.subscribe( () => {
				this.sendMsg('heartBeat' , '') ;
			});
	}
}
