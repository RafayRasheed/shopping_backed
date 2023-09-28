const commonError = 'Something Wrong'
function commonJson(code, message, body) {
    const json = { code, message, body }
    return json
}
function adjustSting(string, size) {
    const len = string.length
    let myStr = ''
    for (let i = 0; i < size - len; i++) {
        myStr += '0'
    }
    return (myStr + string)

}
function getDateAndTime(date) {
    const yearC = adjustSting(date.getFullYear().toString(), 2)
    const monthC = adjustSting(date.getMonth().toString(), 2)
    const dayC = adjustSting(date.getDate().toString(), 2)

    const dateSum = dayC + '-' + monthC + '-' + yearC
    const time = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).toString()

    const dateData = {
        date: dateSum,
        time,
        lastUpdate: dateSum + ' ' + time
    }
    return dateData
}


function getDateInt(date) {

    const year = adjustSting(date.getUTCFullYear().toString(), 2)
    const month = adjustSting(date.getUTCMonth().toString(), 2)
    const day = adjustSting(date.getUTCDate().toString(), 2)
    const hours = adjustSting(date.getUTCHours().toString(), 2)
    const minutes = adjustSting(date.getUTCMinutes().toString(), 2)
    const seconds = adjustSting(date.getUTCSeconds().toString(), 2)
    const mili = adjustSting(date.getUTCMilliseconds().toString(), 3)
    const code = year + month + day + hours + minutes + seconds + mili

    return parseInt(code)


}

exports.commonError = commonError;
exports.commonJson = commonJson;
exports.getDateInt = getDateInt;
exports.getDateAndTime = getDateAndTime;
