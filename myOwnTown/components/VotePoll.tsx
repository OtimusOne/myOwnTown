import React from 'react';
import { TouchableOpacity, Text, View, FlatList, Button } from 'react-native';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import { firestore } from '../dbconfig';

export interface VotePollProps {
    id: string;
    title: string;
    createdOn: Date;
    options: string[];
    votes: number[];
}

interface State {
    selectedOption: number;
    radio_props: any;
    hasVoted: boolean;
    displayedVotes: number[];
}


export default class VotePoll extends React.Component<VotePollProps, State> {
    constructor(props) {
        super(props);
        var _radio_props = [];
        for (var i = 0; i < this.props.options.length; i++) {
            var label = this.props.options[i];
            _radio_props.push({ label: label, value: i });
        }
        this.state = {
            selectedOption: 0,
            radio_props: _radio_props,
            hasVoted: false,
            displayedVotes: this.props.votes,
        };
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
                }}>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <Text
                        style={{
                            fontWeight: "bold",
                            paddingLeft: 5,
                            fontSize: 20,
                        }}>
                        {this.props.title}
                    </Text>
                </View>
                <RadioForm
                    animation={true}
                    formHorizontal={false}
                    disabled={true}
                >
                    {
                        this.state.radio_props.map((obj, i) => (
                            <RadioButton key={i} labelHorizontal={true} selectedButtonColor={'#E64A19'} 
                            disabled={true}
                            
                            >
                                <RadioButtonInput
                                    obj={obj}
                                    index={i}
                                    isSelected={this.state.selectedOption === i}
                                    onPress={() => { this.setState({ selectedOption: i }) }}
                                    borderWidth={2}
                                    buttonOuterColor={this.state.selectedOption === i ? '#E64A19' : '#000000'}
                                    buttonInnerColor={this.state.hasVoted == true ? '000000' : '#f09275'}
                                    buttonSize={14}
                                    buttonOuterSize={20}
                                    buttonStyle={{}}
                                    buttonWrapStyle={{ marginLeft: 10, marginTop: 10 }}
                                    disabled={this.state.hasVoted == true ? true : false}
                                />
                                <RadioButtonLabel
                                    obj={obj}
                                    index={i}
                                    onPress={() => { this.setState({ selectedOption: i }); }}
                                    labelStyle={{ fontSize: 14, color: '#000000', paddingLeft: 5 }}
                                    labelWrapStyle={{ marginTop: 10 }}
                                    disabled={this.state.hasVoted == true ? true : false}
                                />
                                <Text style={{display: this.state.hasVoted == true ? 'flex' : 'none', fontWeight: 'bold', marginLeft: 10, marginTop: 10 }}>{this.state.displayedVotes[i]} voturi</Text>
                            </RadioButton>

                        ))
                    }
                </RadioForm>
                <View
                    style={{
                        alignContent: 'center',
                        padding: 10,
                    }}>
                    <Button title="Vote" color="#E64A19" disabled={this.state.hasVoted == true ? true : false}
                    onPress={() => 
                        { onPressVote(this.state.selectedOption, this.props.id, this.state.displayedVotes); 
                        this.setState({ hasVoted: true }); }} />
                </View>
            </View>
        );
    }

}

function onPressVote(selectedOption, entryId, displayedVotes) {
    var newVotes = displayedVotes;
    newVotes[selectedOption] += 1;
    firestore
        .collection('polls')
        .doc(entryId)
        .update(
            {
                votes: newVotes,
            }
        )
    return 0;
}