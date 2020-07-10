/* eslint-disable react-native/no-inline-styles */
import React from 'react';

import {
  View,
  TouchableOpacity,
  Text,
  Image,
  Dimensions,
  ScrollView,
  Animated,
  Easing,
  AppState,
  Switch,
  SafeAreaView,
} from 'react-native';
import {connect} from 'react-redux';
import Modal from 'react-native-modal';
import {changeSelectedThemeAction} from '../redux/actions/themeAction';
import {
  switchMusicAction,
  switchSoundEffectsAction,
} from '../redux/actions/preferencesAction';
import {
  changeLevelAction,
  increaseLevelAction,
  changeQuestionAction,
  increaseQuestionAction,
} from '../redux/actions/levelAction';
import styles from '../styles/Levels.ios';

const width = parseInt(Dimensions.get('screen').width, 10) / 360;
const height = parseInt(Dimensions.get('screen').height, 10) / 640;
var Sound = require('react-native-sound');
Sound.setCategory('Playback');
class Levels extends React.Component {
  constructor(props) {
    super(props);

    const {theme, preferences} = props;
    const {selectedTheme: selectedThemeProps} = theme;
    this.state = {
      showOptionModal: false,
      selectedTheme: selectedThemeProps,
      themes: ['blue', 'yellow', 'black', 'red', 'creme'].filter(
        el => el !== selectedThemeProps,
      ),
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
      if (preferences.music) {
        this.music.play(success => {
          if (success) {
            console.log('successfully finished playing');
          } else {
            console.log('playback failed due to audio decoding errors');
          }
        });
      }

      this.music.setVolume(0.25);
      this.music.setNumberOfLoops(-1);
    });
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }
  componentDidUpdate(prevProps) {
    const {preferences} = this.props;
    const {music} = preferences;
    if (prevProps.preferences.music !== music) {
      if (music) {
        this.music.play();
      } else {
        this.music.stop();
      }
    }
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
            if (!locked) {
              changeLevel(id - 1);
              navigation.navigate('Game');
            }
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

  changeSelectedThemeImage = i => {
    const {changeSelectedTheme} = this.props;
    const {themes, selectedTheme} = this.state;
    let newThemes = [...themes];
    this.setState({selectedTheme: newThemes[i]});
    changeSelectedTheme(newThemes[i]);
    newThemes[i] = selectedTheme;
    this.setState({themes: newThemes});
  };

  render() {
    const {
      userLevels,
      theme: themeProps,
      switchMusic,
      switchSoundEffects,
      preferences,
    } = this.props;
    const {showOptionModal, selectedTheme, themes} = this.state;
    const {music, soundEffects} = preferences;
    const {selectedStyles} = themeProps;
    const {
      mainColor,
      levelsHeader,
      optionModalBG,
      optionModalSoundLeft,
      optionModalSoundRight,
    } = selectedStyles;
    return (
      <SafeAreaView style={styles.container}>
        <Modal
          onBackdropPress={() => this.setState({showOptionModal: false})}
          isVisible={showOptionModal}>
          <View
            style={{...styles.modalContainer, backgroundColor: optionModalBG}}>
            <View
              style={{
                ...styles.optionModalSoundView,
                backgroundColor: optionModalSoundLeft,
              }}>
              <View style={styles.optionModalSoundTextsView}>
                <Text style={styles.optionModalSoundTexts}>Müzik</Text>
                <Text style={styles.optionModalSoundTexts}>Ses Efekti</Text>
              </View>
              <View
                style={{
                  ...styles.optionModalSwitches,
                  backgroundColor: optionModalSoundRight,
                }}>
                <Switch
                  style={{width: 41 * width, height: 20 * height}}
                  trackColor={{false: '#FFF', true: '#10D454'}}
                  thumbColor={'#40514E'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => {
                    switchMusic();
                  }}
                  value={music}
                />
                <Switch
                  style={{width: 41 * width, height: 20 * height}}
                  trackColor={{false: '#FFF', true: '#10D454'}}
                  thumbColor={'#40514E'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => {
                    switchSoundEffects();
                  }}
                  value={soundEffects}
                />
              </View>
            </View>
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
                  <TouchableOpacity
                    onPress={() => this.changeSelectedThemeImage(0)}>
                    <Image
                      style={styles.themePhotos}
                      source={{
                        uri: `themes_${themes[0]}`,
                      }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this.changeSelectedThemeImage(1)}>
                    <Image
                      style={styles.themePhotos}
                      source={{
                        uri: `themes_${themes[1]}`,
                      }}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.themesViewRows}>
                  <TouchableOpacity
                    onPress={() => this.changeSelectedThemeImage(2)}>
                    <Image
                      style={styles.themePhotos}
                      source={{
                        uri: `themes_${themes[2]}`,
                      }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this.changeSelectedThemeImage(3)}>
                    <Image
                      style={styles.themePhotos}
                      source={{
                        uri: `themes_${themes[3]}`,
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
        <View style={{...styles.header, backgroundColor: levelsHeader}}>
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
        <ScrollView
          style={{...styles.levelsContainer, backgroundColor: mainColor}}>
          {userLevels.map((level, index) => {
            return index % 3 === 0 ? (
              <View style={{...styles.levelRow, backgroundColor: mainColor}}>
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
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  const {level, userLevels, theme, preferences} = state;
  return {level, userLevels, theme, preferences};
};
const mapDispatchToProps = dispatch => {
  return {
    changeLevel: level => dispatch(changeLevelAction(level)),
    increaseLevel: () => dispatch(increaseLevelAction()),
    changeQuestion: question => dispatch(changeQuestionAction(question)),
    increaseQuestion: () => dispatch(increaseQuestionAction()),
    changeSelectedTheme: theme => dispatch(changeSelectedThemeAction(theme)),
    switchMusic: () => dispatch(switchMusicAction()),
    switchSoundEffects: () => dispatch(switchSoundEffectsAction()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Levels);
