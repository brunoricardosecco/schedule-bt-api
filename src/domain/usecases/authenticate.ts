export type IAuthenticateReturn = {
  userId: string
}

export interface IAuthenticate {
  auth: (token: string) => Promise<IAuthenticateReturn | Error>
}
