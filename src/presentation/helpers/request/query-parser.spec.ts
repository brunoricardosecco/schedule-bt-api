import { queryParser } from './query-parser'

describe('QueryParser Helper', () => {
  it('should parse query params', () => {
    const params = {
      test1: 'abc',
      test2: '0',
    }
    const parsedParams = queryParser(params)

    expect(parsedParams).toEqual({
      test1: 'abc',
      test2: 0,
    })
  })
})
