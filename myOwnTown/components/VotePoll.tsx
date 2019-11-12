import React from 'react';
import { TouchableOpacity, Text, View, FlatList, Button } from 'react-native';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import Icon from 'react-native-vector-icons/FontAwesome';

export interface VotePollProps {
    id: string;
    title: string;
    options: string[];
    key?: string;
}


const VotePoll: React.SFC<VotePollProps> = Props => {
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
                    {Props.title}
                </Text>
            </View>
            <RadioForm
            >
                <FlatList
                    data={Props.options}
                    extraData={Props}
                    renderItem={({ item }) => (
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingTop: 10,
                            }}>
                            <RadioButton key={item}>
                                <RadioButtonInput
                                    obj={item}
                                    index={item}
                                    onPress={onPress}
                                    borderWidth={2}
                                    buttonOuterColor='#E64A19'
                                    buttonSize={14}
                                    buttonOuterSize={20}
                                    buttonStyle={{}}
                                    buttonWrapStyle={{ marginLeft: 10 }}
                                />
                                <RadioButtonLabel
                                    obj={item}
                                    onPress={onPress}
                                    labelStyle={{ fontSize: 14, color: '#2ecc71', paddingLeft: 5 }}
                                />

                            </RadioButton>
                            <Text>{item}</Text>
                        </View>
                    )}
                    keyExtractor={item => item}
                />
            </RadioForm>
            <View
                style={{
                    alignContent: 'center',
                    padding: 10,
                }}>
                <Button title="Vote" color="#E64A19" onPress={() => { }} />
            </View>
        </View>
    );
}
export default VotePoll;

function onPress() {
    // Not implemented yet
    return 0;
}