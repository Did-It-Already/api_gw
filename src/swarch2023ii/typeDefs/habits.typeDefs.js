export const habitTypeDef = `
  type Habit {
    user_id:     Int!
    _id:         String!
    name:        String!
    description: String
    is_done:     Boolean!
    start_date:  String!
    frequency:   Int!
  }

  type HabitResponse{
    user_id:     Int!
    name:        String!
    description: String
    is_done:     Boolean!
    start_date:  String!
    frequency:   Int!
  }

  input HabitUpdateInput{
    name:        String
    description: String
    is_done:     Boolean
    start_date:  String
    frequency:   Int
  }

  input HabitInput {
    name:        String!
    description: String
    frequency:   Int!
  }
  `;
  

export const habitQueries = `
      habits: [Habit]!
      userHabits(user_id: Int!, _id: String): [Habit]!
  `;

export const habitMutations = `
      createHabit(user_id: Int!, habit: HabitInput!): HabitResponse!
      updateHabit(user_id: Int!, _id: String!, habit: HabitUpdateInput!): Habit!

`;
