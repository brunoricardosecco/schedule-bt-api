import { Request, Response, RequestHandler } from 'express'
import { Controller, HttpRequest } from '@/presentation/protocols'

export const routeAdapter = (controller: Controller): RequestHandler => {
  return (async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body,
      headers: req.headers,
      query: req.query,
      params: req.params
    }
    const httpResponse = await controller.handle(httpRequest)

    if (httpResponse.statusCode < 400) {
      res.status(httpResponse.statusCode).json(httpResponse.body)
    } else {
      res.status(httpResponse.statusCode).json({ error: httpResponse.body.message })
    }
  }) as RequestHandler
}
