import chai from 'chai'
import {prepare, 
  getPayload,
  encryptPassword,
  comparePassword,
  getToken} from '../utils/config'

const expect = chai.expect
const utilsTests = () => {
  describe('Tests on utility functions', () => {
    it('DB Object id should return string form', (done) => {

      expect(prepare({_id: 12})).to.deep.equal({_id: '12'})
      expect(prepare({_id: 12})).to.deep.not.equal({_id: 12})
      
      done()
    })

    it ('Token should return log-in object containing status', (done) => {
      const dummySecret = 'hi'
      const dummyPass = {password: '123'}
      const dummyToken = getToken(dummyPass, dummySecret, '1h')

      expect(getPayload(dummyToken, dummySecret).loggedIn).to.deep.equal(true)
      expect(getPayload(dummyToken, dummySecret).payload).to.be.an('object')

      done()
    })

    it ('Passwords should be encrypted', (done) => {
      const pass = '123'
      encryptPassword(pass).then(res => {
        expect(res).to.be.a('string')
      })

      done()
    })

    it('Passwords should be same when stored', (done) => {
      const pass = '123'
      const hash = encryptPassword(pass)
      hash.then(res => {
        comparePassword(pass, res).then(comp => {
          expect(comp).to.be.equal(true)
        })
      })

      done()
    })

    it('Passwords should not match if incorrect', (done) => {
      const pass = '123'
      const hash = encryptPassword(pass)
      const pass2 = '456'
      hash.then(res => {
        comparePassword(pass2, res).then(comp => {
          expect(comp).to.be.equal(false)
        })
      })

      done()
    })

    it('Token should be of the type string', (done) => {

      const dummySecret = 'hi'
      const dummyPass = {password: '123'}
      const dummyToken = getToken(dummyPass, dummySecret, '1h')

      expect(dummyToken).to.be.a('string')

      done()
    })
  })
}

export default utilsTests