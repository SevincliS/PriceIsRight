const changeUserLevel = (levelId, newFields) => ({
  type: 'CHANGE_USER_LEVEL',
  levelId,
  newFields,
});

export {changeUserLevel};
