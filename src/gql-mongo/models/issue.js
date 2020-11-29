import mongoose from 'mongoose'

const Schema = mongoose.Schema
const issueSchema = new Schema({
    title: {
       type: String,
       required: true
    },
    photoUrl: {
       type: Array,
    },
    description: {
       type: String,
       required: true
   },
   address: {
     type: String,
     required: true
   },
   status: {
     type: String,
     required: true
   },
   priority: {
      type: String,
      required: true
   },
   phoneNumber: {
      type: String,
   }
}, {
    timestamps: true
});

const connect = mongoose.createConnection(process.env.MONGO_URL, { 
   useNewUrlParser: true,
   useUnifiedTopology: true,
   useFindAndModify: false 
 }, (db) => process.env.SHOW_LOG && console.log('🚀 Connected correctly to Mongo Issues Server!')
)

const Issues = connect.model('Issue', issueSchema);


export default {Issues, issueSchema};

