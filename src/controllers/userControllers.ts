import { Request, Response } from 'express';
import User, { IUser } from '../models/user';

class UserController {

    //modificar los datos del usuario
    public async saveUser(req: Request, res: Response) {
       
        const { username, name, lastname, dni} = req.body;
        const idUser = req.userId;
    //verificamos que el usuario logueado no sea hijo       
        User.findOne({'_id': idUser}).exec((err, user) => {

            if(err) return res.status(500).send('Error en el servidor');            
            if(!user){
                return res.status(404).send('Usuario no registrado');
            }else if(user.parent){
                return res.send('Usuario no puede modificar sus datos');
            }else{
                
                var query = {
                'username': username,
                'name': name,
                'lastname': lastname,
                'dni': dni    
                };
     //actualizamos los datos         
        User.findOneAndUpdate( {'username': username}, query,{upsert: true}, function(err, userUpdate) {
            if (err) return res.status(500).send('Error en el servidor');
            return res.send(userUpdate);
        });
            }
        });       
        
    }
    //almacenar hijos
    public saveChild = async(req: Request, res: Response) =>{
        const parent = req.params.id;
        const { username, name, lastname, password, dni } = req.body;

            const user: IUser = new User({
                username: username,
                name: name,
                lastname: lastname,
                password: password,
                dni: dni,
                parent: parent
            });
            user.password = await user.encryptPassword(user.password);
            const saveUser = await user.save();
            res.send(saveUser);
    }
    //buscar hijos de un padre
    public getChild(req: Request, res: Response){
        const userId = req.params.id;

        User.find({'parent': userId}).limit(10).exec((err, users) => {
            if(err) res.status(500).send('Error en el servidor');
            if(!users) res.status(404).send('No tiene hijos registrados');

            res.status(200).send({users});
        })
    }
    //buscar a todos los hijos
    public getAllChild(req: Request, res: Response){

        //buscar por paginas los hijos con un limite de pagina de 10 ordenados por nombre.
        const perPage = 10;
        const page: number = parseInt(req.params.page);
        
        User.find({parent : { $exists: true}}).limit(10).sort('name').skip(perPage * (page - 1)).exec((err, users) => {
            if(err) res.status(500).send('Error en el servidor');
            if(!users) res.status(404).send('No tiene hijos registrados');
            console.log(users);
            
            res.status(200).send({
                users,
                page,
                perPage: perPage
            });
        })
    }
    //eliminar hijos mediante
    public deleteChild(req: Request, res: Response): void{
        const id = req.params.id;

        User.findByIdAndDelete(id).exec((err) => {
            if(err) res.status(500).send('Error en el servidor');

            res.status(200).send('Hijo eliminado');
        })
    }
    //obtener perfil
    public getProfile(req: Request, res: Response): void{
        var idUser = req.params.id;

        User.findOne({'_id': idUser}).exec((err, user) => {
            if(err) res.status(500).send('Error en el servidor');
            if(!user) res.status(404).send('No se encontro usuario especificado');
            res.status(200).send({user});
        });
    }

    //renderizar formulario de hijo y las tablas.
    public renderTableSon(req: Request, res: Response): void{
                res.render('user/add', {
                    title: 'Listado Hijos'
                });
    }
    public renderFormSon(req: Request, res: Response): void{
            res.render('user/formSon', {
                title: 'Agregar hijo'
            });
     }
    //renderizar formulario de usuario
    public renderFormUser (req: Request, res: Response): void {
        res.render('user/add', {
            title: ''
        });
    }
}

export const userController = new UserController();