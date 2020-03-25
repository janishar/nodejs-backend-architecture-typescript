import express from 'express';

const app = express();

/*-------------------------------------------------------------------------*/
// Below all APIs are public APIs protected by api-key
app.use('/', require('../../auth/apiValidation'));
/*-------------------------------------------------------------------------*/

app.use('/signup', require('./access/signup'));
app.use('/login', require('./access/login'));
app.use('/token', require('./access/token'));
app.use('/blogs', require('./blog/blogList'));
app.use('/blog', require('./blog/blogDetail'));
app.use('/writer/blog', require('./blog/writer'));
app.use('/editor/blog', require('./blog/editor'));
app.use('/profile', require('./profile/user'));

module.exports = app;