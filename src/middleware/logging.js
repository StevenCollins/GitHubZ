var init = async (req, res, next) => {
    // initalize log
    const date = new Date();
    const log = {
        timestamp: date.toISOString(),
        host: req.headers.host,
        url: req.originalUrl,
        'x-forwarded-for': req.headers['x-forwarded-for'],
        'user-agent': req.headers['user-agent']
    };
    // (if this is on GCP, the ip is always a forwarder - don't log it)
    if (req.ip !== "::ffff:127.0.0.1") {
        log.ip = req.ip;
    }

    // attach the initalized log to res and continue
    res.locals.date = date;
    res.locals.log = log;
    next();
};

var save = async (req, res, next) => {
    // log collected data
    res.locals.log.duration = Date.now() - res.locals.date.getTime();
    console.log(JSON.stringify(res.locals.log));
    next();
};

module.exports = {
    init,
    save
};