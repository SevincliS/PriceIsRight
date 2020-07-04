const INITIAL_STATE = {
  currentLevel: 0,
  currentQuestion: 0,
  levelCount: 3,
  questionCount: 15,
  level: 15,
  heart: 5,
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
    case 'INCREASE_HEART':
      return {...state, heart: state.heart < 5 ? state.heart + 1 : state.heart};
    case 'DECREASE_HEART':
      return {...state, heart: state.heart > 0 ? state.heart - 1 : state.heart};
    default:
      return state;
  }
};

export default levelReducer;