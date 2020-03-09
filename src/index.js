'use strict';

const logging = require('./middleware/logging');
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(logging.init);
app.use(require('./routes'));
app.use(logging.save);


app.listen(PORT, () => {
    const log = {
        timestamp: new Date().toISOString(),
        port: PORT,
        msg: 'server started'
    };
    console.log(JSON.stringify(log));
});