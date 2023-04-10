import { AccessDeniedError, ServerError } from '@/presentation/errors'
import { NotFoundError } from '@/presentation/errors/not-found-error'
import { UnauthorizedError } from '@/presentation/errors/unauthorized-error'
import { HttpResponse } from '@/presentation/protocols'

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data,
})

export const noContent = (): HttpResponse => ({
  statusCode: 204,
  body: null,
})

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error,
})

export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError(),
})

export const forbidden = (): HttpResponse => ({
  statusCode: 403,
  body: new AccessDeniedError(),
})

export const notFound = (message: string): HttpResponse => ({
  statusCode: 404,
  body: new NotFoundError(message),
})

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack),
})
