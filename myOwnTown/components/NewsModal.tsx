import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Overlay } from 'react-native-elements';
import HTML from 'react-native-render-html';
import { firestore, storage } from '../dbconfig';
import timeAgo from '../utils';

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
}

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
          maxHeight: '75%',
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

          <HTML
            style={{ paddingLeft: 5, paddingVertical: 5, fontSize: 16, alignSelf: 'center' }}
            html={this.props.description}
          />

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
