import express from 'express';

const app = express();

/*-------------------------------------------------------------------------*/
// Below all APIs are public APIs protected by api-key
app.use('/', require('../../auth/apiValidation'));
/*-------------------------------------------------------------------------*/

module.exports = app;
