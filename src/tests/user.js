import db from '../gql-mongo/models/user'
import chai from 'chai'
const expect = chai.expect

const UserTest = () => {
  describe('Test Suite for Users Modal', () => {
    afterEach((done) => {
      db.Users.find()
      .then(res => {
        db.Users.deleteMany({}).then(re2 => {
          done()
        })
      }) 
    })

    it ('Create User', (done) => {
      const user = new db.Users({
        username: 'test',
        password: 'test',
        email: 'test@test.com',
        userType: 'regular'
      })

      user.save().then(res => {
        expect(res).to.be.an('object')
        done()
      })
    })

    it ('Update User', done => {
      const user = new db.Users(
        {
          username: 'test',
          password: 'test',
          email: 'test@test.com',
          userType: 'regular'
        }
      )
      user.save().then(res => {
        db.Users.findOneAndUpdate({
            _id: user._id
            },
            {
              $set: {
                username: 'test',
                password: 'test',
                email: 'test@gmail.com',
                userType: 'regular'
              }
            }, {new: true}
            ).then(res => {
              expect(res.email).to.be.equal('test@gmail.com')
              done()
            })
          })
        })
      

    it ('Delete a User', done => {
      const user = new db.Users(
        {
          username: 'test',
          password: 'test',
          email: 'test@test.com',
          userType: 'regular'
        }
      )
      user.save().then(res => {
        db.Users.deleteOne({_id: res._id}).then(res2 => {
          expect(res2.deletedCount).to.be.equal(1)
          expect(res2.ok).to.be.equal(1)
          done()
        })
      })
    })

  })
}

export default UserTest