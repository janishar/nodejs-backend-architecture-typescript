import express from 'express';
import apikey from '../../auth/apikey';
import signup from './access/signup';
import login from './access/login';
import logout from './access/logout';
import token from './access/token';
import blogList from './blog/blogList';
import blogDetail from './blog/blogDetail';
import writer from './blog/writer';
import editor from './blog/editor';
import user from './profile/user';

const app = express();

/*-------------------------------------------------------------------------*/
// Below all APIs are public APIs protected by api-key
app.use('/', apikey);
/*-------------------------------------------------------------------------*/

app.use('/signup', signup);
app.use('/login', login);
app.use('/logout', logout);
app.use('/token', token);
app.use('/blogs', blogList);
app.use('/blog', blogDetail);
app.use('/writer/blog', writer);
app.use('/editor/blog', editor);
app.use('/profile', user);

export default app;