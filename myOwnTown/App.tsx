import React from 'react';
import { View, Image } from 'react-native';
import { Icon } from 'react-native-elements';
import BottomNavigation, { FullTab } from 'react-native-material-bottom-navigation';
import MapScreen from './screens/MapScreen';
import NewsScreen from './screens/NewsScreen';

interface Props {}
interface State {
  activeTab: string;
}
const redditImage = require('./assets/reddit.jpg');

export default class App extends React.Component<Props, State> {
  tabs = [
    {
      key: 'map',
      icon: 'map',
      label: 'Harta',
      barColor: '#388E3C',
      pressColor: 'rgba(255, 255, 255, 0.16)',
    },
    {
      key: 'news',
      icon: 'star',
      label: 'Anunturi',
      barColor: '#B71C1C',
      pressColor: 'rgba(255, 255, 255, 0.16)',
    },
    {
      key: 'votes',
      icon: 'comment',
      label: 'Voturi',
      barColor: '#E64A19',
      pressColor: 'rgba(255, 255, 255, 0.16)',
    },
  ];

  constructor(props) {
    super(props);
    this.state = { activeTab: 'news' };
  }

  renderIcon = (icon: string) => () => <Icon size={24} color="white" name={icon} />;

  renderTab = ({ tab, isActive }) => (
    <FullTab
      isActive={isActive}
      key={tab.key}
      label={tab.label}
      renderIcon={this.renderIcon(tab.icon)}
    />
  );

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {this.state.activeTab === 'map' && <MapScreen />}
          {this.state.activeTab === 'news' && <NewsScreen />}
          {this.state.activeTab === 'votes' && (
            <Image resizeMode="contain" style={{ width: '100%' }} source={redditImage} />
          )}
        </View>
        <BottomNavigation
          onTabPress={newTab => this.setState({ activeTab: newTab.key.toString() })}
          renderTab={this.renderTab}
          tabs={this.tabs}
        />
      </View>
    );
  }
}
/*
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
*/
