const router = require('express').Router();

router.use(/^\/(login|join)/, require('./blocked/blocked'));
router.use("*", require('./github/github'));

module.exports = router;