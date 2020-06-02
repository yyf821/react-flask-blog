import moment from 'moment'
import 'moment/locale/zh-cn'


export const dateFormat = date => moment.utc(date).local().format('lll')