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
  ImageBackground,
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
import styles from '../styles/Game.ios';

const adUnitId = __DEV__
  ? TestIds.REWARDED
  : 'ca-app-pub-4313673729121143/5036278723';

const rewarded = RewardedAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
  keywords: ['game', 'playing'],
});

const width = parseInt(Dimensions.get('screen').width, 10) / 360;
const height = parseInt(Dimensions.get('screen').height, 10) / 640;

var Sound = require('react-native-sound');
Sound.setCategory('Playback');
var Sound1 = require('react-native-sound');
Sound1.setCategory('Playback');
var Sound2 = require('react-native-sound');
Sound2.setCategory('Playback');
var Sound3 = require('react-native-sound');
Sound3.setCategory('Playback');

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timer: this.UrgeWithPleasureComponent(true),
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
      secondAnswerGiven: false,
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

    this.correctSound = new Sound('correct_answer.mp3', Sound.MAIN_BUNDLE);
    this.wrongSound = new Sound1('wrong_answer.mp3', Sound1.MAIN_BUNDLE);
    this.levelFinishSound = new Sound2(
      'level_finish_success.mp3',
      Sound2.MAIN_BUNDLE,
    );
    this.clockSound = new Sound3('ticking_noise.mp3', Sound3.MAIN_BUNDLE);
  }

  UrgeWithPleasureComponent = playing =>
    React.cloneElement(
      <CountdownCircleTimer
        strokeWidth={3}
        strokeLinecap="square"
        onComplete={() => this.countDownFinished()}
        size={53}
        isPlaying={playing}
        duration={20}
        colors={[['#10D454', 0.33], ['#FF7B1B', 0.33], ['#D40D20']]}>
        {({remainingTime, animatedColor}) => {
          if (remainingTime === 5) {
            this.clockSound.play();
          }
          return (
            <Animated.Text style={{color: animatedColor}}>
              {remainingTime}
            </Animated.Text>
          );
        }}
      </CountdownCircleTimer>,
    );

  countDownFinished = () => {
    this.setState({playing: false});
    this.answerCallback(false);
    this.wrongSound.play();
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
          resizeMode={'contain'}
          style={styles.lifeImage}
          source={{uri: i < usedLife ? 'black_heart' : 'heart'}}
        />,
      );
    }
    return lifes;
  };
  //TODO wrong answer callback'inde modal getirt.
  answer = (givenAnswer, stateAnswer) => {
    const {removedOptions, doubleUsed, secondAnswerGiven} = this.state;
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
    if (!doubleUsed) {
      this.setState({
        timer: this.UrgeWithPleasureComponent(false),
      });
    } else if (doubleUsed && secondAnswerGiven) {
      this.setState({
        timer: this.UrgeWithPleasureComponent(false),
      });
    }
    this.clockSound.stop();
    setTimeout(() => {
      this.answerCallback(givenAnswer === question.rightAnswer);
    }, 2500);
  };

  answerCallback = async isTrue => {
    const {decreaseLife} = this.props;
    const {double, givenAnswer} = this.state;

    if (double) {
      this.useDouble(isTrue, givenAnswer);
      this.setState({secondAnswerGiven: true});
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
      } else {
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
      this.levelFinishSound.play();
    }
    this.resetTimer(this.resetOptionViews, increaseQuestion);
  };

  resetTimer = (...functions) => {
    this.setState({timer: null}, () => {
      functions.forEach(f => f());
      this.setState({timer: this.UrgeWithPleasureComponent(true)});
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
      this.correctSound.play();
      return {backgroundColor: '#10D454'};
    } else if (option !== question.rightAnswer && option === givenAnswer) {
      this.wrongSound.play();
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
                resizeMode={'contain'}
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
                resizeMode={'contain'}
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
                    resizeMode={'contain'}
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
                    resizeMode={'contain'}
                    style={styles.scoreModalButtonRightImage}
                    source={{uri: 'arrow_right'}}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal style={styles.adModal} isVisible={showAdModal}>
          <ImageBackground
            resizeMode="contain"
            style={styles.adModalImage}
            source={{uri: 'watch_ad'}}>
            <TouchableOpacity
              style={styles.adModalLeftButton}
              onPress={() => navigation.goBack()}
            />
            <TouchableOpacity
              style={styles.adModalRightButton}
              onPress={() => rewarded.show()}
            />
            <TouchableOpacity
              style={styles.adModalCloseButton}
              onPress={() => navigation.goBack()}
            />
          </ImageBackground>
        </Modal>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <Image
              resizeMode={'contain'}
              style={styles.backButton}
              source={{uri: 'back_button'}}
            />
          </TouchableOpacity>
          {timer}
        </View>
        <View style={styles.imageView}>
          <Image
            resizeMode={'contain'}
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

              <Image
                resizeMode={'contain'}
                style={styles.jokerImage}
                source={{uri: 'fifty'}}
              />
            </View>
          </TouchableOpacity>
          <View style={styles.separatorView}>
            <Image
              resizeMode={'contain'}
              style={styles.separator}
              source={{uri: 'separator'}}
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              doubleUsed
                ? null
                : this.setState({
                    doubleUsed: true,
                    double: true,
                  });
            }}>
            <View style={{...styles.joker, opacity: doubleUsed ? 0.25 : 1}}>
              <Text style={styles.jokerText}>2X</Text>
              <Image
                resizeMode={'contain'}
                style={styles.jokerImage}
                source={{uri: 'double_chance'}}
              />
            </View>
          </TouchableOpacity>
          <View style={styles.separatorView}>
            <Image
              resizeMode={'contain'}
              style={styles.separator}
              source={{uri: 'separator'}}
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              skipUsed ? null : increaseQuestion();
              this.setState({skipUsed: true});
            }}>
            <View style={{...styles.joker, opacity: skipUsed ? 0.25 : 1}}>
              <Text style={styles.jokerText}>SKIP</Text>
              <Image
                resizeMode={'contain'}
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