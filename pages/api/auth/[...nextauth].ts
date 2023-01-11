import NextAuth, {NextAuthOptions} from "next-auth"
import GithubProvider from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import { checkUserEmailPassword, oAuthToDbUser } from '../../../database/dbUsers';

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    // ...add more providers here
    Credentials({
      name: "Custom Login",
      credentials: {
        email: { label: "Email", type: "email", placeholder: 'correo@example.com' },
        password: { label: "Password", type: "password", placeholder: 'contraseña' },
      },
      async authorize(credentials): Promise<any>{

        const user = await checkUserEmailPassword(credentials!.email, credentials!.password )

        if ( user ) {
          return user
        }
        return null
      }
    })
  ],

  //Custom Pages
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register',
  },

  // Callbacks

  session: {
    maxAge: 2592000, // 30 days
    strategy: 'jwt',
    updateAge: 24 * 60 * 60, // 24 hours
  },

  callbacks: {
    async jwt({token, account, user}){

      if ( account ) {
        token.accessToken = account.accessToken
        switch ( account.type) {
          case 'oauth':
            token.user = await oAuthToDbUser(user?.email || '', user?.name || '')
          break;
          case 'credentials':
            token.user = user
          break;
        }
      }
      return token
    },

    async session({session, token, user}){

      session.accessToken = token.accessToken as any
      session.user = token.user as any
      return session
    }
  }
}
export default NextAuth(authOptions)