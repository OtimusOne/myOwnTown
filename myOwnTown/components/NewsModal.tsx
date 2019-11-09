import React, { useState } from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Overlay } from 'react-native-elements';
import * as Progress from 'react-native-progress';
import { AnnouncementProps } from './Announcement';
import { firestore, storage } from '../dbconfig';

interface newsModalProps {
  id: string;
  title: string;
  description: string;
  createdOn: Date;
  icon?: string;
  handleClose: () => void;
}
interface newsModalState {
  isVisible: boolean;
  imgUrl: string;
  readyToShow: boolean;
}

const timeAgo = (time: any): string => {
  switch (typeof time) {
    case 'number':
      break;
    case 'string':
      time = +new Date(time);
      break;
    case 'object':
      if (time.constructor === Date) time = time.getTime();
      break;
    default:
      time = +new Date();
  }
  const timeFormats = [
    [60, 'seconds', 1], // 60
    [120, '1 minute ago', '1 minute from now'], // 60*2
    [3600, 'minutes', 60], // 60*60, 60
    [7200, '1 hour ago', '1 hour from now'], // 60*60*2
    [86400, 'hours', 3600], // 60*60*24, 60*60
    [172800, 'Yesterday', 'Tomorrow'], // 60*60*24*2
    [604800, 'days', 86400], // 60*60*24*7, 60*60*24
    [1209600, 'Last week', 'Next week'], // 60*60*24*7*4*2
    [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
    [4838400, 'Last month', 'Next month'], // 60*60*24*7*4*2
    [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
    [58060800, 'Last year', 'Next year'], // 60*60*24*7*4*12*2
    [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
    [5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
    [58060800000, 'centuries', 2903040000], // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
  ];
  let seconds = (Date.now() - time) / 1000,
    token = 'ago',
    listChoice = 1;

  if (seconds === 0) {
    return 'Just now';
  }
  if (seconds < 0) {
    seconds = Math.abs(seconds);
    token = 'from now';
    listChoice = 2;
  }
  let i = 0,
    format;
  while ((format = timeFormats[i++]))
    if (seconds < format[0]) {
      if (typeof format[2] === 'string') return format[listChoice];

      return `${Math.floor(seconds / format[2])} ${format[1]} ${token}`;
    }
  return time;
};
export default class NewsModal extends React.Component<newsModalProps, newsModalState> {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: true,

      imgUrl: undefined,
    };
    this.onClose = this.onClose.bind(this);
  }

  componentDidMount() {
    firestore
      .collection('news')
      .doc(this.props.id)
      .get()
      .then(async doc => {
        if (doc.exists) {
          const { img } = doc.data();
          if (img) {
            const ref = storage.ref(img);
            const imgUrl = await ref.getDownloadURL();
            this.setState({ imgUrl });
          }
        }
      });
  }

  onClose = () => {
    this.setState({ isVisible: false });
    this.props.handleClose();
  };

  render() {
    return (
      <Overlay
        isVisible={this.state.isVisible}
        onBackdropPress={this.onClose}
        overlayStyle={{
          height: 'auto',
          borderWidth: 1,
          borderColor: '#B71C1C',
          borderRadius: 20,
        }}
      >
        <ScrollView>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            {this.props.icon && <Icon name={this.props.icon} size={24} />}
            <Text
              style={{
                paddingHorizontal: 5,
                fontSize: 22,
              }}
            >
              {this.props.title}
            </Text>
          </View>

          <View>
            <Text
              style={{
                paddingLeft: 5,
                paddingVertical: 5,
                fontSize: 16,
                textAlign: 'justify',
              }}
            >
              {this.props.description}
            </Text>
          </View>

          {this.state.imgUrl && (
            <Image
              style={{ height: 200, width: 200, alignSelf: 'center' }}
              source={{ uri: this.state.imgUrl }}
            />
          )}
          {this.props.createdOn && (
            <Text
              style={{
                fontSize: 10,
                color: 'gray',
                textAlign: 'right',
              }}
            >
              {timeAgo(this.props.createdOn)}
            </Text>
          )}
        </ScrollView>
      </Overlay>
    );
  }
}
