import server from '../server'
import chai from 'chai'
import chaiHttp from 'chai-http'

const expect = chai.expect
chai.use(chaiHttp)

const serverTest = () => {
    describe('API', () => {
        describe('Graphql Server Functionality Test', () => {
            it ('Server starts w/o any problem', (done) => {
                chai.request(server)
                .get('/graphql/issues')
                .query({query: "{\n  getIssues {\n    title\n  }\n}\n"})
                .end((err, res) => {

                    expect(err).to.be.null
                    expect(res).to.have.status(200)
                    
                    done()
                })
            })

            it ('Creates an Issue', (done) => {
                const query = `mutation {  addIssue(address: "NA", description: "NA", title: "NA", photoUrls: "NA", status: "Unstarted", priority: "High", phoneNumber: "NA") {    title    description  }}`
                chai.request(server)
                .post('/graphql')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({query: query})
                .end((err, res) => {

                    expect(err).to.be.null
                    expect(res).to.have.status(200)
                    expect(res.body.data).to.be.an('object')
                    
                    done()
                })
            })

            it ('Updates an Issue', (done) => {
                chai.request(server)
                .get('/graphql/issues')
                .query({query: "{\n  getIssues {\n    title\n id\n }\n}\n"})
                .end((err, res) => {
                    const issueId = res.body.data.getIssues[0].id
                    const queryForUpdateIssue = `mutation {  updateIssue(id: "${issueId}", address: "HI", description: "HI", title: "HI", photoUrls: "HI", status: "Unstarted", priority: "High", phoneNumber: "HI") {    title    description  }}`
                    chai.request(server)
                    .post('/graphql')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .send({query: queryForUpdateIssue.toString()})
                    .end((err, res) => {
                        expect(err).to.be.null
                        expect(res).to.have.status(200)
                        expect(res.body.data).to.be.an('object')
                        done()
                    })
                })
            })

            it ('Delete a Issue', (done) => {
                chai.request(server)
                .get('/graphql/issues')
                .query({query: "{\n  getIssues {\n    title\n id\n }\n}\n"})
                .end((err, res) => {
                    const issueId = res.body.data.getIssues[0].id
                    const queryForDeleteIssue = `mutation {  deleteIssue(id: "${issueId}")}`
                    chai.request(server)
                    .post('/graphql')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .send({query: queryForDeleteIssue.toString()})
                    .end((err, res) => {
                        expect(err).to.be.null
                        expect(res).to.have.status(200)
                        expect(res.body.data.deleteIssue).to.be.an('string')
                        done()
                    })
                })
            })

            it ('Delete all Issues', (done) => {
                // const queryForDeleteAll = 'mutation {deleteAllIssues}'
                chai.request(server)
                .post('/graphql')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({query: 'mutation {deleteAllIssues}'})
                .end((err, res) => {
                    // console.log(res)
                    expect(err).to.be.null
                    expect(res).to.have.status(200)
                    expect(res.body.data.deleteAllIssues).to.be.an('string')
                    done()
                    })
                // done()
            })
        })
    })
}

export default serverTest
