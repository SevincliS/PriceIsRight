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
} from '../redux/actions/levelAction';
import {HeaderBackButton} from '@react-navigation/stack';

class Game extends React.Component {
  constructor(props) {
    super(props);
    const {level} = props;
    const {currentLevel: cl, currentQuestion: cq} = level;

    console.log(levelInfo[cl][cq].url);
    console.log(cl, cq);
    this.state = {
      timer: this.UrgeWithPleasureComponent(),
      playing: true,
      heart: 5,
      score: 0,
    };
  }
  componentDidUpdate() {
    console.log(this.props);
  }

  UrgeWithPleasureComponent = () =>
    React.cloneElement(
      <CountdownCircleTimer
        onComplete={() => this.setState({playing: false})}
        size={53}
        isPlaying
        duration={2}
        colors={[['#004777', 0.33], ['#F7B801', 0.33], ['#A30000']]}>
        {({remainingTime, animatedColor}) => (
          <Animated.Text style={{color: animatedColor}}>
            {remainingTime}
          </Animated.Text>
        )}
      </CountdownCircleTimer>,
    );

  displayHearts = () => {
    const {heart} = this.state;
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
  render() {
    const {level, changeLevel, increaseQuestion, navigation} = this.props;
    const {currentLevel: cl, currentQuestion: cq} = level;
    const {timer, score} = this.state;
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
              uri: levelInfo[cl][cq].url,
            }}
          />
        </View>
        <View style={styles.infoView}>
          <View style={styles.heartsView}>{this.displayHearts()}</View>
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
          <TouchableOpacity>
            <View style={styles.a}>
              <Text>{levelInfo[cl][cq].a}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={styles.b}>
              <Text>{levelInfo[cl][cq].b}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.secondAnswerRow}>
          <TouchableOpacity>
            <View style={styles.a}>
              <Text>{levelInfo[cl][cq].c}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={styles.b}>
              <Text>{levelInfo[cl][cq].d}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.jokerView}>
          <View style={styles.joker}>
            <Text>50/50</Text>
            <Image style={styles.jokerImage} source={{uri: 'fifty'}} />
          </View>
          <View style={styles.separatorView}>
            <Image style={styles.separator} source={{uri: 'separator'}} />
          </View>
          <View style={styles.joker}>
            <Text>2X</Text>
            <Image style={styles.jokerImage} source={{uri: 'double_chance'}} />
          </View>
          <View style={styles.separatorView}>
            <Image style={styles.separator} source={{uri: 'separator'}} />
          </View>
          <View style={styles.joker}>
            <Text>SKIP</Text>
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
    paddingTop: 5,
    backgroundColor: '#11999E',
  },
  joker: {
    alignItems: 'center',
    justifyContent: 'space-around',
    width: 119,
    height: 70,
  },
  jokerImage: {
    width: 94,
    marginTop: -8,
    height: 65,
    borderRadius: 5,
    resizeMode: 'contain',
  },
  separatorView: {
    marginTop: 15,
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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Game);
