import React from 'react';
import { View, Text, Picker } from 'react-native';
import { Overlay, Input, Button } from 'react-native-elements';
import * as firebase from 'firebase';
import { Region } from 'react-native-maps';
import { firestore } from '../dbconfig';

interface addMarkerModalProps {
  handleClose: () => void;
  coordinate: Coordinates;
}
interface addMarkerModalState {
  isVisible: boolean;
  title?: string;
  description?: string;
  text?: string;
  type?: string;
  isTitleValid?: boolean;
  isDescriptionValid?: boolean;
}

export default class NewsModal extends React.Component<addMarkerModalProps, addMarkerModalState> {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: true,
      isTitleValid: true,
      isDescriptionValid: true,
    };
    this.onClose = this.onClose.bind(this);
    this.submitMarker = this.submitMarker.bind(this);
  }

  onClose = () => {
    this.setState({ isVisible: false });
    this.props.handleClose();
  };

  submitMarker = () => {
    this.setState({
      isTitleValid: true,
      isDescriptionValid: true,
    });
    if (!this.state.title) {
      this.setState({ isTitleValid: false });
      return false;
    }
    if (!this.state.description) {
      this.setState({ isDescriptionValid: false });
      return false;
    }
    const docData = {
      title: this.state.title,
      description: this.state.description,
      coordinate: new firebase.firestore.GeoPoint(
        this.props.coordinate.latitude,
        this.props.coordinate.longitude,
      ),
      icon: this.state.type,
      approved: false,
    };
    firestore.collection('markers').add(docData);
    this.onClose();
    return true;
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
          borderColor: '#388E3C',
          borderRadius: 10,
        }}
      >
        <View
          style={{
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              paddingHorizontal: 5,
              fontSize: 22,
            }}
          >
            Add Marker
          </Text>
          <Picker
            selectedValue={this.state.type}
            style={{ height: 50, width: 200 }}
            onValueChange={(itemValue, itemIndex) => this.setState({ type: itemValue })}
          >
            <Picker.Item label="Warning" value="warning" />
            <Picker.Item label="Announcement" value="exclamation" />
            <Picker.Item label="Event" value="star" />
          </Picker>
          <Input
            value={this.state.title}
            keyboardAppearance="light"
            autoFocus={false}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            inputStyle={{ marginLeft: 10 }}
            placeholder="Title"
            containerStyle={{
              borderBottomColor: 'rgba(0, 0, 0, 0.38)',
            }}
            onChangeText={title => this.setState({ title })}
            errorMessage={this.state.isTitleValid ? null : 'Please enter a valid title'}
          />
          <Input
            value={this.state.description}
            keyboardAppearance="light"
            autoFocus={false}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            inputStyle={{ marginLeft: 10 }}
            placeholder="Description"
            containerStyle={{
              borderBottomColor: 'rgba(0, 0, 0, 0.38)',
            }}
            onChangeText={description => this.setState({ description })}
            errorMessage={this.state.isDescriptionValid ? null : 'Please enter a valid description'}
          />
          <View>
            <Button
              buttonStyle={{ borderRadius: 30, backgroundColor: '#388E3C' }}
              containerStyle={{ marginTop: 20, flex: 0, backgroundColor: '#388E3C' }}
              activeOpacity={0.8}
              title="Submit Marker"
              onPress={this.submitMarker}
            />
          </View>
        </View>
      </Overlay>
    );
  }
}
