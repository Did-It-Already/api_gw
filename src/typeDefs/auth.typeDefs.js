export const authTypeDef = `
  type UserInfo {
    email: String!
    user_id: Int!
  }
  type DataInfo {
    user: UserInfo!
  }
  type RegisterResult {
    data: DataInfo!
    status: String!
  }
  type LoginResult {
    access: String!
    refresh: String!
    status: String!
  }
  type CheckResult {
    result: String!
  }
  input UserInputAuth {
    name: String!
    last_name: String!
    email: String!
    profile_picture: String
    theme: String
    password: String!
  }
  input LoginInput {
    email: String!
    password: String!
  }
  `;

export const authQueries = `
      check(bearer_token: String!): CheckResult
  `;

export const authMutations = `
    register(user: UserInputAuth!): RegisterResult!
    login(user: LoginInput!): LoginResult!
    refresh(refresh: String!): LoginResult!
`;
