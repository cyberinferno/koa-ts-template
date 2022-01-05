import Router from '@koa/router';
import DefaultController from '../controllers/DefaultController';

const router = new Router();

router.get('/', DefaultController.getVersion);
router.get('/version', DefaultController.getVersion);

export default router;
