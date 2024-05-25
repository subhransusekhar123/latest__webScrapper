import dotenv from 'dotenv';
import connectDB from './src/db/index.js';
import { app } from './app.js';


dotenv.config({
    path:'./.env'
})



app.get('/', (req,res)=>{
    res.send("<h1>hello world!!!</h1>")
})


connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`server is running at port:${process.env.PORT}`);
    })
})