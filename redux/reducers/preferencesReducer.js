const INITIAL_STATE = {
  music: true,
  soundEffects: true,
};

const preferencesReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SWITCH_MUSIC':
      return {...state, music: !state.music};
    case 'SWITCH_SOUND_EFFECTS':
      return {...state, soundEffects: !state.soundEffects};
    default:
      return state;
  }
};

export default preferencesReducer;
