export type TAuthenticationByPasswordParams = {
  email: string
  password: string
}

export interface IAuthenticationByPassword {
  auth: (authenticationModel: TAuthenticationByPasswordParams) => Promise<string | null>
}
