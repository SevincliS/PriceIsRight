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
  updateLifeAction,
} from '../redux/actions/levelAction';
import styles from '../styles/Levels.android';
import {setConsent as setConsentAction} from '../redux/actions/consentAction';
import {AdsConsent, AdsConsentStatus} from '@react-native-firebase/admob';
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
    this.scaleValue = new Animated.Value(0);
    Animated.loop(
      Animated.timing(this.scaleValue, {
        toValue: 4,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true, // To make use of native driver for performance
      }),
    ).start();
    this.scale = this.scaleValue.interpolate({
      inputRange: [0, 1, 1.5, 2, 3, 4],
      outputRange: [1, 1.25, 1.125, 1.25, 1, 1],
    });

    this.spinValue = new Animated.Value(0);
    Animated.loop(
      Animated.timing(this.spinValue, {
        toValue: 5,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: true, // To make use of native driver for performance
      }),
    ).start();
    this.spin = this.spinValue.interpolate({
      inputRange: [0, 1, 1.25, 2.25, 2.5, 3.5, 3.75, 4.75, 5],
      outputRange: [
        '0deg',
        '360deg',
        '360deg',
        '0deg',
        '0deg',
        '360deg',
        '360deg',
        '0deg',
        '0deg',
      ],
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

  componentDidMount = async () => {
    const {navigation} = this.props;
    navigation.addListener('focus', () => {
      this.checkLifes();
    });
    navigation.addListener('blur', () => {
      clearInterval(this.interval);
    });
    const consentInfo = await AdsConsent.requestInfoUpdate([
      'pub-4313673729121143',
    ]);
    const {setConsent} = this.props;
    if (consentInfo.isRequestLocationInEeaOrUnknown) {
      const status = await AdsConsent.getStatus();
      if (status === AdsConsentStatus.UNKNOWN) {
        const formResult = await AdsConsent.showForm({
          privacyPolicy: 'https://invertase.io/privacy-policy',
          withPersonalizedAds: true,
          withNonPersonalizedAds: true,
        });
        if (formResult.status === AdsConsentStatus.PERSONALIZED) {
          setConsent({status: false});
        } else if (formResult.status === AdsConsentStatus.NON_PERSONALIZED) {
          setConsent({status: true});
        }
      } else if (status === AdsConsentStatus.PERSONALIZED) {
        setConsent({status: false});
      } else if (status === AdsConsentStatus.NON_PERSONALIZED) {
        setConsent({status: true});
      }
    }
    AppState.addEventListener('change', this._handleAppStateChange);
  };
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
    const {preferences} = this.props;
    const {music} = preferences;
    if (currentAppState === 'background') {
      this.music.stop();
      clearInterval(this.interval);
    } else if (currentAppState === 'active' && music) {
      this.music.play();
    }
    if (currentAppState === 'active') {
      this.checkLifes();
    }
  };

  checkLifes = async () => {
    const {level, updateLife} = this.props;
    const {lifeLostTimestamp, life} = level;
    if (!lifeLostTimestamp) {
      return;
    } else {
      console.log(new Date(lifeLostTimestamp));
      let timestamp = await this.getGlobalTime();
      console.log(new Date(timestamp));
      let timeDifference = timestamp - lifeLostTimestamp;
      let hourDifference = Math.floor(timeDifference / (1000 * 3600));
      let newLife = life + hourDifference;
      if (hourDifference > 0) {
        updateLife(newLife);
      } else {
        let secondDifference = 3600 - Math.floor(timeDifference / 1000);
        console.log(secondDifference);
        this.interval = setInterval(() => {
          this.setState(prevState => ({
            secondDifference: prevState.secondDifference
              ? prevState.secondDifference - 1
              : secondDifference,
          }));
        }, 1000);
      }
    }
  };
  levelCard = ({id, locked, successRate, difficulty}) => {
    const {navigation, changeLevel, level} = this.props;
    let {life} = level;
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
            if (!locked && life > 0) {
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

  countDownText = secondDifference => {
    if (!secondDifference) {
      return '??:??';
    }
    console.log(secondDifference);
    const {updateLife} = this.props;
    let minuteDifference = Math.floor(secondDifference / 60);
    let currentSecondDifference = secondDifference % 60;
    if (currentSecondDifference === 0 && minuteDifference === 0) {
      updateLife(1);
      clearInterval(this.interval);
    }
    currentSecondDifference =
      currentSecondDifference < 10
        ? `0${currentSecondDifference.toString()}`
        : currentSecondDifference.toString();
    minuteDifference =
      minuteDifference < 10
        ? `0${minuteDifference.toString()}`
        : minuteDifference.toString();
    return `${minuteDifference}:${currentSecondDifference}`;
  };
  render() {
    const {
      userLevels,
      theme: themeProps,
      switchMusic,
      switchSoundEffects,
      preferences,
      level,
    } = this.props;
    const {life} = level;
    const {
      showOptionModal,
      selectedTheme,
      themes,
      secondDifference,
    } = this.state;
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
      <View style={styles.container}>
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
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Animated.Image
                resizeMode={'contain'}
                style={{
                  zIndex: 1,
                  marginLeft: 25 * width,
                  marginRight: -22 * width,
                  marginTop: 18 * height,
                  width: 27 * width,
                  height: 27 * height,
                  transform: [{rotate: '-33deg', scale: this.scale}],
                }}
                source={{uri: 'heart'}}
              />
              {life > 0 ? (
                <Text style={styles.lifeCountText}>{life}</Text>
              ) : (
                <Text style={styles.countDownText}>
                  {this.countDownText(secondDifference)}
                </Text>
              )}
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
      </View>
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
    updateLife: life => dispatch(updateLifeAction(life)),
    setConsent: consent => dispatch(setConsentAction(consent)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Levels);
