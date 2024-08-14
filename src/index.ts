import server from './server'
import transactionRouter from './routes/transactions'

const PORT = 3000
    
server.use('/api/transactions', transactionRouter)
server.use('/api/github/', transactionRouter)
server.use('/api/worldid/', transactionRouter)
server.use('/api/ml/', transactionRouter)

server.listen(PORT, () => {
    console.log(`Server running on port : ${PORT}!`)
})
