import { gql } from 'apollo-server-express'
import issueModel from './models/issue'
import userModel from './models/user'
import { encryptPassword, getPayload, getToken, comparePassword } from '../utils/config'
import UploadManager from '../aws-config/uploadManager'

const Issues = issueModel.Issues
const User = userModel.Users
const uM = new UploadManager()


const typeDefs = gql`

type File {
  filename: String!
  mimetype: String!
  encoding: String!
}

type Subscription {
  issue: IssueSubscriptionPayload!
  user: UserSubscriptionPayload!
}

type IssueSubscriptionPayload {
  mutation: String!
  data: Issue!
}

type UserSubscriptionPayload {
  mutation: String!
  data: User!
}

type User {
  username: String!
  password: String!
  email: String!
  token: String
  error: Boolean
  msg: String
  userType: String
  numOfTickets: Int
  id: ID
}

type UserData {
  data: [User]
  error: Boolean
  msg: String
}

type Query {
  getIssues: [Issue!]!
  getIssue(id: ID!): Issue!
  getUsers: UserData!
}

type Issue {
  id: ID
  title: String
  photoUrl: [String]
  description: String
  address: String
  status: String
  priority: String
  phoneNumber: String
}

type Mutation {
  addIssue(
    title: String!
    description: String!
    address: String!
    status: String!
    priority: String!
    phoneNumber: String,
    photos: Upload,
    photoUrls: String
  ): Issue!

  updateIssue(
    id: ID!
    title: String!
    description: String!
    address: String!
    status: String!
    priority: String!
    phoneNumber: String,
    photos: Upload,
    photoUrls: String
  ): Issue!
  
  deleteIssue(
    id: ID!
  ): String!

  deleteAllIssues: String!

  deleteUser(
    id: ID!
  ): User

  register(
    username: String!, 
    password: String!,
    email: String!,
    userType: String!
  ): User
  
  login(
    username: String!,
    password: String!
  ): User

  updateUser(
    id: ID!
    username: String!, 
    password: String!,
    email: String!,
    userType: String!
  ) : User

}
`

const resolvers = {
  Query: {
    getIssues: async (parent, args, context, info) => {
      return await Issues.find({})
    },
    getIssue: (parent, args) => {
      return Issues.findById(args.id);
    },
    getUsers: async (parent, args, context, info) => {
      if (context.loggedIn)
        return {
          data: await User.find({}),
          error: false,
          msg: 'Data sent'
        }
      else 
        return {
          error: true,
          msg: 'Unauthorized',
          data: []
        }
    }
  },

  Mutation: {
    updateUser: async (parent, args, context, info) => {
      if (!args.id) return
      if (context.loggedIn) {
        const user = await User.findOneAndUpdate(
          {
            _id: args.id
          },
          {
            $set: {
              username: args.username, 
              password: await encryptPassword(args.password),
              email: args.email,
              userType: args.userType
            }
          }, {new: true})
          context.pubsub.publish('user', {
            issue:{
                mutation: 'UPDATED',
                data: user
            }
          })
        return user
      } else {
        return {
          error: true,
          msg: 'Unauthorized'
        }
      }
    },

    deleteUser: async (parent, args, context, info) => {
      if (!args.id) return

      if (context.loggedIn && context.user.userType === 'admin') {
        const user = await User.findOne({_id: args.id})
        await User.deleteOne({_id: args.id})
        return user
      } else {
        return {
          error: true,
          msg: 'Unauthorized'
        }
      }
    },

    deleteIssue: async (parent, args, context, info) => {
      // Auth needs testing
      if (!args.id) return

      if (context.loggedIn && context.user.userType === 'admin') {
        try {
          let issue = await Issues.findOne({id: args.id})
          await Issues.deleteOne({id: args.id})
          context.pubsub.publish('issue', {
            issue:{
                mutation: 'DELETED',
                data: issue
            }
          })
          return 'OK'
        } catch(e) {
          throw new Error(e)
        }
      } else {
        return 'unauthorized'
      }
    },

    deleteAllIssues: async (parent, args, context, info) => {
      if (context.loggedIn && context.user.userType === 'admin') {
        try {
          const res = await Issues.deleteMany()
          return `OK - ${res.deletedCount}`
        } catch(e) {
          throw new Error(e)
        }
      } else {
        return 'unauthorized'
      }
    },

    addIssue: async (parent, args, context, info) => {
      try {
        let photoUrls = args.photoUrls
        if (!args.photoUrls) {
            photoUrls = (await Promise.all(args.photos.map(async (file) => {
            const { stream, filename /*, mimetype, encoding */ } = await file;
            return (await uM.uploadFile({Key: filename, Body: stream, ACL: 'public-read'})).Location
          })))
        }

        let Issue = new Issues({
          title: args.title,
          photoUrl: photoUrls,
          description: args.description,
          address: args.address,
          status: args.status,
          priority: args.priority,
          phoneNumber: args.phoneNumber || 'NA'
        })

        return Issue.save()

      } catch (err) {

       return 

      }
    },

    updateIssue: async (parent, args, context, info) => {
      if (!args.id) return
      if (context.loggedIn && context.user.userType === 'admin') {
      // need to add photos upload -- Logic
        const Issue = await Issues.findOneAndUpdate(
          {
            _id: args.id
          },
          {
            $set: {
              status: args.status,
              priority: args.priority,
            }
          }, {new: true})
          context.pubsub.publish('issue', {
            issue:{
                mutation: 'UPDATED',
                data: Issue
            }
          })
        return Issue
      } else {
        const Issue = await Issues.findOneAndUpdate(
          {
            _id: args.id
          },
          {
            $set: {
              title: args.title,
              photoUrl: args.photoUrls,
              description: args.description,
              address: args.address,
              phoneNumber: args.phoneNumber || 'NA'
            }
          }, {new: true})
          context.pubsub.publish('issue', {
            issue:{
                mutation: 'UPDATED',
                data: Issue
            }
          })
        return Issue
      }
    },

    register: async (parent, args, context, info) => {
      if (context.loggedIn) {
        const user = await User.findOne({ username: args.username })

        if (user) {
          return {
            error: true,
            msg: 'User already exists.'
          }
        }

        const newUser = new User({
          username: args.username,
          password: await encryptPassword(args.password),
          email: args.email,
          userType: args.userType
        })

        return newUser.save()
      } else {
        return {
          error: true,
          msg: 'Unauthorized'
        }
      }
    },

    login: async (parent, args, context, info) => {
      const user = await User.findOne({username: args.username})
      if (user) {
        const isMatch = await comparePassword(args.password, user.password)
        if (isMatch) {
          user.token = getToken(user)
          user.error = false
          return user
        } else {
          user.error = true
          user.msg = 'Wrong Password!'
          return user
        }
      } else {
        return {error: true, msg: 'Wrong Username!'}
      }
    }
  },

  Subscription:{
    issue:{
      subscribe(parent, args, context, info){
        return context.pubsub.asyncIterator('issue');
      }
    },
    user: {
      subscribe(parent, args, context, info){
        return context.pubsub.asyncIterator('user');
      }
    }
  },
}



export default {
	typeDefs: typeDefs,
	resolvers: resolvers
}
