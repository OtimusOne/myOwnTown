import React from 'react';
import { View, Text, Image, ScrollView, Dimensions, Platform } from 'react-native';
import { Overlay, Button } from 'react-native-elements';
import * as Progress from 'react-native-progress';
import HTML from 'react-native-render-html';
import { material } from 'react-native-typography';
import { Linking } from 'expo';
import { LatLng } from 'react-native-maps';
import { firestore } from '../dbconfig';

export interface MapModalProps {
  id: string;
  isVisible: boolean;
  closeModal: any;
}
interface State {
  title: string;
  description: string;
  text: string;
  isVisible: boolean;
  coordinate: LatLng;
}

export default class MapModalScreen extends React.Component<MapModalProps, State> {
  constructor(props) {
    super(props);
    this.state = {
      title: null,
      description: null,
      text: null,
      coordinate: null,
      isVisible: this.props.isVisible,
    };
  }

  componentDidMount() {
    firestore
      .collection('markers')
      .doc(this.props.id)
      .get()
      .then(async doc => {
        if (doc.exists) {
          const { title, text, description, coordinate } = doc.data();
          this.setState({ title, text, description, coordinate });
        }
      });
  }

  render() {
    return (
      <Overlay
        isVisible={this.state.isVisible}
        onBackdropPress={this.props.closeModal}
        overlayStyle={{
          height: 'auto',
          maxHeight: '80%',
          borderWidth: 1,
          borderColor: '#388E3C',
          borderRadius: 20,
        }}
      >
        <ScrollView>
          <Text style={[{ alignSelf: 'center' }, material.title]}>{this.state.title}</Text>
          <Text style={[{ alignSelf: 'center' }, material.subheading]}>
            {this.state.description}
          </Text>
          {this.state.text !== null ? (
            <View>
              {this.state.text !== null && this.state.text !== undefined && (
                <HTML
                  style={{ alignSelf: 'center' }}
                  html={this.state.text}
                  imagesMaxWidth={Dimensions.get('window').width - 30}
                />
              )}
              <Button
                title="Directions"
                buttonStyle={{ borderRadius: 30, backgroundColor: '#388E3C' }}
                onPress={() => {
                  if (Platform.OS === 'ios')
                    Linking.openURL(
                      `maps://daddr=${this.state.coordinate.latitude}+${this.state.coordinate.longitude}`,
                    );
                  else
                    Linking.openURL(
                      `google.navigation:q=${this.state.coordinate.latitude}+${this.state.coordinate.longitude}`,
                    );
                }}
              />
            </View>
          ) : (
            <Progress.Pie style={{ alignSelf: 'center' }} progress={80} indeterminate />
          )}
        </ScrollView>
      </Overlay>
    );
  }
}
