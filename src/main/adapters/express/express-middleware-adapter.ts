import { Middleware } from '@/presentation/protocols/middleware'
import { Request, Response, NextFunction } from 'express'

export const expressMiddlewareAdapter = (middleware: Middleware) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const httpResponse = await middleware.handle(req)

    if (httpResponse.statusCode === 200) {
      console.log(httpResponse.body)
      Object.assign(req, httpResponse.body)

      next()
    } else {
      res.status(httpResponse.statusCode).json({
        error: httpResponse.body.message
      })
    }
  }
}
