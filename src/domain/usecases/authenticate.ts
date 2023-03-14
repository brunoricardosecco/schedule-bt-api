export interface IAuthenticate {
  auth: (token: string) => Promise<boolean>
}
