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

const router = express.Router();

/*-------------------------------------------------------------------------*/
// Below all APIs are public APIs protected by api-key
router.use('/', apikey);
/*-------------------------------------------------------------------------*/

router.use('/signup', signup);
router.use('/login', login);
router.use('/logout', logout);
router.use('/token', token);
router.use('/blogs', blogList);
router.use('/blog', blogDetail);
router.use('/writer/blog', writer);
router.use('/editor/blog', editor);
router.use('/profile', user);

export default router;
