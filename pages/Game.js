/* eslint-disable react-native/no-inline-styles */
import React from 'react';

import {
  View,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import {connect} from 'react-redux';
import {CountdownCircleTimer} from 'react-native-countdown-circle-timer';
import levels from '../levels';
import Modal from 'react-native-modal';

import {
  changeLevelAction,
  increaseLevelAction,
  changeQuestionAction,
  increaseQuestionAction,
  increaseLifeAction,
  decreaseLifeAction,
} from '../redux/actions/levelAction';
import {
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from '@react-native-firebase/admob';

const adUnitId = __DEV__
  ? TestIds.REWARDED
  : 'ca-app-pub-4313673729121143/1131611168';

const rewarded = RewardedAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
  keywords: ['game', 'playing'],
});

const width = parseInt(Dimensions.get('screen').width, 10) / 360;
const height = parseInt(Dimensions.get('screen').height, 10) / 640;

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timer: this.UrgeWithPleasureComponent(),
      playing: true,
      life: 1,
      score: 120,
      givenAnswer: '',
      removedOptions: [],
      fiftyUsed: false,
      double: false,
      doubleUsed: false,
      skipUsed: false,
      starCount: 0,
      showScoreModal: false,
      scoreModalRightText: 'Tekrar',
      showAdModal: false,
    };

    rewarded.load();

    this.eventListener = rewarded.onAdEvent((type, error, reward) => {
      if (type === 'closed' && this.state.earned) {
        const {increaseLife} = this.props;
        increaseLife();
        this.setState({
          showScoreModal: false,
        });
        rewarded.load();
      }
      if (type === 'closed' && !this.state.earned) {
        rewarded.load();
        this.setState({
          modalText: 'Yeterince izlemediğin için ödülü alamadınn!',
        });
      }
      if (type === RewardedAdEventType.LOADED) {
        this.setState({showRewarded: true});
      }
      if (type === RewardedAdEventType.EARNED_REWARD) {
        this.setState({earned: true, showRewarded: false});
      }
    });
  }

  UrgeWithPleasureComponent = () =>
    React.cloneElement(
      <CountdownCircleTimer
        strokeWidth={3}
        strokeLinecap="square"
        onComplete={() => this.countDownFinished()}
        size={53}
        isPlaying
        duration={20}
        colors={[['#10D454', 0.33], ['#FF7B1B', 0.33], ['#D40D20']]}>
        {({remainingTime, animatedColor}) => (
          <Animated.Text style={{color: animatedColor}}>
            {remainingTime}
          </Animated.Text>
        )}
      </CountdownCircleTimer>,
    );

  countDownFinished = () => {
    this.setState({playing: false});
    this.answerCallback(false);
  };

  componentWillUnmount() {
    const {changeQuestion} = this.props;
    changeQuestion(0);
  }

  displayLifes = life => {
    const usedLife = 5 - life;
    let lifes = [];
    for (let i = 0; i < 5; i++) {
      lifes.push(
        <Image
          style={styles.lifeImage}
          source={{uri: i < usedLife ? 'black_heart' : 'heart'}}
        />,
      );
    }
    return lifes;
  };
  //TODO wrong answer callback'inde modal getirt.
  answer = (givenAnswer, stateAnswer) => {
    const {removedOptions} = this.state;
    if (stateAnswer !== '' || removedOptions.includes(givenAnswer)) {
      return;
    }
    const {level} = this.props;
    const {currentLevel: cl, currentQuestion: cq} = level;
    const question = levels[cl][cq];
    this.setState({holdOnAnswer: givenAnswer}, () => {
      setTimeout(() => {
        this.setState({holdOnAnswer: ''});
      }, 1000);
    });
    this.setState({givenAnswer});
    setTimeout(() => {
      this.answerCallback(givenAnswer === question.rightAnswer);
    }, 2500);
  };

  answerCallback = async isTrue => {
    const {decreaseLife} = this.props;
    const {double, givenAnswer} = this.state;

    if (double) {
      this.useDouble(isTrue, givenAnswer);
    } else {
      await this.updateScoreAndLife(isTrue);
      const {life} = this.state;
      console.log(life);
      if (!isTrue && life === 0) {
        this.setState({showAdModal: true});
      } else if (!isTrue) {
        this.setState({playing: false});
        decreaseLife();
        this.goToNextQuestion();
      }
    }
  };

  updateScoreAndLife = async isTrue => {
    return new Promise((res, rej) => {
      this.setState(
        prevState => ({
          score: isTrue ? prevState.score + 2 : prevState.score,
          life: isTrue
            ? prevState.life
            : prevState.life > 0
            ? prevState.life - 1
            : prevState.life,
        }),
        () => {
          res();
        },
      );
    });
  };

  useDouble = (isTrue, givenAnswer) => {
    if (isTrue) {
      this.goToNextQuestion();
    } else {
      this.setState({
        doubleOption: givenAnswer,
        doubleUsed: true,
        givenAnswer: '',
        double: false,
      });
    }
  };

  goToNextQuestion = () => {
    const {increaseQuestion, level} = this.props;
    if (level.currentQuestion === level.questionCount - 1) {
      this.setState({showScoreModal: true});
    }
    this.resetTimer(this.resetOptionViews, increaseQuestion);
  };

  resetTimer = (...functions) => {
    this.setState({timer: null}, () => {
      functions.forEach(f => f());
      this.setState({timer: this.UrgeWithPleasureComponent()});
    });
  };

  resetOptionViews = () => {
    this.setState({givenAnswer: '', doubleOption: '', removedOptions: []});
  };

  onPressFifty = question => {
    const {fiftyUsed} = this.state;
    let randVal = Math.floor(Math.random() * 3);
    fiftyUsed
      ? null
      : this.setState({
          fiftyUsed: true,
          //remove two random options that are not the right answer
          removedOptions: ['a', 'b', 'c', 'd']
            .filter(el => el !== question.rightAnswer)
            .filter((_, i) => {
              return i !== randVal;
            }),
        });
  };

  optionComponent = option => {
    const {givenAnswer} = this.state;
    const {level} = this.props;
    const {currentLevel: cl, currentQuestion: cq} = level;
    const question = levels[cl][cq];
    return (
      <TouchableOpacity onPress={() => this.answer(option, givenAnswer)}>
        <View
          style={{
            ...styles.a,
            ...this.getOptionView(option),
          }}>
          <Text style={styles.answerText}>{question[option]}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  getOptionView = option => {
    const {
      givenAnswer,
      doubleOption,
      holdOnAnswer,
      removedOptions,
    } = this.state;
    const {level} = this.props;
    const {currentLevel: cl, currentQuestion: cq} = level;
    const question = levels[cl][cq];
    if (option === holdOnAnswer) {
      return {backgroundColor: '#40514E'};
    } else if (doubleOption === option) {
      return {backgroundColor: '#40514E', opacity: 0.25};
    } else if (removedOptions.includes(option)) {
      return {opacity: 0.25};
    } else if (option === question.rightAnswer && option === givenAnswer) {
      return {backgroundColor: '#10D454'};
    } else if (option !== question.rightAnswer && option === givenAnswer) {
      return {backgroundColor: '#D40D20'};
    } else {
      return {backgroundColor: '#35B0AB'};
    }
  };

  render() {
    const {
      timer,
      score,
      life,
      fiftyUsed,
      doubleUsed,
      skipUsed,
      showScoreModal,
      showAdModal,
      starCount,
      scoreModalRightText,
    } = this.state;
    const {level, navigation, increaseQuestion} = this.props;
    const {currentLevel: cl, currentQuestion: cq} = level;
    const question = levels[cl][cq];
    return (
      <View style={styles.container}>
        <Modal style={styles.scoreModal} isVisible={showScoreModal}>
          <View style={styles.scoreModalView}>
            <View style={styles.scoreModalSuccessView}>
              <Image
                style={styles.scoreModalSuccessImage}
                source={{
                  uri:
                    starCount === 0
                      ? 'no_star'
                      : starCount === 1
                      ? 'one_star'
                      : starCount === 2
                      ? 'two_star'
                      : 'three_star',
                }}
              />
            </View>
            <View style={styles.scoreModalScoreView}>
              <Image
                style={styles.scoreModalTrophyImage}
                source={{uri: 'trophy'}}
              />
              <Text style={styles.scoreModalScoreText}>{score}</Text>
            </View>
            <View style={styles.scoreModalButtonsView}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({showScoreModal: false});
                  navigation.goBack();
                }}>
                <View style={styles.scoreModalHomepage}>
                  <Image
                    style={styles.scoreModalButtonLeftImage}
                    source={{uri: 'arrow_left'}}
                  />
                  <Text style={styles.scoreModalHomepageText}>Anasayfa</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity>
                <View style={styles.scoreModalHomepage}>
                  <Text style={styles.scoreModalRightText}>
                    {scoreModalRightText}
                  </Text>
                  <Image
                    style={styles.scoreModalButtonRightImage}
                    source={{uri: 'arrow_right'}}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal style={styles.scoreModal} isVisible={showAdModal}>
          <View style={styles.scoreModalView}>
            <View style={styles.adModalImageView}>
              <Image style={styles.adModalImage} source={{uri: 'watch_ad'}} />
            </View>
            <View style={styles.adModalContinueView}>
              <Text style={styles.adModalContinueText}>
                Kaldığın yerden devam et
              </Text>
            </View>
            <View style={styles.adModalButtonsView}>
              <View style={styles.adModalLeftButton}>
                <Text style={styles.adModalLeftButtonText}>Anasayfa</Text>
              </View>
              <TouchableOpacity onPress={() => rewarded.show()}>
                <View style={styles.adModalRightButton}>
                  <Text style={styles.adModalRightButtonText}>Reklam İzle</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <Image style={styles.backButton} source={{uri: 'back_button'}} />
          </TouchableOpacity>
          {timer}
        </View>
        <View style={styles.imageView}>
          <Image
            style={styles.image}
            source={{
              uri: question.url,
            }}
          />
        </View>
        <View style={styles.infoView}>
          <View style={styles.lifeView}>{this.displayLifes(life)}</View>
          <View>
            <Text style={styles.scoreText}> Score: {score}</Text>
          </View>
        </View>
        <View style={styles.questionView}>
          <Text style={styles.questionText}>
            Resimdeki ürünün fiyatı nedir ?
          </Text>
        </View>
        <View style={styles.firstAnswerRow}>
          {this.optionComponent('a')}
          {this.optionComponent('b')}
        </View>
        <View style={styles.secondAnswerRow}>
          {this.optionComponent('c')}
          {this.optionComponent('d')}
        </View>
        <View style={styles.jokerView}>
          <TouchableOpacity
            onPress={() => {
              this.onPressFifty(question);
            }}>
            <View style={{...styles.joker, opacity: fiftyUsed ? 0.25 : 1}}>
              <Text style={styles.jokerText}>50/50</Text>
              <Image style={styles.jokerImage} source={{uri: 'fifty'}} />
            </View>
          </TouchableOpacity>
          <View style={styles.separatorView}>
            <Image style={styles.separator} source={{uri: 'separator'}} />
          </View>
          <TouchableOpacity
            onPress={() => {
              doubleUsed
                ? null
                : this.setState({doubleUsed: true, double: true});
            }}>
            <View style={{...styles.joker, opacity: doubleUsed ? 0.25 : 1}}>
              <Text style={styles.jokerText}>2X</Text>
              <Image
                style={styles.jokerImage}
                source={{uri: 'double_chance'}}
              />
            </View>
          </TouchableOpacity>
          <View style={styles.separatorView}>
            <Image style={styles.separator} source={{uri: 'separator'}} />
          </View>
          <TouchableOpacity
            onPress={() => {
              skipUsed ? null : increaseQuestion();
              this.setState({skipUsed: true});
            }}>
            <View style={{...styles.joker, opacity: skipUsed ? 0.25 : 1}}>
              <Text style={styles.jokerText}>SKIP</Text>
              <Image
                style={styles.jokerImage}
                source={{uri: 'skip_question'}}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    backgroundColor: '#E4F9F5',
  },
  image: {
    width: 100 * width,
    height: 190 * height,
    resizeMode: 'contain',
  },
  backButton: {
    width: 53 * width,
    height: 53 * height,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 32 * width,
    marginTop: 22 * height,
    marginBottom: 13 * height,
  },
  imageView: {
    height: 205 * height,
    width: 296 * width,
    marginLeft: 32 * width,
    borderRadius: 8 * width,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
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
  b: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#35B0AB',
    borderRadius: 9,
    width: 130 * width,
    height: 45 * height,
    paddingHorizontal: 41 * width,
    paddingVertical: 13 * height,
    marginLeft: 36 * width,
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
    width: 134 * width,
    height: 34 * height,
    flexDirection: 'row',
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
  adModalImageView: {
    height: 94 * height,
    marginTop: 13 * height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adModalImage: {
    width: 94,
    height: 94,
  },
  adModalContinueView: {
    marginTop: 12 * height,
    height: 23 * height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adModalContinueText: {fontSize: 20, fontFamily: 'roboto', color: '#FFB41A'},
  adModalButtonsView: {
    marginTop: 26 * height,
    width: 259 * width,
    marginLeft: 33 * width,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  adModalLeftButton: {
    width: 110 * width,
    height: 38 * height,
    borderRadius: 9,
    opacity: 0.75,
    borderWidth: 1,
    borderColor: '#FF841A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  adModalLeftButtonText: {fontFamily: 'roboto', fontSize: 20, color: '#FBA129'},

  adModalRightButton: {
    width: 110 * width,
    height: 38 * height,
    borderRadius: 9,
    backgroundColor: '#FFB41A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  adModalRightButtonText: {
    fontFamily: 'roboto',
    fontSize: 20,
    color: '#FFFFFF',
  },
});

const mapStateToProps = state => {
  const {level} = state;
  return {level};
};
const mapDispatchToProps = dispatch => {
  return {
    changeLevel: level => dispatch(changeLevelAction(level)),
    increaseLevel: () => dispatch(increaseLevelAction()),
    changeQuestion: question => dispatch(changeQuestionAction(question)),
    increaseQuestion: () => dispatch(increaseQuestionAction()),
    increaseLife: () => dispatch(increaseLifeAction()),
    decreaseLife: () => dispatch(decreaseLifeAction()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Game);
