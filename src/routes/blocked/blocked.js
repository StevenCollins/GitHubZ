const fs = require('fs');
const path = require('path');

const blockedHtml = fs.readFileSync(path.join(__dirname, '/blocked.html'), 'utf8');

const blocked = (req, res, next) => {
    res.locals.log.status = 'blocked';
    res.status(403).send(blockedHtml);
    next();
};

module.exports = blocked;