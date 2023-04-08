import { config } from 'dotenv'
import 'module-alias/register'
import app from './config/app'

config()

const port = process.env.PORT ?? 3000

app.listen(port, () => {
  console.log(`Server running on localhost:${port}`)
})
