import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

interface IPayload {
    _id: string,
    iat: number,
    exp: number
}

export const TokenValidation = (req: Request, res: Response, next: NextFunction) => {
//verificar si exista cabecera de auth
    const token = req.header('auth-token');
    if(!token) return res.status(401).json('Access denied');

//validar token y fecha de expiracion
    const payload = jwt.verify(token, 'clave_secreta') as IPayload;
    const dateExp = new Date( payload.exp * 1000 )
    const date = new Date();

    if(dateExp < date){
        return res.status(401).json('Token Expirado');
    }      
    req.userId = payload._id;

    next();
}