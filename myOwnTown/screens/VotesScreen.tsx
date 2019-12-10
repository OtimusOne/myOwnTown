import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import VotePoll, { VotePollProps } from '../components/VotePoll';
import { firestore } from '../dbconfig';

interface Props { }

interface State {
    displayedPolls: VotePollProps[],
}

export default class VotesScreen extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            displayedPolls: []
        };
    }

    componentDidMount() {
        firestore
        .collection('polls')
        .orderBy('createdOn', 'desc')
        .get()
        .then(snap => {
          const displayedPolls = [];
          snap.forEach(entry => {
            const { title, createdOn, options, votes } = entry.data();
            const { id } = entry;
            const date = createdOn.toDate();
            displayedPolls.push({ title, id, createdOn: date, options, votes });
          });
          this.setState(prevState => ({
            displayedPolls,
          }));
        });
    }


    render() {
        return (
            <View
                style={{
                    flex: 1,
                    height: '100%',
                    width: '100%',
                    alignItems: 'center',
                }}>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#E64A19',
                        width: '100%',
                        padding: 5,
                    }}
                >
                    <Icon name="envelope" color="#f7e8e8" size={40} />
                    <Text
                        style={{
                            paddingLeft: 5,
                            fontSize: 24,
                            color: '#f7e8e8',
                        }}>
                        Voting Booth
                    </Text>
                </View>
                <FlatList
                    style={{
                        width: '95%',
                    }}
                    data={this.state.displayedPolls}
                    extraData={this.state}
                    renderItem={({ item }) => (
                        <VotePoll
                            id={item.id}
                            title={item.title}
                            options={item.options}
                            createdOn={item.createdOn}
                            votes={item.votes}
                        />
                    )}
                    keyExtractor={item => item.id}
                />
            </View>

        );
    }
}
