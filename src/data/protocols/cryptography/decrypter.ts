export type TokenPayload = {
  userId: string
}

export interface Decrypter {
  decrypt: (token: string) => Promise<TokenPayload>
}
