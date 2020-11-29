import mongoose from 'mongoose'

const Schema = mongoose.Schema
const userSchema = new Schema({
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    email: {
       type: String,
       required: true
   },
   userType: {
     type: String,
     required: true
   },
   token: {
     type: String,
   },
}, {
    timestamps: true
});

const connect = mongoose.createConnection(process.env.MONGO_URL_USERS, { 
   useNewUrlParser: true,
   useUnifiedTopology: true,
   useFindAndModify: false 
 }, (db) => process.env.SHOW_LOG && console.log('🚀 Connected correctly to Mongo User Server!')
)

const Users = connect.model('User', userSchema);


export default {Users, userSchema};

