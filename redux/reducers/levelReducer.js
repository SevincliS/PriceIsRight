const INITIAL_STATE = {
  currentLevel: 0,
  currentQuestion: 0,
  levelCount: 3,
  questionCount: 15,
};

const levelReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'CHANGE_LEVEL':
      return {...state, currentLevel: action.level};
    case 'INCREASE_LEVEL':
      return {...state, currentLevel: state.currentLevel + 1};
    case 'CHANGE_QUESTION':
      return {...state, currentQuestion: action.question};
    case 'INCREASE_QUESTION':
      return {...state, currentQuestion: state.currentQuestion + 1};
    default:
      return state;
  }
};

export default levelReducer;
