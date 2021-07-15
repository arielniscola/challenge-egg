import { Router } from 'express';
const router: Router = Router();

//importar controñadores y funcion para validar token

import { TokenValidation } from '../lib/verifyToken'
import {signin, signup, profile, signout} from '../controllers/auth.controllers';

//crear rutas a las endpoins de autentificacion
router.post('/signup', signup);
router.post('/signin', signin);
router.get('/signout', TokenValidation, signout);


export default router;