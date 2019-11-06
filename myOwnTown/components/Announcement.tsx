import React from 'react';
import { View, Text } from 'react-native';
import { firestore } from '../dbconfig';

interface IProps {
  title: string;
  description: string;
}
const Announcement: React.SFC<IProps> = Props => {
  return (
    <View
      style={{
        width: '95%',
        borderWidth: 1,
        borderColor: '#B71C1C',
        borderRadius: 20,
        margin: 5,
      }}
    >
      <Text
        style={{
          paddingLeft: 5,
          paddingVertical: 5,
          fontFamily: 'Roboto',
          fontSize: 18,
        }}
      >
        {Props.title}
      </Text>
      <Text
        style={{
          paddingLeft: 5,
          paddingVertical: 5,
          fontFamily: 'Roboto',
          fontSize: 14,
        }}
      >
        {Props.description}
      </Text>
    </View>
  );
};
export default Announcement;
