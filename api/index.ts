import server from './server'
import { Request, Response, NextFunction} from "express"
import transactionRouter from './routes/transactions'
import dotenv from 'dotenv'

dotenv.config()

const PORT = 3003

server.get('/', (req, res) => {
    res.send('Welcome to the BeTrusty API!')
 })

 server.get('/api', (req, res) => {
    res.send('EntryPoint for the BeTrusty API!')
 })
    
server.use('/api/transactions', transactionRouter)
server.use('/api/auth/github/', transactionRouter)
server.use('/api/auth/worldid/', transactionRouter)
server.use('/api/auth/ml/', transactionRouter)


server.listen(PORT, () => {
    console.log(`Server running on port : ${PORT}!`)
})

//Middleware de manejo de errores
server.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err)
    res.status(500).send('Something went wrong!')
})

module.exports = server