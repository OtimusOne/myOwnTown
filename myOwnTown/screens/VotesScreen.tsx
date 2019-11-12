import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import VotePoll, { VotePollProps } from '../components/VotePoll';

interface Props { }

interface State {
    displayedPolls: VotePollProps[],
}

export default class VotesScreen extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            displayedPolls: [
                { id: "10110", title: "Care strada ar trebui prioritizata in vederea asfaltarii?", options: ["Strada Alunului", "Strada Cicero", "Strada Privighetorii"] },
                { id: "10220", title: "Unde ati dori sa se celebreze zilele orasului?", options: ["Piata Unirii", "Iulius Town", "Parcul Rozelor", "In parc la UVT"] },
                { id: "10330", title: "Sunteti de acord cu construirea unui aeroport subteran?", options: ["Da", "Nu", "Ce??"] }]
        };
    }

    componentDidMount() { //    WIP
        const displayPolls = [];
        dummyPolls.forEach(element => {
            const nid = element.id;
            const ntitle = element.title;
            displayPolls.push({ nid, ntitle });
        });
    }

    fetchPosts() {//    WIP
        const displayedPolls = [];
        dummyPolls.forEach(element => {
            displayedPolls.push(element.id, element.title, element.options, element.id);
        });
        this.setState({ displayedPolls }
        );
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
                        />
                    )}
                    keyExtractor={item => item.id}
                />
            </View>

        );
    }
}

const dummyPolls = [
    { id: "10110", title: "Title 1", options: ["Option 1", "Option 2", "Option 3"] },
    { id: "10220", title: "Title 2", options: ["Option 1", "Option 2", "Option 3", "Option 4"] },
    { id: "10330", title: "Title 3", options: ["Option 1", "Option 2", "Option 3"] }];