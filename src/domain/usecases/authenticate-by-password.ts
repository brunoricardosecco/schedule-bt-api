export type TAuthenticateByPasswordParams = {
  email: string
  password: string
}

export interface IAuthenticateByPassword {
  auth: (authenticateModel: TAuthenticateByPasswordParams) => Promise<string | null>
}
