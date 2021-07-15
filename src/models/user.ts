import mongoose, { Schema, model, Document }  from "mongoose";
import bcrypt from 'bcryptjs';

export interface IUser extends Document{
    username: string;
    password: string;
    lastname: string;
    dni: number;
    parent: string;
    encryptPassword(password: string): Promise<string>;
    validatePassword(password: string): Promise<boolean>;
}
//definir el modelo de usuario
const UserSchema = new Schema<IUser>({
    username: {
        type: String,
        required: true,
        min: 4,
        lowercase: true,
        unique: true
    },
    name : {
        type: String,
        required: true,
        lowercase: true
    },
    lastname: String,
    password: {
        type: String,
        required: true
    },
    dni: {
        type: Number,
        unique: true
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});
//funcion para encriptar la contraseña
UserSchema.methods.encryptPassword = async (password: string): Promise<string> => {
   const salt =  await bcrypt.genSalt(10);
   return bcrypt.hash(password, salt);
};
//funcion para validar contraseña ingresada
UserSchema.methods.validatePassword = async function (password: string): Promise<boolean> {
  return  await bcrypt.compare(password, this.password);
}

export default model<IUser>('User', UserSchema);