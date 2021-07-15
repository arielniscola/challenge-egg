import { Request, Response } from 'express';
import User, { IUser } from '../models/user';

import jwt from 'jsonwebtoken';

export const signup = async (req: Request, res: Response) => {
    const { username, name, lastname, password, dni } = req.body;

    const user: IUser = new User({
        username: username,
        name: name,
        lastname: lastname,
        password: password,
        dni: dni
    });
    user.password = await user.encryptPassword(user.password);
    const saveUser = await user.save();
    res.send(saveUser);
};

export const signin = async (req: Request, res: Response) => {
    const user = await User.findOne({username: req.body.username});
    if(!user) return res.status(400).json('Usuario o contraseña incorrecta')

   const validPass = await user.validatePassword(req.body.password);
   if(!validPass) return res.status(400).json('Contraseña incorrecta')
   
   const token = jwt.sign({_id: user._id}, 'clave_secreta', {
       expiresIn: 60 * 60 * 24 //expira en un dia
   });

   res.header('auth-token', token).json(user);
};

export const signout = (req: Request, res: Response) => {
    res.header('auth-token', '').send('Sesión cerrada');
}

export const profile = (req: Request, res: Response) => {
   
};