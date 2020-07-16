/* eslint-disable react-native/no-inline-styles */
import React from 'react';

import {
  View,
  TouchableOpacity,
  Text,
  Image,
  Animated,
  TouchableHighlight,
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
  increaseUserScoreAction,
} from '../redux/actions/levelAction';
import {changeUserLevelAction} from '../redux/actions/userLevelsActions';
import {
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from '@react-native-firebase/admob';
import styles from '../styles/Game.android';

const adUnitId = __DEV__
  ? TestIds.REWARDED
  : 'ca-app-pub-4313673729121143/1131611168';

const rewarded = RewardedAd.createForAdRequest(adUnitId, {
  keywords: ['game', 'playing'],
});

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
    const {level} = props;
    const {life} = level;
    this.state = {
      timer: this.UrgeWithPleasureComponent(true),
      playing: true,
      life,
      score: 0,
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
      rewardType: 'none',
      currentQuestion: 'none',
      usedJokerCount: 0,
      usedKeepGoing: false,
    };
    rewarded.load();
    const {status} = this.props;
    rewarded.requestNonPersonalizedAdsOnly = status;
    this.eventListener = rewarded.onAdEvent((type, error, reward) => {
      if (type === 'closed' && this.state.earned) {
        const {increaseLife} = this.props;
        const {rewardType, doubleUsed, currentQuestion, skipUsed} = this.state;
        if (rewardType === 'life') {
          setTimeout(() => {
            this.setState({usedKeepGoing: true, showAdModal: false});
            increaseLife();
          }, 1);
          this.goToNextQuestion();
        } else if (rewardType === 'fifty') {
          this.increaseJokerCount();
          this.useFifty(currentQuestion);
        } else if (rewardType === 'double') {
          this.increaseJokerCount();
          doubleUsed
            ? null
            : this.setState({
                doubleUsed: true,
                double: true,
              });
        } else if (rewardType === 'skip') {
          this.increaseJokerCount();
          skipUsed ? null : this.goToNextQuestion();
          this.setState({skipUsed: true});
        }
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
        this.resetTimer();
      }
      if (type === RewardedAdEventType.LOADED) {
        this.setState({showRewarded: true});
      }
      if (type === RewardedAdEventType.EARNED_REWARD) {
        this.setState({earned: true, showRewarded: false});
        this.resetTimer();
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
        strokeWidth={5}
        strokeLinecap="square"
        onComplete={() => this.countDownFinished()}
        size={53}
        isPlaying={playing}
        duration={20}
        colors={[['#10D454', 0.33], ['#FF7B1B', 0.33], ['#D40D20']]}>
        {({remainingTime, animatedColor}) => {
          const {theme} = this.props;
          const {selectedStyles, selectedTheme} = theme;
          const {mainColor, secondaryColor} = selectedStyles;
          if (remainingTime === 5 && this.props.soundEffects) {
            this.clockSound.play();
          }
          return (
            <View
              style={{
                ...styles.countDownInner,
                backgroundColor:
                  selectedTheme === 'blue' ? mainColor : secondaryColor,
              }}>
              <Animated.Text
                style={{
                  color: selectedTheme === 'blue' ? 'black' : 'white',
                }}>
                {remainingTime}
              </Animated.Text>
            </View>
          );
        }}
      </CountdownCircleTimer>,
    );

  countDownFinished = () => {
    const {soundEffects} = this.props;
    this.setState({playing: false});
    this.answerCallback(false);
    if (soundEffects) {
      this.wrongSound.play();
    }
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
    const {decreaseLife, navigation} = this.props;
    const {double, givenAnswer, usedKeepGoing} = this.state;
    console.log(isTrue);
    if (double) {
      this.useDouble(isTrue, givenAnswer);
      this.setState({secondAnswerGiven: true});
    } else {
      await this.updateScoreAndLife(isTrue);
      if (!isTrue) {
        this.setState({playing: false});
        if (usedKeepGoing) {
          this.setState({showScoreModal: true});
          let timestamp = await this.getGlobalTime();
          decreaseLife(timestamp);
        } else {
          this.setState({showAdModal: true});
        }
      } else {
        this.goToNextQuestion();
      }
    }
  };

  updateScoreAndLife = async isTrue => {
    const {level, increaseLife, decreaseLife} = this.props;
    const {currentLevel} = level;
    const additionalScore = Math.floor(currentLevel / 5) + 1;
    return new Promise(async (res, rej) => {
      let timestamp = await this.getGlobalTime();
      isTrue ? increaseLife() : decreaseLife(timestamp);
      this.setState(
        prevState => ({
          score: isTrue ? prevState.score + additionalScore : prevState.score,
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

  increaseJokerCount = () => {
    this.setState(prevState => ({
      usedJokerCount: prevState.usedJokerCount + 1,
    }));
  };
  goToNextQuestion = () => {
    const {score, usedJokerCount} = this.state;
    let successRate = usedJokerCount === 0 ? 3 : 3 - usedJokerCount;
    this.setState({starCount: successRate});
    const {
      increaseQuestion,
      level,
      soundEffects,
      increaseTotalUserScore,
      changeUserLevel,
    } = this.props;
    const {currentLevel, currentQuestion, questionCount} = level;
    if (currentQuestion === questionCount - 1) {
      this.setState({showScoreModal: true});
      changeUserLevel(currentLevel, {successRate});
      increaseTotalUserScore(score);
      if (soundEffects) {
        this.levelFinishSound.play();
      }
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

  useFifty = question => {
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

  optionComponent = (option, stateAnswer) => {
    const {level} = this.props;
    const {currentLevel: cl, currentQuestion: cq} = level;
    const question = levels[cl][cq];
    return (
      <TouchableOpacity onPress={() => this.answer(option, stateAnswer)}>
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
    const {level, theme, soundEffects} = this.props;
    const {selectedStyles} = theme;
    const {holdOnAnswerBG, thirdColor} = selectedStyles;
    const {currentLevel: cl, currentQuestion: cq} = level;
    const question = levels[cl][cq];
    if (option === holdOnAnswer) {
      return {backgroundColor: holdOnAnswerBG};
    } else if (doubleOption === option) {
      return {backgroundColor: holdOnAnswerBG, opacity: 0.25};
    } else if (removedOptions.includes(option)) {
      return {opacity: 0.25};
    } else if (option === question.rightAnswer && option === givenAnswer) {
      if (soundEffects) {
        this.correctSound.play();
      }
      return {backgroundColor: '#10D454'};
    } else if (option !== question.rightAnswer && option === givenAnswer) {
      if (soundEffects && !this.state.showAdModal) {
        this.wrongSound.play();
      }
      return {backgroundColor: '#D40D20'};
    } else {
      return {backgroundColor: thirdColor};
    }
  };
  getGlobalTime = () => {
    return new Promise((res, rej) => {
      fetch('http://worldclockapi.com/api/json/utc/now')
        .then(response => response.json())
        .then(data => {
          const {currentDateTime} = data;
          res(new Date(currentDateTime).getTime());
        })
        .catch(err => {
          rej(err);
        });
    });
  };

  render() {
    const {
      timer,
      score,
      fiftyUsed,
      doubleUsed,
      skipUsed,
      showScoreModal,
      showAdModal,
      starCount,
      scoreModalRightText,
      givenAnswer,
    } = this.state;
    const {level, navigation, theme, decreaseLife} = this.props;
    const {currentLevel: cl, currentQuestion: cq, life} = level;
    const question = levels[cl][cq];
    const {selectedStyles} = theme;
    const {mainColor, secondaryColor, thirdColor} = selectedStyles;

    return (
      <View style={{...styles.container, backgroundColor: mainColor}}>
        <Modal style={styles.scoreModal} isVisible={showScoreModal}>
          <View style={{...styles.scoreModalView, backgroundColor: mainColor}}>
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
          <View style={styles.adModalContainer}>
            <Image
              resizeMode={'contain'}
              source={{uri: 'ad_modal_stars'}}
              style={styles.adModalStars}
            />
            <TouchableOpacity
              style={styles.closeButtonView}
              onPress={() => navigation.goBack()}>
              <Image
                resizeMode={'contain'}
                source={{uri: 'close'}}
                style={styles.closeButton}
              />
            </TouchableOpacity>
            <TouchableHighlight
              style={styles.goToHomeHighlight}
              onPress={async () => {
                let timestamp = await this.getGlobalTime();
                decreaseLife(timestamp);
                navigation.goBack();
              }}>
              <View style={styles.goToHomeButton}>
                <Image
                  resizeMode="contain"
                  source={{uri: 'home_icon'}}
                  style={styles.homeIcon}
                />
                <View style={styles.adModalTextView}>
                  <Text style={styles.adModalText}>Anasayfaya Dön</Text>
                </View>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={() => {
                this.setState({rewardType: 'life'});
                rewarded.show();
              }}
              style={styles.goToAdHighlight}>
              <View style={styles.goToAdButton}>
                <Image
                  resizeMode="contain"
                  source={{uri: 'go_to_ad_icon'}}
                  style={styles.adIcon}
                />
                <View style={styles.adModalTextView}>
                  <Text style={styles.adModalText}>
                    Reklam İzle ve Devam Et
                  </Text>
                </View>
              </View>
            </TouchableHighlight>
          </View>
        </Modal>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <View
              style={{...styles.backButton, backgroundColor: secondaryColor}}>
              <Image
                style={styles.backIcon}
                resizeMode={'contain'}
                source={{uri: 'back_icon'}}
              />
            </View>
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
        <View style={{...styles.questionView, backgroundColor: thirdColor}}>
          <Text style={styles.questionText}>{question.text}</Text>
        </View>
        <View style={styles.firstAnswerRow}>
          {this.optionComponent('a', givenAnswer)}
          {this.optionComponent('b', givenAnswer)}
        </View>
        <View style={styles.secondAnswerRow}>
          {this.optionComponent('c', givenAnswer)}
          {this.optionComponent('d', givenAnswer)}
        </View>
        <View style={{...styles.jokerView, backgroundColor: secondaryColor}}>
          <TouchableOpacity
            onPress={() => {
              this.setState({
                rewardType: 'fifty',
                currentQuestion: question,
              });
              rewarded.show();
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
              this.setState({rewardType: 'double'});
              rewarded.show();
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
              this.setState({rewardType: 'skip'});
              rewarded.show();
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
  const {level, theme, preferences} = state;
  const {status} = state.consent;
  return {level, theme, soundEffects: preferences.soundEffects, status};
};
const mapDispatchToProps = dispatch => {
  return {
    changeLevel: level => dispatch(changeLevelAction(level)),
    increaseLevel: () => dispatch(increaseLevelAction()),
    changeQuestion: question => dispatch(changeQuestionAction(question)),
    increaseQuestion: () => dispatch(increaseQuestionAction()),
    increaseLife: () => dispatch(increaseLifeAction()),
    decreaseLife: timestamp => dispatch(decreaseLifeAction(timestamp)),
    increaseTotalUserScore: () => dispatch(increaseUserScoreAction()),
    changeUserLevel: (levelId, newFields) =>
      dispatch(changeUserLevelAction(levelId, newFields)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Game);
