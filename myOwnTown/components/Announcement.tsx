import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import NewsModal from './NewsModal';
import timeAgo from '../utils';

export interface AnnouncementProps {
  id: string;
  title: string;
  description: string;
  createdOn: Date;
  icon?: string;
}

const Announcement: React.SFC<AnnouncementProps> = Props => {
  const [modalVisible, setModalVisible] = useState(false);
  const handleCloseModal = () => {
    setModalVisible(false);
  };
  return (
    <TouchableOpacity
      style={{
        width: '95%',
        borderWidth: 1,
        borderColor: '#B71C1C',
        borderRadius: 20,
        margin: 5,
        padding: 5,
      }}
      onPress={() => setModalVisible(true)}
    >
      {modalVisible && (
        <NewsModal
          handleClose={() => handleCloseModal()}
          id={Props.id}
          title={Props.title}
          description={Props.description}
          icon={Props.icon}
          createdOn={Props.createdOn}
        />
      )}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        {Props.icon && <Icon name={Props.icon} size={18} />}
        <Text
          style={{
            paddingLeft: 5,
            fontSize: 18,
          }}
        >
          {Props.title}
        </Text>
      </View>
      <Text
        style={{
          paddingLeft: 5,
          paddingVertical: 5,
          fontSize: 14,
          textAlign: 'justify',
        }}
        numberOfLines={3}
      >
        {Props.description}
      </Text>
      {Props.createdOn && (
        <Text
          style={{
            fontSize: 10,
            color: 'gray',
            textAlign: 'right',
          }}
        >
          {timeAgo(Props.createdOn)}
        </Text>
      )}
    </TouchableOpacity>
  );
};
export default Announcement;
