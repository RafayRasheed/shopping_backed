const commonError = 'Something Wrong'
function commonJson(code, message, body) {
    const json = { code, message, body }
    return json
}
exports.commonError = commonError;
exports.commonJson = commonJson;
