export interface HashComparer {
  isEqual: (value: string, hash: string) => Promise<boolean>
}
