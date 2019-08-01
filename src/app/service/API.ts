// export const HOST: string = 'http://api.jpgqs.cn';
import {hostReportError} from 'rxjs/internal-compatibility';
export const HOST: string = 'http://localhost:3002';
const system = {
	staff: HOST + '/system/staff',
	changePass: HOST + '/system/staff/changePass',
};

const room = {
	type: HOST + '/room/type/all',
	area: HOST + '/room/area/all',
	list: HOST + '/room/list/all',
	time: HOST + '/room/time/all',
	getPriceByType: HOST + '/room/price/getPriceByType',
	openByTime: HOST + '/room/operate/openByTime',
	openByOutright: HOST + '/room/operate/openByOutright',
	openByAdvance: HOST + '/room/operate/openByAdvance',
	roomTodayOrder: HOST + '/room/order/list',
	roomOrderItem: HOST + '/room/order/itemList',
	checkoutWithTime: HOST + '/room/operate/checkoutWithTime',
	reset: HOST + '/room/operate/reset',
	clean: HOST + '/room/operate/clean',
	resetAll: HOST + '/room/operate/resetAll',
	getAllVipOrders: HOST + '/room/order/all/byVipId'
};

const calc = {
	timePrice: HOST + '/calc/timePrice',
	outrightPrice: HOST + '/calc/outrightPrice'
};
const utils = {
	currentDate: HOST + '/utils/date'
};
const basic = {
	payment: HOST + '/basic/payment/byConditions'
};

const weChat = {
	qrCode: HOST + '/wechat/qrCode'
};

const vip = {
	info: HOST + '/vip/user' ,
	type: HOST + '/vip/type/all' ,
	bindCard: HOST + '/vip/user/bindCard' ,
	integral: HOST + '/vip/user/integral'
};
const WSUrl: string = 'ws://localhost:3333' ;
export const API = {system, room, calc, utils, basic, weChat , vip  , WSUrl };
