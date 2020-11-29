import db from '../gql-mongo/models/issue'
import chai from 'chai'
const expect = chai.expect

const IssueTest = () => {
  describe('Test Suite for Issues Modal', () => {
    afterEach((done) => {
      db.Issues.find()
      .then(res => {
        db.Issues.deleteMany({}).then(re2 => {
          done()
        })
      }) 
    })

    it ('Create Issue', (done) => {
      const Issue = new db.Issues(
        {
          title: "args.title,",
          photoUrl: "photoUrls,",
          description: "args.description,",
          address: "args.address,",
          status: "args.status,",
          priority: "args.priority,",
          phoneNumber: "args.phoneNumber || 'NA'",
        }
      )
      Issue.save().then(res => {
        expect(res).to.be.an('object')
        done()
      }) 
    })

    it ('Update Issue', done => {
      const Issue = new db.Issues(
        {
          title: "args.title,",
          photoUrl: "photoUrls,",
          description: "args.description,",
          address: "args.address,",
          status: "args.status,",
          priority: "args.priority,",
          phoneNumber: "args.phoneNumber || 'NA'",
        }
      )
      
      Issue.save().then(res => {
        db.Issues.findOneAndUpdate({
            _id: Issue._id
            },
            {
              $set: {
               title: 'New titel',
               photoUrl: 'New',
               description: 'New',
               address: 'New',
               status: 'New',
               priority: 'New',
               phoneNumber: 'New',
              }
            }, {new: true}
            ).then(res => {
              expect(res.status).to.be.equal('New')
              done()
            })
          })
        })
      

    it ('Delete an Issue', done => {
      const Issue = new db.Issues(
        {
          title: "args.title,",
          photoUrl: "photoUrls,",
          description: "args.description,",
          address: "args.address,",
          status: "args.status,",
          priority: "args.priority,",
          phoneNumber: "args.phoneNumber || 'NA'",
        }
      )
      Issue.save().then(res => {
        db.Issues.deleteOne({_id: res._id}).then(res2 => {
          expect(res2.deletedCount).to.be.equal(1)
          expect(res2.ok).to.be.equal(1)
          done()
        })
      })


    })

  })
}

export default IssueTest