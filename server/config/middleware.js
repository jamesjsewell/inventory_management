const errorHandler = function(err, req, res, next) {
    console.log(err)
    res.render(err)
    return
}

const parseQuery = function(req, res, next) {
    if (req.query) {
        for (var prop in req.query) {
            if (req.query[prop][0] === "$") {
                let val = req.query[prop]
                req.query[prop] = new RegExp(req.query[prop].substr(1), "i")
            }
        }
    }

    next()
}

module.exports = {
    errorHandler: errorHandler,
    parseQuery: parseQuery
}
