export const taskTypeDef = `
  type Task {
    user_id:     String!
    _id:         String
    name:        String!
    description: String!
    is_done:     String
    date:        String!
  }
  type TaskCreated {
    InsertedID: String!
  }
  type TaskUpdated {
    MatchedCount: Int!
    ModifiedCount: Int!
    UpsertedCount: Int!
    UpsertedID: String
  }
  type TaskDeleted{
    Msg: String!
  }
  input TaskInput {
    user_id:     String!
    name:        String!
    description: String!
    date:        String!
  }
  
  input TaskUpdateInput {
    name:        String
    description: String
    date:        String
  }`;
  

export const taskQueries = `
      allTasks(user_id: String!): [Task]!
      taskById(user_id: String!, task_id: String!): Task!
  `;

export const taskMutations = `
    createTask(user_id: String!, task: TaskInput!): TaskCreated!
    updateTask(user_id: String!, task_id: String!, task: TaskUpdateInput!): TaskUpdated!
    updateTaskIsDone(user_id: String!, task_id: String!): TaskUpdated!
    deleteTask(user_id: String!, task_id: String!): TaskDeleted!
`;
