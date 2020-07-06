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

const width = parseInt(Dimensions.get('screen').width, 10) / 360;
const height = parseInt(Dimensions.get('screen').height, 10) / 640;

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timer: this.UrgeWithPleasureComponent(),
      playing: true,
      life: 5,
      score: 120,
      givenAnswer: '',
      removedOptions: [],
      fiftyUsed: false,
      double: false,
      doubleUsed: false,
      skipUsed: false,
      starCount: 0,
      showModal: false,
      modalRightText: 'Tekrar',
    };
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

  answerCallback = isTrue => {
    const {decreaseLife} = this.props;
    const {double, givenAnswer} = this.state;

    if (double) {
      this.useDouble(isTrue, givenAnswer);
    } else {
      isTrue ? null : decreaseLife();
      this.updateScoreAndLife(isTrue);
      this.goToNextQuestion();
    }
  };

  updateScoreAndLife = isTrue => {
    this.setState(prevState => ({
      score: isTrue ? prevState.score + 2 : prevState.score,
      life: isTrue
        ? prevState.life
        : prevState.life > 0
        ? prevState.life - 1
        : prevState.life,
    }));
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
      this.setState({showModal: true});
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
      return {backgroundColor: '#30E3CA'};
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
      showModal,
      starCount,
      modalRightText,
    } = this.state;
    const {level, navigation, increaseQuestion} = this.props;
    const {currentLevel: cl, currentQuestion: cq} = level;
    const question = levels[cl][cq];
    return (
      <View style={styles.container}>
        <Modal style={styles.modal} isVisible={showModal}>
          <View style={styles.modalView}>
            <View style={styles.modalSuccessView}>
              <Image
                style={styles.modalSuccessImage}
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
            <View style={styles.modalScoreView}>
              <Image style={styles.modalTrophyImage} source={{uri: 'trophy'}} />
              <Text style={styles.modalScoreText}>{score}</Text>
            </View>
            <View style={styles.modalButtonsView}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({showModal: false});
                  navigation.goBack();
                }}>
                <View style={styles.modalHomepage}>
                  <Image
                    style={styles.modalButtonLeftImage}
                    source={{uri: 'arrow_left'}}
                  />
                  <Text style={styles.modalHomepageText}>Anasayfa</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity>
                <View style={styles.modalHomepage}>
                  <Text style={styles.modalRightText}>{modalRightText}</Text>
                  <Image
                    style={styles.modalButtonRightImage}
                    source={{uri: 'arrow_right'}}
                  />
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
    backgroundColor: '#30E3CA',
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
    backgroundColor: '#30E3CA',
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
    backgroundColor: '#30E3CA',
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
  modal: {
    width: 325 * width,
    height: 238 * height,
    alignSelf: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: 325 * width,
    height: 238 * height,
    borderRadius: 20,
    backgroundColor: '#11999E',
  },
  modalSuccessView: {
    width: 325 * width,
    height: 57 * height,
    marginTop: 19 * height,
    alignSelf: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  modalSuccessImage: {
    width: 139 * width,
    height: 57 * height,
    alignSelf: 'center',
  },
  modalScoreView: {
    width: 130 * width,
    height: 46 * height,
    marginTop: 32 * height,
    alignSelf: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  modalTrophyImage: {
    width: 46 * width,
    height: 46 * height,
  },
  modalScoreText: {
    color: '#FFF',
    fontFamily: 'Molle-Italic',
    fontSize: 40,
    alignSelf: 'center',
    marginTop: 5 * height,
    textAlign: 'right',
  },
  modalButtonsView: {
    width: 325 * width,
    height: 34 * height,
    marginTop: 18 * height,
    alignSelf: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  modalHomepage: {
    width: 134 * width,
    height: 34 * height,
    flexDirection: 'row',
  },

  modalButtonLeftImage: {width: 27 * width, height: 34 * height},
  modalHomepageText: {
    color: '#FFF',
    fontSize: 27,
    marginTop: 5 * height,
    fontFamily: 'Molle-Italic',
    marginLeft: 3 * width,
  },
  modalButtonRightImage: {width: 27 * width, height: 34 * height},
  modalRightText: {
    color: '#FFF',
    fontSize: 27,
    fontFamily: 'Molle-Italic',
    marginTop: 5 * height,
    marginLeft: 32 * width,
    marginRight: 3 * width,
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
    increaseHeart: () => dispatch(increaseLifeAction()),
    decreaseLife: () => dispatch(decreaseLifeAction()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Game);
