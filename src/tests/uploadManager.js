import chai from 'chai'
import UploadManager from '../aws-config/uploadManager'
import fs from 'fs'
import path from 'path'

const expect = chai.expect

const uploadManagerTest = () => {
  describe('Upload Manager instance functionality check', () => {
    it('Creates instance of Upload Manager', (done) => {
      const uM = new UploadManager()
      expect(uM).to.be.an('object')      
      done()
    })

    it('Upload manager lists S3 Buckets', (done) => {
      const uM = new UploadManager()
      uM.getBuckets().then(res => {
        expect(res).to.be.an('array')
        expect(res).to.have.lengthOf.above(1)
        done()
      })
    })

    it('Upload manager uploads image to S3 Bucket', (done) => {
      const uM = new UploadManager()
      const file = path.join(__dirname, 'testImage.jpg')
      const fileStream = fs.createReadStream(file)

      fileStream.on('error', function(err) {
        console.log('File Error', err, file)
        done()
      })
      const params = {
        Key: path.basename(file), Body: fileStream, ACL: 'public-read'
      }

      uM.uploadFile(params).then(res => {
        expect(res.Location).to.be.a('string')
        done()
      })

    })

    it('Upload Manager deletes uploaded file', (done) => {
      const uM = new UploadManager()
      const file ='testImage.jpg'
      const params = {
        Key: file
      }

      uM.deleteFile(params).then(res => {
        expect(res).to.be.an.empty
        done()
      })
    })
  })
}

export default uploadManagerTest