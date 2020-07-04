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

const decreaseHeartAction = () => ({
  type: 'INCREASE_HEART',
});

const increaseHeartAction = () => ({
  type: 'INCREASE_HEART',
});

export {
  changeLevelAction,
  increaseLevelAction,
  changeQuestionAction,
  increaseQuestionAction,
  decreaseHeartAction,
  increaseHeartAction,
};
