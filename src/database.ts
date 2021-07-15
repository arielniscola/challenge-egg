import mongoose from 'mongoose';

import { mongodb } from './keys';

//conexion con la BD

mongoose.connect(mongodb.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(db => console.log(' DB connected'))
.catch(err => console.log(err)
);