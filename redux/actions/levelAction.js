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

export {
  changeLevelAction,
  increaseLevelAction,
  changeQuestionAction,
  increaseQuestionAction,
};
