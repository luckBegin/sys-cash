export const HOST: string = 'http://localhost:3002';

const system = {
	staff: HOST + '/system/staff'
};

const room = {
	type: HOST + '/room/type/all' ,
	area: HOST + '/room/area/all' ,
	list: HOST + '/room/list/all' ,
	time: HOST + '/room/time/all' ,
	getPriceByType : HOST + '/room/price/getPriceByType' ,
	openByTime: HOST + '/room/operate/openByTime' ,
	openByOutright: HOST + '/room/operate/openByOutright' ,
	openByAdvance: HOST + '/room/operate/openByAdvance' ,
	roomTodayOrder: HOST + '/room/order/list' ,
	roomOrderItem: HOST + '/room/order/itemList' ,
	checkoutWithTime: HOST + '/room/operate/checkoutWithTime' ,
	reset: HOST + '/room/operate/reset' ,
	clean: HOST + '/room/operate/clean' ,
	resetAll: HOST + '/room/operate/resetAll' ,
};

const calc = {
	timePrice: HOST + '/calc/timePrice' ,
	outrightPrice: HOST + '/calc/outrightPrice'
};
const utils = {
	currentDate: HOST +'/utils/date'
};
const basic = {
	payment: HOST + '/basic/payment/byConditions'
};

export const API = { system  , room , calc , utils , basic};
