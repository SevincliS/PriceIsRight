const changeLevelAction = level => ({
  type: 'CHANGE_LEVEL',
  level,
});

const increaseLevelAction = () => ({
  type: 'INCREASE_LEVEL',
});

const changeQuestionAction = question => ({
  type: 'CHANGE_QUESTION',
  question,
});

const increaseQuestionAction = () => ({
  type: 'INCREASE_QUESTION',
});

const decreaseLifeAction = timestamp => ({
  type: 'DECREASE_LIFE',
  timestamp,
});

const increaseLifeAction = () => ({
  type: 'INCREASE_LIFE',
});

const increaseUserScoreAction = score => ({
  type: 'INCREASE_USER_SCORE',
  score,
});

const updateLifeAction = life => ({
  type: 'UPDATE_LIFE',
  life,
});

export {
  changeLevelAction,
  increaseLevelAction,
  changeQuestionAction,
  increaseQuestionAction,
  decreaseLifeAction,
  increaseLifeAction,
  increaseUserScoreAction,
  updateLifeAction,
};
