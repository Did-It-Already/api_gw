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

  type StatisticsResult {
    _id:        String!
    habit_id:   String!
    date:       String!
    user_id:    Int!
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
      userHabits(_id: String): [Habit]!
  `;

export const habitMutations = `
      createHabit(habit: HabitInput!): HabitResponse!
      updateHabit(_id: String!, habit: HabitUpdateInput!): Habit!
      deleteHabit(_id: String!): String!
      updateHabitIsDone(_id: String!): String!
      getStatistics(user_id: String, habit_id: String, date: String, _id: String): [StatisticsResult!]
      reviewHabits: String!
`;
