import React from 'react';

import {
  View,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  Animated,
} from 'react-native';
import {connect} from 'react-redux';
import {CountdownCircleTimer} from 'react-native-countdown-circle-timer';
import levelInfo from '../levelInfo';

import {
  changeLevelAction,
  increaseLevelAction,
  changeQuestionAction,
  increaseQuestionAction,
  increaseHeartAction,
  decreaseHeartAction,
} from '../redux/actions/levelAction';

class Game extends React.Component {
  constructor(props) {
    super(props);
    const {level} = props;
    const {currentLevel: cl, currentQuestion: cq} = level;
    const product = levelInfo[cl][cq];
    console.log(product.url);
    this.state = {
      timer: this.UrgeWithPleasureComponent(),
      playing: true,
      heart: 5,
      score: 0,
      givenAnswer: '',
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
        colors={[['#004777', 0.33], ['#F7B801', 0.33], ['#A30000']]}>
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

  displayHearts = heart => {
    const blackHeart = 5 - heart;
    let hearts = [];
    for (let i = 0; i < blackHeart; i++) {
      hearts.push(
        <Image style={styles.heartImage} source={{uri: 'black_heart'}} />,
      );
    }
    for (let i = 0; i < heart; i++) {
      hearts.push(<Image style={styles.heartImage} source={{uri: 'heart'}} />);
    }
    [];
    return hearts;
  };

  answer = givenAnswer => {
    const {level} = this.props;
    const {currentLevel: cl, currentQuestion: cq} = level;
    const product = levelInfo[cl][cq];
    this.setState({holdOnAnswer: givenAnswer}, () => {
      setTimeout(() => {
        this.setState({holdOnAnswer: ''});
      }, 500);
    });
    this.setState({givenAnswer});
    setTimeout(() => {
      this.answerCallback(givenAnswer === product.rightAnswer);
    }, 2000);
  };

  answerCallback = isTrue => {
    const {decreaseHeart} = this.props;
    isTrue ? null : decreaseHeart();
    this.setState(prevState => ({
      score: isTrue
        ? prevState.score + 2
        : prevState.score > 0
        ? prevState.score - 1
        : prevState.score,
      heart: isTrue
        ? prevState.heart
        : prevState.heart > 0
        ? prevState.heart - 1
        : prevState.heart,
    }));
    const {increaseQuestion} = this.props;
    this.setState({timer: null, givenAnswer: ''}, () => {
      increaseQuestion();
      this.setState({timer: this.UrgeWithPleasureComponent()});
    });
  };

  getBackgroundColor = option => {
    const {givenAnswer, holdOnAnswer} = this.state;
    const {level} = this.props;
    const {currentLevel: cl, currentQuestion: cq} = level;
    const product = levelInfo[cl][cq];
    if (option === holdOnAnswer) {
      return '#40514E';
    } else if (option === product.rightAnswer && option === givenAnswer) {
      return '#10D454';
    } else if (option !== product.rightAnswer && option === givenAnswer) {
      return '#D40D20';
    } else {
      return '#30E3CA';
    }
  };

  render() {
    const {level, navigation} = this.props;
    const {currentLevel: cl, currentQuestion: cq} = level;
    const product = levelInfo[cl][cq];
    const {timer, score, givenAnswer, heart} = this.state;
    return (
      <View style={styles.container}>
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
              uri: product.url,
            }}
          />
        </View>
        <View style={styles.infoView}>
          <View style={styles.heartsView}>{this.displayHearts(heart)}</View>
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
          <TouchableOpacity
            onPress={() => (givenAnswer === '' ? this.answer('a') : null)}>
            <View
              style={{
                ...styles.a,
                backgroundColor: this.getBackgroundColor('a'),
              }}>
              <Text style={styles.answerText}>{product.a}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => (givenAnswer === '' ? this.answer('b') : null)}>
            <View
              style={{
                ...styles.a,
                backgroundColor: this.getBackgroundColor('b'),
              }}>
              <Text style={styles.answerText}>{product.b}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.secondAnswerRow}>
          <TouchableOpacity
            onPress={() => (givenAnswer === '' ? this.answer('c') : null)}>
            <View
              style={{
                ...styles.a,
                backgroundColor: this.getBackgroundColor('c'),
              }}>
              <Text style={styles.answerText}>{product.c}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => (givenAnswer === '' ? this.answer('d') : null)}>
            <View
              style={{
                ...styles.a,
                backgroundColor: this.getBackgroundColor('d'),
              }}>
              <Text style={styles.answerText}>{product.d}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.jokerView}>
          <View style={styles.joker}>
            <Text style={styles.jokerText}>50/50</Text>
            <Image style={styles.jokerImage} source={{uri: 'fifty'}} />
          </View>
          <View style={styles.separatorView}>
            <Image style={styles.separator} source={{uri: 'separator'}} />
          </View>
          <View style={styles.joker}>
            <Text style={styles.jokerText}>2X</Text>
            <Image style={styles.jokerImage} source={{uri: 'double_chance'}} />
          </View>
          <View style={styles.separatorView}>
            <Image style={styles.separator} source={{uri: 'separator'}} />
          </View>
          <View style={styles.joker}>
            <Text style={styles.jokerText}>SKIP</Text>
            <Image style={styles.jokerImage} source={{uri: 'skip_question'}} />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E4F9F5',
  },
  image: {
    width: 100,
    height: 190,
    resizeMode: 'contain',
  },
  backButton: {
    width: 53,
    height: 53,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 32,
    marginTop: 22,
    marginBottom: 13,
  },
  imageView: {
    height: 205,
    width: 296,
    marginLeft: 32,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginTop: 7,
  },
  infoView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 270,
    height: 22,
    marginLeft: 45,
    marginRight: 45,
    marginTop: 18,
  },
  heartImage: {
    width: 21,
    height: 19,
    marginRight: 4,
  },
  heartsView: {
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
    width: 296,
    height: 44,
    marginTop: 18,
    marginLeft: 32,
    borderRadius: 9,
    backgroundColor: '#30E3CA',
  },
  questionText: {
    fontFamily: 'roboto',
    fontSize: 16,
    color: '#fff',
  },
  firstAnswerRow: {flexDirection: 'row', marginTop: 20},
  a: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#30E3CA',
    borderRadius: 9,
    width: 130,
    height: 45,
    paddingHorizontal: 41,
    paddingVertical: 13,
    marginLeft: 32,
  },
  b: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#30E3CA',
    borderRadius: 9,
    width: 130,
    height: 45,
    paddingHorizontal: 41,
    paddingVertical: 13,
    marginLeft: 36,
  },
  secondAnswerRow: {
    flexDirection: 'row',
    marginTop: 20,
  },
  jokerView: {
    flexDirection: 'row',
    marginTop: 17,
    backgroundColor: '#11999E',
  },
  answerText: {
    color: '#fff',
    fontSize: 16,
  },
  joker: {
    alignItems: 'center',
    justifyContent: 'space-around',
    width: 119,
    height: 70,
  },
  jokerImage: {
    width: 64,
    height: 25,
    marginTop: -10,
    marginBottom: 10,
    borderRadius: 5,
    resizeMode: 'contain',
  },
  jokerText: {
    color: '#FFF',
    fontSize: 19,
    marginBottom: 5,
  },
  separatorView: {
    marginTop: 17,
    width: 1,
    height: 30,
  },
  separator: {
    width: 1,
    height: 30,
    resizeMode: 'contain',
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
    increaseHeart: () => dispatch(increaseHeartAction()),
    decreaseHeart: () => dispatch(decreaseHeartAction()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Game);
