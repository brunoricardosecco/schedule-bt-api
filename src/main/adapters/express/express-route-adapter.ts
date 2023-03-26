import { Request, Response, RequestHandler } from 'express'
import { Controller, HttpRequest } from '@/presentation/protocols'
import { AccountModel } from '@/domain/models/account'

interface IRequest extends Request {
  user?: AccountModel
}

export const routeAdapter = (controller: Controller): RequestHandler => {
  return (async (req: IRequest, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body,
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
