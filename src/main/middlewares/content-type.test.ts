import app from '@/main/config/app'
import request from 'supertest'

describe('Content Type Middleware', () => {
  it('should return default content type as json', async () => {
    app.get('/test_content_type', (req, res) => res.send())
    await request(app).get('/test_content_type').expect('content-type', /json/)
  })

  it('should return xml content-type when its forced', async () => {
    app.get('/test_content_type_xml', (req, res) => {
      res.type('xml')
      res.send()
    })
    await request(app).get('/test_content_type_xml').expect('content-type', /xml/)
  })
})
