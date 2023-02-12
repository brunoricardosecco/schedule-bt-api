import 'module-alias/register'
import app from './config/app'

const port = process.env.PORT ?? 3000

app.listen(port, () => { console.log(`Server running on localhost:${port}`) })
