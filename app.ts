import express from 'express';
//import helmet from 'helmet';
//import cors from "cors"
import routes from './routes';

const app = express();
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended: true, }))
app.use('/', routes)
app.all('*', (req, res) => res.status(404).json(new Error('route not defined')))
export default app