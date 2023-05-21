class HTMLError extends Error {
    constructor(message, errorCode){
        super(message)
        this.code= errorCode
    }
}
module.exports = HTMLError;