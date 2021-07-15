import { Router } from 'express';

const router: Router = Router();

//importacion de controlador y verificador de token

import { TokenValidation } from '../lib/verifyToken';
import { userController }  from '../controllers/userControllers';

//crear rutas a los endpoints de usuario


router.put('/update-user', TokenValidation,userController.saveUser);                //actualizar datos de un usuario hijo o padre
router.post('/addChild/:id', TokenValidation , userController.saveChild);           //agregar hij id del padre
router.delete('/delete-child/:id', TokenValidation , userController.deleteChild);   //eliminar hijo
router.get('/profile/:id', TokenValidation ,userController.getProfile);             //buscar el perfil de un padre o hijo
router.get('/getChilds/:id', TokenValidation ,userController.getChild);             //buscar hijos de un padre
router.get('/get-all-childreen/:page', userController.getAllChild);                  //buscar todos los hijos

//rutas para renderizar views
router.get('/list-son', userController.renderTableSon);
router.get('/add', userController.renderFormUser);
router.get('/add', userController.renderFormUser);


export default router;