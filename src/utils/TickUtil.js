import moment from 'moment'

/**
 * 根据时间戳 计算 该时间戳 的 文字时间表示
 * @param {number | string} timeStamp 
 * @param {string} fm default milliseconds
 */
export function dateOfTimeStamp(timeStamp, fm = "milliseconds") {
    const day = moment.duration(timeStamp, fm).days()
    const hours = moment.duration(timeStamp, fm).hours()
    const minutes = moment.duration(timeStamp, fm).minutes()

    return `${day > 0 ? day + '天' : ''}${hours > 0 ? hours + '小时' : ''}${minutes > 0 ? minutes + '分钟' : ''}`

}
