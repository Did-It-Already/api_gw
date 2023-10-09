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
      allTasks: [Task]!
      taskById( task_id: String!): Task!
  `;

export const taskMutations = `
    createTask( task: TaskInput!): TaskCreated!
    updateTask( task_id: String!, task: TaskUpdateInput!): TaskUpdated!
    updateTaskIsDone(task_id: String!): TaskUpdated!
    deleteTask(task_id: String!): TaskDeleted!
`;
