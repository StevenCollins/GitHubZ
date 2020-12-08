const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const requestPromise = require('request-promise');

const header = fs.readFileSync(path.join(__dirname, '/header.html'), 'utf8');

var github = async (req, res, next) => {
    // if we've already sent a response, do nothing
    if (res.headersSent) {
        return next();
    }

    // otherwise call GitHub, and...
    var response = await requestPromise({ uri: `https://github.com${req.originalUrl}`, resolveWithFullResponse: true })
    .then(function (response) {
        // parse the response with Cheerio
        const $ = cheerio.load(response.body);
        var title = $('title').text();

        res.locals.log.status = 'success';
        res.locals.log.title = title;

        // do onthefly editing
        $('title').text(title.replace('GitHub', 'GitHubZ'));
        $('head').prepend('<meta name="robots" content="noindex">');
        $('body').prepend(header);
        // remove any links to the login or join pages
        $('a[href^="/login"]').remove();
        $('a[href^="/join"]').remove();

        // update the body with the modified HTML
        response.body = $.root().html();

        // return the response
        return response;
    })
    .catch(function (err) {
        // log failure
        res.locals.log.status = 'failure';
        res.locals.log.code = err.statusCode;

        // return whatever response we got
        return err.response;
    });

    // send response
    res.status(response.statusCode).send(response.body);
    next();
};

module.exports = github;