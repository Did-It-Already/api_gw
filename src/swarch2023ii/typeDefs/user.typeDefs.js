export const userTypeDef = `
  type User {
    user_id: Int!
    name: String!
    last_name: String!
    email: String!
    profile_picture: String
    theme: String
  }
  type DeleteResult {
    user_id: Int!
  }

  input UserInput {
    name: String!
    last_name: String!
    email: String!
    profile_picture: String
    theme: String
    password: String!
  }
  
  input UserUpdateInput {
    name: String
    last_name: String
    profile_picture: String
    theme: String
  }`;


export const userQueries = `
      allUsers: [User]!
      userById(user_id: Int!): User!
  `;

export const userMutations = `
    createUser(user: UserInput!): User!
    updateUser(user_id: Int!, user: UserUpdateInput!): User!
    deleteUser(user_id: Int!): DeleteResult
`;
