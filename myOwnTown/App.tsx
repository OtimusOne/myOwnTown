import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Icon } from 'react-native-elements';
import BottomNavigation, { FullTab } from 'react-native-material-bottom-navigation';

export default class App extends React.Component {
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

  renderIcon = icon => ({ isActive }) => <Icon size={24} color="white" name={icon} />;

  renderTab = ({ tab, isActive }) => (
    <FullTab
      isActive={isActive}
      key={tab.key}
      label={tab.label}
      renderIcon={this.renderIcon(tab.icon)}
    />
  );
  state = { activeTab: 'map' };
  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {this.state.activeTab == 'map' && (
            <Image
              resizeMode={'cover'}
              style={{ width: '100%' }}
              source={require('./assets/timisoara.png')}
            />
          )}
          {this.state.activeTab == 'news' && (
            <Image
              resizeMode={'contain'}
              style={{ width: '100%' }}
              source={require('./assets/news.jpg')}
            />
          )}
          {this.state.activeTab == 'votes' && (
            <Image
              resizeMode={'contain'}
              style={{ width: '100%' }}
              source={require('./assets/reddit.jpg')}
            />
          )}
        </View>
        <BottomNavigation
          onTabPress={newTab => this.setState({ activeTab: newTab.key })}
          renderTab={this.renderTab}
          tabs={this.tabs}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
