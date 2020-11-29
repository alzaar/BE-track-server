import mongoose from 'mongoose'

const connectionUserDB = {
  activate: () => mongoose.connect(process.env.MONGO_URL_USERS, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }, (db) => process.env.SHOW_LOG && console.log('🚀 Connected correctly to Mongo Users Server!') 
  )
}

export default connectionUserDB