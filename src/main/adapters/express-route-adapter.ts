import { Request, Response, RequestHandler } from 'express'
import { Controller, HttpRequest } from '../../presentation/protocols'

export const routeAdapter = (controller: Controller): RequestHandler => {
  return (async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body
    }
    const httpResponse = await controller.handle(httpRequest)

    res.status(httpResponse.statusCode).json(httpResponse.body)
  }) as RequestHandler
}
