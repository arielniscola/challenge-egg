import express from 'express';
import exphbs from 'express-handlebars';
import path from 'path';

import AuthRoutes from './routes/auth';
import UserRoutes from './routes/user';

const app = express();
import './database';

app.set('port', 3000);

//configuracion de las vistas
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    extname: '.hbs',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    defaultLayout: 'main'
}));
app.set('view engine', '.hbs');


//middlewares
app.use(express.json());
app.use(express.urlencoded({extended:false}));

//routes
app.use('/auth', AuthRoutes); 
app.use('/user', UserRoutes);

//static files
app.use(express.static(path.join(__dirname, 'public')));

//starting server
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);    
});