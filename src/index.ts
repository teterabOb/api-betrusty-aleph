import server from './server'
import transactionRouter from './routes/transactions'

const PORT = 3000
    
server.use('/api/transactions', transactionRouter)

server.listen(PORT, () => {
    console.log(`Server running on port : ${PORT}!`)
})
