/* eslint-disable react-native/no-inline-styles */
import React from 'react';

import {
  View,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  Animated,
  Easing,
  AppState,
  Switch,
} from 'react-native';
import {connect} from 'react-redux';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';

import {
  changeLevelAction,
  increaseLevelAction,
  changeQuestionAction,
  increaseQuestionAction,
} from '../redux/actions/levelAction';

const width = parseInt(Dimensions.get('screen').width, 10) / 360;
const height = parseInt(Dimensions.get('screen').height, 10) / 640;
var Sound = require('react-native-sound');
Sound.setCategory('Playback');
class Levels extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showOptionModal: false,
      soundOn: true,
      soundEffectsOn: true,
      selectedTheme: 'blue',
    };

    this.spinValue = new Animated.Value(0);
    Animated.loop(
      Animated.timing(this.spinValue, {
        toValue: 5,
        duration: 9000,
        easing: Easing.linear,
        useNativeDriver: true, // To make use of native driver for performance
      }),
    ).start();

    this.spin = this.spinValue.interpolate({
      inputRange: [0, 1, 2, 3, 4, 5],
      outputRange: ['0deg', '360deg', '360deg', '0deg', '360deg', '360deg'],
    });

    this.music = new Sound('musicc.mp3', Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
      this.music.play(success => {
        if (success) {
          console.log('successfully finished playing');
        } else {
          console.log('playback failed due to audio decoding errors');
        }
      });

      this.music.setVolume(0.25);
      this.music.setNumberOfLoops(-1);
    });
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = currentAppState => {
    if (currentAppState === 'background') {
      this.music.stop();
    }
    if (currentAppState === 'active') {
      this.music.play();
    }
  };

  levelCard = ({id, locked, successRate, difficulty}) => {
    const {navigation, changeLevel} = this.props;
    let uri;
    let borderColor;

    if (!id) {
      return null;
    } else {
      switch (successRate) {
        case 0:
          uri = 'no_star';
          break;
        case 1:
          uri = 'one_star';
          break;
        case 2:
          uri = 'two_star';
          break;
        case 3:
          uri = 'three_star';
          break;
      }
      switch (difficulty) {
        case 1:
          borderColor = '#10D454';
          break;
        case 2:
          borderColor = '#FF7B1B';
          break;
        case 3:
          borderColor = '#D40D20';
          break;
      }
      return (
        <TouchableOpacity
          onPress={() => {
            changeLevel(id - 1);
            navigation.navigate('Game');
          }}>
          <View style={{...styles.levelCardView, borderColor}}>
            {locked ? (
              <Image style={styles.lockedImage} source={{uri: 'locked'}} />
            ) : (
              <Image
                resizeMode={'contain'}
                style={styles.successImage}
                source={{uri}}
              />
            )}
            <Text style={styles.levelText}>{id}</Text>
          </View>
        </TouchableOpacity>
      );
    }
  };

  themes = ['yellow', 'black', 'red', 'green'];
  render() {
    const {userLevels} = this.props;
    const {
      showOptionModal,
      soundOn,
      soundEffectsOn,
      selectedTheme,
    } = this.state;
    return (
      <View style={styles.container}>
        <Modal
          onBackdropPress={() => this.setState({showOptionModal: false})}
          isVisible={showOptionModal}>
          <LinearGradient
            colors={['#26A5A7', '#26A5A7']}
            style={styles.linearGradient}>
            <View style={styles.optionModalSoundView}>
              <View style={styles.optionModalSoundTextsView}>
                <Text style={styles.optionModalSoundTexts}>Müzik</Text>
                <Text style={styles.optionModalSoundTexts}>Ses Efekti</Text>
              </View>
              <View style={styles.optionModalSwitches}>
                <Switch
                  style={{width: 41 * width, height: 20 * height}}
                  trackColor={{false: '#FFF', true: '#10D454'}}
                  thumbColor={'#40514E'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={value => {
                    this.setState({soundOn: value});
                    !value ? this.music.stop() : this.music.play();
                  }}
                  value={soundOn}
                />
                <Switch
                  style={{width: 41 * width, height: 20 * height}}
                  trackColor={{false: '#FFF', true: '#10D454'}}
                  thumbColor={'#40514E'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={value => {
                    this.setState({soundEffectsOn: value});
                    !value ? this.music.stop() : this.music.play();
                  }}
                  value={soundEffectsOn}
                />
              </View>
            </View>
            {/**
             *
  themesContainer: {flexDirection: 'row'},
  selectedThemeView: {justifyContent: 'space-between'},
  themesView: {justifyContent: 'space-between'},
  themesViewRows: {flexDirection: 'rows'},
             */}
            <View style={styles.themesContainer}>
              <View style={styles.selectedThemeView}>
                <Text style={styles.selectedThemeText}>TEMA</Text>
                <Image
                  style={styles.selectedThemeImage}
                  source={{uri: `themes_${selectedTheme}`}}
                />
              </View>
              <View style={styles.themesView}>
                <View style={styles.themesViewRows}>
                  <Image
                    style={styles.themePhotos}
                    source={{uri: 'themes_yellow'}}
                  />
                  <Image
                    style={styles.themePhotos}
                    source={{uri: 'themes_black'}}
                  />
                </View>
                <View style={styles.themesViewRows}>
                  <Image
                    style={styles.themePhotos}
                    source={{uri: 'themes_red'}}
                  />
                  <Image
                    style={styles.themePhotos}
                    source={{uri: 'themes_green'}}
                  />
                </View>
              </View>
            </View>
          </LinearGradient>
        </Modal>
        <View style={styles.header}>
          <TouchableOpacity>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.lifeCountText}>5</Text>
              <Image
                style={styles.lifeCountImage}
                source={{uri: 'life_count'}}
              />
            </View>
          </TouchableOpacity>
          <View style={styles.score}>
            <Image style={styles.scoreImage} source={{uri: 'trophy'}} />
            <Text style={styles.scoreText}>50000</Text>
          </View>
          <View>
            <TouchableOpacity
              onPress={() => {
                this.setState({showOptionModal: true});
              }}>
              <Animated.Image
                style={{
                  width: 36 * width,
                  height: 36 * height,
                  marginTop: 15 * height,
                  marginRight: 14 * width,
                  transform: [{rotate: this.spin}],
                }}
                source={{uri: 'options'}}
              />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView style={styles.levelsContainer}>
          {userLevels.map((level, index) => {
            return index % 3 === 0 ? (
              <View style={styles.levelRow}>
                {[
                  this.levelCard(level),
                  userLevels[index + 1]
                    ? this.levelCard(userLevels[index + 1])
                    : null,
                  userLevels[index + 2]
                    ? this.levelCard(userLevels[index + 2])
                    : null,
                ]}
              </View>
            ) : null;
          })}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  lifeCountImage: {
    width: 121 * width,
    height: 37 * height,
    marginLeft: -65 * width,
    marginTop: 15 * height,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.53,
    shadowRadius: 13.97,
  },
  lifeCountText: {
    marginLeft: 70 * width,
    marginTop: 23 * height,
    zIndex: 1,
    fontSize: 16,
    fontFamily: 'Molle-Italic',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.53,
    shadowRadius: 13.97,
    elevation: 21,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 360 * width,
    height: 65 * height,
    backgroundColor: '#C4FEF3',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
  },
  score: {
    flexDirection: 'row',
    backgroundColor: '#E4F9F5',
    width: 118 * width,
    height: 36 * height,
    marginTop: 14 * height,
    borderRadius: 12 * height,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,

    elevation: 16,
  },
  scoreImage: {
    width: 25 * width,
    height: 25 * width,
    marginLeft: 16 * width,
    marginTop: 7 * height,
  },
  scoreText: {
    width: 80 * width,
    height: 19 * height,
    marginTop: 8 * height,
    marginLeft: 9 * width,
    fontSize: 16,
    fontFamily: 'Molle-Italic',
    lineHeight: 25,
  },
  levelsContainer: {
    backgroundColor: '#E4F9F5',
  },
  levelRow: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'center',
    width: 360 * width,
    height: 64 * height,
    backgroundColor: '#E4F9F5',
    marginVertical: 32 * height,
  },
  levelCardView: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: 64 * width,
    height: 64 * width,
    backgroundColor: '#40514E',
    borderWidth: 3 * width,
    borderRadius: 12 * width,
    borderStyle: 'solid',
    borderColor: 'red',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.53,
    shadowRadius: 13.97,
    elevation: 21,
  },
  levelText: {
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 25,
    fontFamily: 'Molle-Italic',
    color: 'white',
    width: 40 * width,
  },
  lockedImage: {
    width: 18 * width,
    height: 24 * height,
    position: 'absolute',
    start: 48,
    top: -12,
  },
  //TODO düzelt
  successImage: {
    width: 65 * width,
    height: 26 * height,
    marginTop: -15 * height,
    marginLeft: -3 * width,
    position: 'absolute',
  },
  picker: {fontFamily: 'Molle-Italic'},
  pickerItem: {
    fontFamily: 'Molle-Italic',
  },
  linearGradient: {
    width: 325 * width,
    height: 403 * height,
    borderRadius: 18,
    alignItems: 'center',
  },
  optionModalSoundView: {
    width: 286 * width,
    height: 92 * height,
    flexDirection: 'row',
    marginTop: 48 * height,
    backgroundColor: '#477A70',
    justifyContent: 'space-between',
    borderRadius: 12 * height,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.53,
    shadowRadius: 13.97,
  },
  optionModalSoundTextsView: {
    width: 112 * width,
    height: 61 * height,
    marginTop: 17,
    marginLeft: 34 * width,
    justifyContent: 'space-between',
  },
  optionModalSoundTexts: {
    fontFamily: 'OpenSans-Regular',
    color: '#FFF',
    fontSize: 24,
  },
  optionModalSwitches: {
    width: 92 * width,
    height: 92 * height,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#A5EDDF',
    borderRadius: 12,
  },
  themesContainer: {
    backgroundColor: 'black',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 286 * width,
    height: 168 * height,
    marginTop: 48 * height,
  },
  selectedThemeView: {
    width: 96 * width,
    height: 125 * height,
    alignItems: 'center',
  },
  selectedThemeText: {
    width: 96 * width,
    height: 33 * height,
    fontSize: 24,
    fontFamily: 'OpenSans-Regular',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 1.6,
  },
  selectedThemeImage: {
    width: 96 * width,
    height: 96 * height,
  },
  themesView: {
    width: 167 * width,
    height: 167 * height,
    flexDirection: 'column',
  },
  themesViewRows: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 167 * width,
    height: 72 * height,
  },
  themePhotos: {
    width: 72 * width,
    height: 72 * height,
  },
});

const mapStateToProps = state => {
  const {level, userLevels} = state;
  return {level, userLevels};
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
)(Levels);
