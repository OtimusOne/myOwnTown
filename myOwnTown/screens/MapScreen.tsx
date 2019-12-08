import React from 'react';
import MapView, {
  AnimatedRegion,
  LatLng,
  MapEvent,
  Marker,
  Point,
  Region,
} from 'react-native-maps';
import { View, ImageURISource, ImageRequireSource, Text } from 'react-native';
import { FloatingAction } from 'react-native-floating-action';
import { firestore } from '../dbconfig';
import { iconName2Icon } from '../iconTranslate';
import MapModal from '../components/MapModal';
import AddMarkerModal from '../components/AddMarkerModal';

interface Props {}
interface ownMarkerProps {
  identifier?: string;
  reuseIdentifier?: string;
  title?: string;
  description?: string;
  image?: ImageURISource | ImageRequireSource;
  icon?: string;
  opacity?: number;
  pinColor?: string;
  coordinate: LatLng | AnimatedRegion;
  centerOffset?: Point;
  calloutOffset?: Point;
  anchor?: Point;
  calloutAnchor?: Point;
  flat?: boolean;
  draggable?: boolean;
  tracksViewChanges?: boolean;
  tracksInfoWindowChanges?: boolean;
  stopPropagation?: boolean;
  onPress?: (event: MapEvent<{ action: 'marker-press'; id: string }>) => void;
  onSelect?: (event: MapEvent<{ action: 'marker-select'; id: string }>) => void;
  onDeselect?: (event: MapEvent<{ action: 'marker-deselect'; id: string }>) => void;
  onCalloutPress?: (event: MapEvent<{ action: 'callout-press' }>) => void;
  onDragStart?: (event: MapEvent) => void;
  onDrag?: (event: MapEvent) => void;
  onDragEnd?: (event: MapEvent) => void;

  rotation?: number;
  zIndex?: number;
}
interface State {
  region?: Region;
  markers?: ownMarkerProps[];
  coordinate?: Coordinates;
  modalVisible: boolean;
  currentID: string;
  addMarkerModalVisible?: boolean;
}
interface owrRefObject<T> {
  current: T | null;
}

// const actions = [
//   {
//     text: 'Language',
//     name: 'bt_language',
//     position: 1,
//   }
// ];

export default class MapScreen extends React.Component<Props, State> {
  mapRef: owrRefObject<MapView>;

  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: 45.760696,
        longitude: 21.226788,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      markers: [],
      modalVisible: false,
      currentID: null,
      addMarkerModalVisible: false,
      coordinate: undefined,
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
    return true;
  }

  addMarker = (lat, long) => {
    const { markers } = this.state;
    let tempMarker = markers.find(obj => obj.identifier === 'temp');
    if (typeof tempMarker === 'undefined')
      tempMarker = {
        identifier: 'temp',
        coordinate: { latitude: lat, longitude: long },
        title: '',
        description: '',
        draggable: true,
        icon: 'ball',
      };
    else {
      markers.splice(markers.indexOf(tempMarker), 1);
      tempMarker.coordinate = { latitude: lat, longitude: long };
    }
    markers.push(tempMarker);
    this.mapRef.current.animateToRegion(
      {
        latitude: lat,
        longitude: long,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      },
      600,
    );
    setTimeout(() => {
      this.mapRef.current.getCamera().then(camera => {
        this.setState({ markers });
        this.mapRef.current.setCamera(camera);
      });
    }, 650);
  };

  getMarkers = () => {
    firestore
      .collection('markers')
      .where('approved', '==', true)
      .get()
      .then(snap => {
        const markers = [];
        snap.forEach(entry => {
          const { coordinate, title, description, icon, text } = entry.data();
          const { id } = entry;
          if (
            coordinate != null &&
            title != null &&
            description != null &&
            icon != null &&
            id != null
          ) {
            markers.push({
              coordinate,
              title,
              description,
              identifier: id,
              draggable: false,
              icon,
            });
          }
        });
        this.setState({ markers });
      });
  };

  handleCloseModal = () => {
    this.setState({ addMarkerModalVisible: false });
    this.getMarkers();
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
          ref={r => {
            this.mapRef.current = r;
          }}
          region={this.state.region}
          showsUserLocation
          showsMyLocationButton
          showsCompass
          onPress={mapEvent => {
            // issue when clicking on a marker, it will add a temp one on it
            // if a marker is within a minimum distance of my click, we should not add another one
            // gotta figure out
            // this.addMarker(mapEvent.nativeEvent.coordinate.latitude, mapEvent.nativeEvent.coordinate.longitude)
          }}
          // onMarkerDragEnd={e => this.setState(e.nativeEvent)}
        >
          {this.state.markers.map(marker => (
            <Marker
              key={marker.identifier}
              coordinate={marker.coordinate}
              title={marker.title}
              description={marker.description}
              draggable={marker.draggable}
              onCalloutPress={async () => {
                await this.setState({ modalVisible: true, currentID: marker.identifier });
                this.mapRef.current.animateToRegion(
                  {
                    latitude: Number(marker.coordinate.latitude),
                    longitude: Number(marker.coordinate.longitude),
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                  },
                  1000,
                );
              }}
            >
              <View>{iconName2Icon[marker.icon.toString()]}</View>
            </Marker>
          ))}
        </MapView>
        <FloatingAction
          showBackground={false}
          onOpen={() => {
            navigator.geolocation.getCurrentPosition(position => {
              this.setState({ coordinate: position.coords });
              /*
              this.mapRef.current.animateToRegion(
                {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                },
                100,
              );
              */
              this.setState({ addMarkerModalVisible: true });
              // this.addMarker(position.coords.latitude, position.coords.longitude);
            });
          }}
          color="#388E3C"
          onClose={() => {
            this.mapRef.current.animateToRegion(this.getInitialState().region, 600);
          }}
        />
        {this.state.addMarkerModalVisible && (
          <AddMarkerModal
            handleClose={() => this.handleCloseModal()}
            coordinate={this.state.coordinate}
          />
        )}
        {this.state.modalVisible && (
          <MapModal
            id={this.state.currentID}
            isVisible={this.state.modalVisible}
            closeModal={() => {
              /*
              this.mapRef.current.getCamera().then(async camera => {
                this.mapRef.current.setCamera(camera);
              });
              */
              this.setState({ modalVisible: false });
            }}
          />
        )}
      </View>
    );
  }
}
