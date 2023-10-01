export const userTypeDef = `
  scalar Upload
  type User {
    user_id: Int!
    name: String!
    last_name: String!
    email: String!
    image_url: String
    theme: String!
  }
  input UserInput {
    name: String!
    last_name: String!
    email: String!
    profile_picture: String
    theme: String!
  }`;

export const userQueries = `
      allUsers: [User]!
      userById(user_id: Int!): User!
  `;

export const userMutations = `
    createUser(user: UserInput!): User!
    updateUser(user_id: Int!, user: UserInput!): User!
    deleteUser(user_id: Int!): User
`;