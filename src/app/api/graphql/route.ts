import { NextRequest, NextResponse } from 'next/server';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { typeDefs } from '@/lib/graphql/schema';
import { resolvers } from '@/lib/graphql/resolvers';
import { authenticateApiRequest } from '@/lib/api/authentication';
import { GraphQLError } from 'graphql';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error) => {
    console.error('[GraphQL] Error:', error);
    return {
      message: error.message,
      code: error.extensions?.code,
    };
  },
});

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req: NextRequest) => {
    // Authenticate API request
    const authResult = await authenticateApiRequest(req);

    if (!authResult) {
      throw new GraphQLError('Unauthorized - Invalid or missing API key', {
        extensions: { code: 'UNAUTHENTICATED' },
      });
    }

    return {
      businessId: authResult.businessId,
    };
  },
});

export { handler as GET, handler as POST };
