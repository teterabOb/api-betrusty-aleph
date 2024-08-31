import express from 'express';
//import helmet from 'helmet';
import cors from "cors"
import routes from './routes';

const app = express();
app.use(cors({ origin: "*" }))
app.use(express.json());
app.use(express.urlencoded({extended: true, }))
app.use('/', routes)
app.all('*', (req, res) => res.status(404).json(new Error('route not defined')))
export default app