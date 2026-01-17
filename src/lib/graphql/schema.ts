export const typeDefs = `#graphql
  scalar Date
  scalar JSON

  type Booking {
    id: ID!
    businessId: ID!
    serviceId: ID!
    serviceName: String!
    professionalId: ID
    professionalName: String
    customerData: CustomerData!
    scheduledDateTime: Date!
    status: String!
    price: Int!
    notes: String
    createdAt: Date!
    updatedAt: Date!
  }

  type CustomerData {
    firstName: String
    lastName: String
    email: String
    phone: String
  }

  type Service {
    id: ID!
    businessId: ID!
    name: String!
    description: String
    category: String
    price: Int!
    currency: String!
    durationMinutes: Int!
    active: Boolean!
    createdAt: Date!
    updatedAt: Date!
  }

  type Professional {
    id: ID!
    businessId: ID!
    name: String!
    email: String
    phone: String
    specialties: [String!]!
    active: Boolean!
    createdAt: Date!
    updatedAt: Date!
  }

  type Query {
    bookings(status: String, startDate: String, endDate: String, limit: Int, offset: Int): [Booking!]!
    booking(id: ID!): Booking
    services: [Service!]!
    service(id: ID!): Service
    professionals: [Professional!]!
    professional(id: ID!): Professional
  }

  input CreateBookingInput {
    serviceId: ID!
    professionalId: ID
    customerData: CustomerDataInput!
    scheduledDateTime: Date!
    notes: String
  }

  input CustomerDataInput {
    firstName: String
    lastName: String
    email: String!
    phone: String
  }

  type Mutation {
    createBooking(input: CreateBookingInput!): Booking!
  }
`;
