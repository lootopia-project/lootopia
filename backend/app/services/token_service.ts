import { randomBytes } from 'node:crypto'

export class TokenService {
  public static generateRandomToken(size = 32): string {
    return randomBytes(size).toString('hex')
  }
}
