const INITIAL_STATE = {
  currentLevel: 0,
  currentQuestion: 0,
  levelCount: 3,
  questionCount: 15,
  level: 15,
  life: 5,
  score: 0,
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
      return {...state, life: state.life < 5 ? state.life + 1 : state.life};
    case 'DECREASE_LIFE':
      return {...state, life: state.life > 0 ? state.life - 1 : state.life};
    case 'INCREASE_USER_SCORE':
      return {...state, score: state.score + action.score};
    default:
      return state;
  }
};

export default levelReducer;
