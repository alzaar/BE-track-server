import dotenv from 'dotenv'
import app from './app'
import { ApolloServer, PubSub } from 'apollo-server-express'
import schema from './gql-mongo/schema'
import userConnectionDB from './gql-mongo/dbs/userDB'
import { getPayload } from './utils/config'

// Access Env. variables
dotenv.config()
// For real time pub-sub issues
const pubsub = new PubSub()

const server = new ApolloServer({ 
  typeDefs: schema.typeDefs,
  resolvers: schema.resolvers,
  introspection: true,
  playground: true, 
  context: async ({req}) => {
    userConnectionDB.activate()

    const token  = req.headers.authorization || ''
    const { payload: user, loggedIn } = getPayload(token)

    return { user, loggedIn, pubsub }
  }
});
 
server.applyMiddleware({ app });

app.listen(process.env.PORT || 8000, () => console.log(`
  🚀 Server running at ${process.env.PORT} \n 
  🚀 GQL-Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}
`))

export default app