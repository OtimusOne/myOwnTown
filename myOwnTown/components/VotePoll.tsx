import React from 'react';
import { TouchableOpacity, Text, View, FlatList, Button } from 'react-native';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import { firestore } from '../dbconfig';

export interface VotePollProps {
  uid: string;
  id: string;
  title: string;
  createdOn: Date;
  options: string[];
  votes: number[];
}

interface State {
  selectedOption: number;
  radioProps: any;
  hasVoted: boolean;
  displayedVotes: number[];
}

export default class VotePoll extends React.Component<VotePollProps, State> {
  constructor(props) {
    super(props);
    const auxRadioProps = [];
    for (let i = 0; i < this.props.options.length; i++) {
      const label = this.props.options[i];
      auxRadioProps.push({ label, value: i });
    }

    this.state = {
      selectedOption: 0,
      radioProps: auxRadioProps,
      hasVoted: false,
      displayedVotes: this.props.votes,
    };
  }

  componentDidMount() {
    let hasVotedCount = 0;
    firestore
      .collection('voted')
      .where('userID', '==', this.props.uid)
      .where('questionID', '==', this.props.id)
      .get()
      .then(snap => {
        hasVotedCount = snap.size;
      })
      .then(() => {
        this.setState({ hasVoted: hasVotedCount !== 0 });
      });
  }

  render() {
    return (
      <View
        style={{
          width: '95%',
          borderWidth: 1.5,
          borderColor: '#E64A19',
          borderRadius: 20,
          margin: 5,
          padding: 5,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontWeight: 'bold',
              paddingLeft: 5,
              fontSize: 20,
            }}
          >
            {this.props.title}
          </Text>
        </View>
        <RadioForm animation formHorizontal={false} disabled>
          {this.state.radioProps.map((obj, i) => (
            <RadioButton key={i} labelHorizontal selectedButtonColor="#E64A19" disabled>
              <RadioButtonInput
                obj={obj}
                index={i}
                isSelected={this.state.selectedOption === i}
                onPress={() => {
                  this.setState({ selectedOption: i });
                }}
                borderWidth={2}
                buttonOuterColor={this.state.selectedOption === i ? '#E64A19' : '#000000'}
                buttonInnerColor={this.state.hasVoted === true ? '000000' : '#f09275'}
                buttonSize={14}
                buttonOuterSize={20}
                buttonStyle={{}}
                buttonWrapStyle={{ marginLeft: 10, marginTop: 10 }}
                disabled={this.state.hasVoted === true || this.props.uid === null}
              />
              <RadioButtonLabel
                obj={obj}
                index={i}
                onPress={() => {
                  this.setState({ selectedOption: i });
                }}
                labelStyle={{ fontSize: 14, color: '#000000', paddingLeft: 5 }}
                labelWrapStyle={{ marginTop: 10 }}
                disabled={this.state.hasVoted === true || this.props.uid === null}
              />
              <Text
                style={{
                  display: this.state.hasVoted === true ? 'flex' : 'none',
                  fontWeight: 'bold',
                  marginLeft: 10,
                  marginTop: 10,
                }}
              >
                {this.state.displayedVotes[i]} voturi
              </Text>
            </RadioButton>
          ))}
        </RadioForm>
        <View
          style={{
            alignContent: 'center',
            padding: 10,
          }}
        >
          <Button
            title="Vote"
            color="#E64A19"
            disabled={this.state.hasVoted === true || this.props.uid === null}
            onPress={() => {
              onPressVote(
                this.state.selectedOption,
                this.props.id,
                this.props.uid,
                this.state.displayedVotes,
              );
              this.setState({ hasVoted: true });
            }}
          />
        </View>
      </View>
    );
  }
}

function onPressVote(selectedOption, entryId, userId, displayedVotes) {
  const newVotes = displayedVotes;
  newVotes[selectedOption] += 1;
  firestore
    .collection('polls')
    .doc(entryId)
    .update({
      votes: newVotes,
    });
  const docData = {
    userID: userId,
    questionID: entryId,
  };
  firestore.collection('voted').add(docData);
}
