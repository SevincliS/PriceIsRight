import {StyleSheet, Dimensions} from 'react-native';
const width = parseInt(Dimensions.get('screen').width, 10) / 360;
const height = parseInt(Dimensions.get('screen').height, 10) / 640;

export default StyleSheet.create({
  container: {
    justifyContent: 'center',
    backgroundColor: '#E4F9F5',
    flex: 1,
  },

  adModalContainer: {
    backgroundColor: '#DDDDDD',
    width: 324 * width,
    height: 286 * height,
    borderRadius: 4 * width,
  },
  adModalStars: {
    position: 'absolute',
    top: 31 * height,
    left: 93 * width,
    width: 139 * width,
    height: 57 * height,
  },
  closeButton: {
    width: 32 * width,
    height: 32 * height,
  },
  closeButtonView: {
    marginBottom: 82 * height,
    width: 32 * width,
    height: 32 * height,
    alignSelf: 'flex-end',
    marginTop: 16 * height,
    marginRight: 23 * width,
  },
  goToHomeHighlight: {
    backgroundColor: '#B25100',
    width: 277 * width,
    height: 59 * height,
    alignSelf: 'center',
    borderRadius: 5 * width,
    marginBottom: 14 * height,
  },
  goToHomeButton: {
    flexDirection: 'row',
    backgroundColor: '#DA7622',
    width: 277 * width,
    height: 59 * height,
    alignSelf: 'center',
    justifyContent: 'flex-start',
    borderRadius: 5 * width,
    marginBottom: 14 * height,
  },
  goToAdButton: {
    flexDirection: 'row',
    backgroundColor: '#C08917',
    width: 277 * width,
    height: 59 * height,
    alignSelf: 'center',
    justifyContent: 'flex-start',
    borderRadius: 5 * width,
  },
  goToAdHighlight: {
    backgroundColor: '#926508',
    width: 277 * width,
    height: 59 * height,
    alignSelf: 'center',
    borderRadius: 5 * width,
  },
  adIcon: {
    width: 31 * width,
    height: 25 * height,
    marginLeft: 23 * width,
    alignSelf: 'center',
  },
  homeIcon: {
    width: 32 * width,
    height: 32 * height,
    alignSelf: 'center',
    marginLeft: 23 * width,
  },
  adModalTextView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 22 * width,
  },
  adModalText: {
    color: '#ffffff',
    textAlign: 'left',
    fontSize: 16 * width,
  },
  image: {
    width: 240 * width,
    height: 240 * height,
  },
  backButton: {
    width: 53 * width,
    height: 53 * width,
    borderRadius: 53 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 12 * width,
    height: 20 * height,
    marginLeft: -3 * width,
    marginTop: -1 * height,
  },
  countDownInner: {
    width: 50 * width,
    height: 50 * width,
    borderRadius: 50 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 32 * width,
    marginTop: 10 * height,
  },
  imageView: {
    height: 205 * height,
    width: 296 * width,
    marginLeft: 32 * width,
    borderRadius: 8 * width,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 7,
  },
  infoView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 270 * width,
    height: 22 * height,
    marginHorizontal: 45 * width,
    marginTop: 18 * height,
  },
  lifeImage: {
    width: 21 * width,
    height: 19 * height,
    marginRight: 4 * width,
  },
  lifeView: {
    flexDirection: 'row',
  },
  scoreText: {
    fontFamily: 'roboto',
    fontSize: 19,
    textAlign: 'right',
  },
  questionView: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 296 * width,
    height: 44 * height,
    marginTop: 18 * height,
    marginLeft: 32 * width,
    borderRadius: 9 * width,
    backgroundColor: '#35B0AB',
  },
  questionText: {
    fontFamily: 'roboto',
    fontSize: 16,
    color: '#fff',
  },
  firstAnswerRow: {flexDirection: 'row', marginTop: 20 * height},
  a: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#35B0AB',
    borderRadius: 9,
    width: 130 * width,
    height: 45 * height,
    paddingHorizontal: 41 * width,
    paddingVertical: 13 * height,
    marginLeft: 32 * width,
  },
  secondAnswerRow: {
    flexDirection: 'row',
    marginTop: 20 * height,
  },
  jokerView: {
    flexDirection: 'row',
    marginTop: 17 * height,
    backgroundColor: '#11999E',
  },
  answerText: {
    color: '#fff',
    fontSize: 16,
    width: 60 * width,
    textAlign: 'center',
  },
  joker: {
    alignItems: 'center',
    justifyContent: 'space-around',
    width: 119 * width,
    height: 70 * height,
  },
  jokerImage: {
    width: 64 * width,
    height: 25 * height,
    marginTop: -10 * height,
    marginBottom: 10 * height,
    borderRadius: 5 * width,
    resizeMode: 'contain',
  },
  jokerText: {
    color: '#FFF',
    fontSize: 19,
    marginBottom: 5 * height,
  },
  separatorView: {
    marginTop: 17 * height,
    width: 1 * width,
    height: 30 * height,
  },
  separator: {
    width: 1 * width,
    height: 30 * height,
    resizeMode: 'contain',
  },
  adModal: {
    width: 324 * width,
    height: 286 * height,
    flex: 1,
  },
  scoreModal: {
    width: 325 * width,
    height: 238 * height,
    alignSelf: 'center',
    alignItems: 'center',
  },
  scoreModalView: {
    width: 325 * width,
    height: 238 * height,
    borderRadius: 20,
    backgroundColor: '#11999E',
  },
  scoreModalSuccessView: {
    width: 325 * width,
    height: 57 * height,
    marginTop: 19 * height,
    alignSelf: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  scoreModalSuccessImage: {
    width: 139 * width,
    height: 57 * height,
    alignSelf: 'center',
  },
  scoreModalScoreView: {
    width: 130 * width,
    height: 46 * height,
    marginTop: 32 * height,
    alignSelf: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  scoreModalTrophyImage: {
    width: 46 * width,
    height: 46 * height,
  },
  scoreModalScoreText: {
    color: '#FFF',
    fontFamily: 'Molle-Italic',
    fontSize: 40,
    alignSelf: 'center',
    marginTop: 5 * height,
    textAlign: 'right',
  },
  scoreModalButtonsView: {
    width: 325 * width,
    height: 34 * height,
    marginTop: 18 * height,
    alignSelf: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  scoreModalHomepage: {
    width: 160 * width,
    height: 34 * height,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  scoreModalButtonLeftImage: {width: 27 * width, height: 34 * height},
  scoreModalHomepageText: {
    color: '#FFF',
    fontSize: 27,
    marginTop: 5 * height,
    fontFamily: 'Molle-Italic',
    marginLeft: 3 * width,
  },
  scoreModalButtonRightImage: {width: 27 * width, height: 34 * height},
  scoreModalRightText: {
    color: '#FFF',
    fontSize: 27,
    fontFamily: 'Molle-Italic',
    marginTop: 5 * height,
    marginLeft: 32 * width,
    marginRight: 3 * width,
  },
  adModalImage: {
    width: 324,
    height: 286,
  },
  adModalContinueView: {
    marginTop: 12 * height,
    height: 23 * height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adModalContinueText: {fontSize: 20, fontFamily: 'roboto', color: '#FFB41A'},
  adModalLeftButton: {
    width: 277 * width,
    height: 59 * height,
    borderRadius: 5,
    borderWidth: 1,
    position: 'absolute',
    top: 130 * height,
    left: 24 * width,
  },

  adModalRightButton: {
    width: 277 * width,
    height: 59 * height,
    borderRadius: 5,
    borderWidth: 1,
    position: 'absolute',
    top: 203 * height,
    left: 24 * width,
  },
  adModalCloseButton: {
    width: 32 * width,
    height: 32 * height,
    borderRadius: 4,
    borderWidth: 1,
    position: 'absolute',
    top: 16 * height,
    left: 268 * width,
  },
  goBackModalView: {
    width: width * 325,
    height: height * 198,
    borderRadius: 20,
    backgroundColor: '#26A5A7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  goBackModalQuestionsView: {
    justifyContent: 'flex-start',
  },
  goBackModalQuestion: {
    fontFamily: 'Roboto-Regular',
    fontSize: 20,
    color: '#fff',
  },
  goBackModalInfo: {
    fontFamily: 'Roboto-LightItalic',
    fontSize: 16,
    color: '#fff',
    fontWeight: '300',
  },
  goBackModalButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 26 * height,
    height: 49 * height,
  },
  goBackModalYes: {
    width: width * 137,
    height: height * 49,
    borderRadius: 6,
    backgroundColor: '#10D454',
    alignItems: 'center',
    justifyContent: 'center',
  },
  goBackModalYesText: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Roboto-Regular',
  },
  goBackModalNo: {
    marginLeft: 14 * width,
    width: width * 137,
    height: height * 49,
    borderRadius: 6,
    backgroundColor: '#D40D20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  goBackModalNoText: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Roboto-Regular',
  },
});
