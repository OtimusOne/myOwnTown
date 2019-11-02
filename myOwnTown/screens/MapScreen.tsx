import React from 'react';
import MapView, { Marker, Region, MarkerProps } from 'react-native-maps';
import { View } from 'react-native';

interface Props {}
interface State {
  region?: Region;
  markers?: MarkerProps[];
}
export default class MapScreen extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: 45.760696,
        longitude: 21.226788,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      markers: [
        {
          identifier: '0',
          coordinate: {
            latitude: 45.760696,
            longitude: 21.226788,
          },
          title: 'title',
          description: 'description',
        },
      ],
    };
    this.getInitialState = this.getInitialState.bind(this);
  }

  getInitialState() {
    return {
      region: {
        latitude: 45.760696,
        longitude: 21.226788,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
    };
  }

  render() {
    return (
      <View
        style={{
          height: '100%',
          width: '100%',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
        <MapView
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          region={this.state.region}
          showsUserLocation={true}
          showsMyLocationButton={true}
          showsCompass={true}
          zoomControlEnabled={true}
          toolbarEnabled={true}
        >
          {this.state.markers.map(marker => (
            <Marker
              key={marker.identifier}
              coordinate={marker.coordinate}
              title={marker.title}
              description={marker.description}
            />
          ))}
        </MapView>
      </View>
    );
  }
}
