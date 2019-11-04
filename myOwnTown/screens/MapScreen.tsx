import React from 'react';
import MapView, {Camera, LatLng, Marker, MarkerProps, Region} from 'react-native-maps';
import { View } from 'react-native';
import { FloatingAction } from "react-native-floating-action";
import {firestore} from "../dbconfig"

interface Props {}
interface State {
  region?: Region;
  markers?: MarkerProps[];
  coordinate?: LatLng;
}
const actions = [
  {
    text: "Accessibility",
    name: "bt_accessibility",
    position: 2
  },
  {
    text: "Language",
    name: "bt_language",
    position: 1
  },
  {
    text: "Location",
    name: "bt_room",
    position: 3
  },
  {
    text: "Video",
    name: "bt_videocam",
    position: 4
  }
];

export default class MapScreen extends React.Component<Props, State> {
  mapRef: React.RefObject<MapView>;

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
    this.mapRef = React.createRef();
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

  componentDidMount(): void {
      this.getMarkers();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.coordinate === nextState.coordinate;

  }

  getMarkers = () =>
  {
    firestore.collection("markers").get().then(snap =>{
      const markers = [];
      snap.forEach(entry => {
        const {coordinate, title, description} = entry.data();
        const {id} = entry;
        markers.push({coordinate, title, description, identifier: id});
      });
      this.setState({markers})
    });
  };

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
          ref={(r) => {this.mapRef.current = r}}
          region={this.state.region}
          showsUserLocation
          showsMyLocationButton
          showsCompass
          zoomControlEnabled
          toolbarEnabled
          onMarkerDragEnd = {e => this.setState(e.nativeEvent)}
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
        <FloatingAction
            actions={actions}
            onPressItem={name => {
              console.log( "Da");
            }}
        />
      </View>
    );
  }
}