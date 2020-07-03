import React from 'react';

import {View, TouchableOpacity, Text, TextInput} from 'react-native';
import {connect} from 'react-redux';

import {
  changeLevelAction,
  increaseLevelAction,
  changeQuestionAction,
  increaseQuestionAction,
} from '../redux/actions/levelAction';

class Levels extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {navigation, changeLevel, changeQuestion} = this.props;
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            changeLevel(0);
            changeQuestion(0);
            navigation.navigate('Game');
          }}>
          <Text>Go To first Question</Text>
        </TouchableOpacity>
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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Levels);
