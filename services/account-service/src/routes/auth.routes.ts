import { Router } from 'express';
import * as  AccountController  from '../controllers/auth.controller';

const router = Router();

router.post('/register', AccountController.register);
router.post('/login', AccountController.login);

export default router;