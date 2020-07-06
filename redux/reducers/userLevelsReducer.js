const INITIAL_STATE = [
  {id: 1, locked: false, successRate: 0, difficulty: 1},
  {id: 2, locked: true, successRate: 0, difficulty: 1},
  {id: 3, locked: true, successRate: 0, difficulty: 1},
  {id: 4, locked: true, successRate: 0, difficulty: 1},
  {id: 5, locked: true, successRate: 0, difficulty: 1},
  {id: 6, locked: true, successRate: 0, difficulty: 2},
  {id: 7, locked: true, successRate: 0, difficulty: 2},
  {id: 8, locked: true, successRate: 0, difficulty: 2},
  {id: 9, locked: true, successRate: 0, difficulty: 2},
  {id: 10, locked: true, successRate: 0, difficulty: 2},
  {id: 11, locked: true, successRate: 0, difficulty: 3},
  {id: 12, locked: true, successRate: 0, difficulty: 3},
  {id: 13, locked: true, successRate: 0, difficulty: 3},
  {id: 14, locked: true, successRate: 0, difficulty: 3},
  {id: 15, locked: true, successRate: 0, difficulty: 3},
];

const userLevelsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'CHANGE_USER_LEVEL':
      return state.map(level => {
        if (level.id === action.levelId) {
          return {...level, ...action.newFields};
        } else {
          return level;
        }
      });
    default:
      return state;
  }
};

export default userLevelsReducer;
