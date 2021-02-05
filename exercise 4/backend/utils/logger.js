//central file for logging. make changes here if logging should be outsourced to some other place...

const info = (...params) => {
    if (process.env.NODE_ENV !== 'test') {
        console.log(...params)
    }
}

const error = (...params) => {
    console.error(...params)
}

module.exports = {
    info, error
}