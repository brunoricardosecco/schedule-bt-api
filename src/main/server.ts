import { config } from 'dotenv'
import 'module-alias/register'
import app from './config/app'
import gracefulShutdown from './config/graceful-shutdown'

config()

const port = process.env.PORT ?? 3000

const server = app.listen(port, () => {
  console.log(`Server running on localhost:${port}`)
})

gracefulShutdown(server)
