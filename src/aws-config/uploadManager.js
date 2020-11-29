import AWS from 'aws-sdk'

export default class UploadManager {
  constructor() {
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    })
    this.s3 = new AWS.S3()
  }

  async getBuckets() {
    const response = await this.s3.listBuckets().promise()
    return response.Buckets
  }

  async uploadFile(params) {
    params.Bucket = process.env.S3_BUCKET_NAME
    return await this.s3.upload(params).promise()
  }

  async deleteFile(params) {
    params.Bucket = process.env.S3_BUCKET_NAME
    return await this.s3.deleteObject(params).promise()
  }
}