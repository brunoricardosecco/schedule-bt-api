import { Controller, HttpRequest } from '@/presentation/protocols'
import { RequestHandler, Response } from 'express'
import { ExpressRequest } from './express-request'

export const routeAdapter = (controller: Controller): RequestHandler => {
  return (async (req: ExpressRequest, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body,
      params: req.params,
      headers: req.headers,
      query: req.query,
      user: req.user
    }
    const httpResponse = await controller.handle(httpRequest)

    if (httpResponse.statusCode < 400) {
      res.status(httpResponse.statusCode).json(httpResponse.body)
    } else {
      res.status(httpResponse.statusCode).json({ error: httpResponse.body.message })
    }
  }) as RequestHandler
}
