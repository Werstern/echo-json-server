const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');

const routes = require('./routes/index');
const users = require('./routes/users');
const api = require('./routes/api');

const app = express();

//view engine setup
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use('/', routes);

app.use('/users', users);
app.use('/api', api);

//catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not found');
    err.status = 404;
    next(err);
});

app.listen(5000, function() {
    console.log('Listening on http://localhost:5000');
});
