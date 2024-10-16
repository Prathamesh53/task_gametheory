import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser'; 
import cors from 'cors'
import userRoutes from './routes/user'
import adminRoutes from './routes/admin'
import dotenv from 'dotenv'
import path from 'node:path'

const app = express();
dotenv.config()
app.use(cors({origin:['http://localhost:5173'],credentials:true}))
app.use(bodyParser.json());

(async()=>{
    try{
        const localURL="mongodb://localhost:27017/court"
        await mongoose.connect(process.env.MONGO_URL||localURL);
        console.log("DB connected")
    }catch(e){
        console.log(e);
        process.exit();
    }
})();

app.use(express.static(path.resolve(path.resolve() + '/client/dist/')));

app.use('/api/v1',userRoutes);
app.use('/api/v1',adminRoutes); 
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.resolve(path.resolve() + '/client/dist/index.html'))
})
 const PORT = process.env.PORT||3000;
app.listen(PORT, () => {
  console.log('Server running on port 3000');
});
