const INITIAL_STATE = {
  styles: {
    blue: {
      mainColor: '#E4F9F5',
      secondaryColor: '#11999E',
      thirdColor: '#35B0AB',
      holdOnAnswer: '#40514E',
      levelsHeader: '#C4FEF3',
      optionModalBG: '#26A5A7',
      optionModalSoundLeft: '#477A70',
      optionModalSoundRight: '#A5EDDF',
    },
    red: {
      mainColor: '#FF4545',
      secondaryColor: '#FF9867',
      thirdColor: '#FF9867',
      holdOnAnswer: '#FFEDB2',
      levelsHeader: '#F00000',
      optionModalBG: '#F00000',
      optionModalSoundLeft: '#FF4545',
      optionModalSoundRight: '#FF9867',
    },
    black: {
      mainColor: '#525252',
      secondaryColor: '#313131',
      thirdColor: '#313131',
      holdOnAnswer: '#EC625F',
      levelsHeader: '#313131',
      optionModalBG: '#40514E',
      optionModalSoundLeft: '#525252',
      optionModalSoundRight: '#313131',
    },
    creme: {
      mainColor: '#FAFFB8',
      secondaryColor: '#226B80',
      thirdColor: '#35B0AB',
      holdOnAnswer: '#226B80',
      levelsHeader: '#226B80',
      optionModalBG: '#226B80',
      optionModalSoundLeft: '#215E70',
      optionModalSoundRight: '#FAFFB8',
    },
    yellow: {
      mainColor: '#FFFE9F',
      secondaryColor: '#F56262',
      thirdColor: '#FFD480',
      holdOnAnswer: '#40514E',
      levelsHeader: '#FFD480',
      optionModalBG: '#FFCA62',
      optionModalSoundLeft: '#FFD480',
      optionModalSoundRight: '#FFFE9F',
    },
  },
  selectedStyles: {
    mainColor: '#E4F9F5',
    secondaryColor: '#11999E',
    thirdColor: '#35B0AB',
    holdOnAnswer: '#40514E',
    levelsHeader: '#C4FEF3',
    optionModalBG: '#26A5A7',
    optionModalSoundLeft: '#477A70',
    optionModalSoundRight: '#A5EDDF',
  },
  selectedTheme: 'blue',
};

const themeReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'CHANGE_SELECTED_THEME':
      return {
        ...state,
        selectedTheme: action.theme,
        selectedStyles: state.styles[action.theme],
      };
    default:
      return state;
  }
};

export default themeReducer;
