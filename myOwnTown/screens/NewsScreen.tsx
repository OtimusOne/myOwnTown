import React, { useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import ignoreWarnings from 'react-native-ignore-warnings';
import Icon from 'react-native-vector-icons/FontAwesome';
import MarqueeText from 'react-native-marquee';
import Announcement, { AnnouncementProps } from '../components/Announcement';
import { firestore } from '../dbconfig';

interface Props {
    uid:string
}
interface State {
  displayedPosts: AnnouncementProps[];
  loadedPosts: AnnouncementProps[];
  limit: number;
  lastDisplayed: number;
}

ignoreWarnings('Setting a timer');
export default class NewsScreen extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      displayedPosts: [],
      loadedPosts: [],
      limit: 10,
      lastDisplayed: Date.now(),
    };
    this.fetchPosts = this.fetchPosts.bind(this);
  }

  componentDidMount() {
    firestore
      .collection('news')
      .orderBy('createdOn', 'desc')
      .limit(this.state.limit)
      .get()
      .then(snap => {
        const displayedPosts = [];
        snap.forEach(entry => {
          const { title, description, createdOn, icon } = entry.data();
          const { id } = entry;
          const date = createdOn.toDate();
          displayedPosts.push({ title, description, id, createdOn: date, icon });
        });
        const lastPost = displayedPosts.slice(-1)[0];
        this.setState(prevState => ({
          displayedPosts,
          lastDisplayed: lastPost ? lastPost.createdOn : prevState.lastDisplayed,
        }));
      });
    firestore
      .collection('news')
      .orderBy('createdOn', 'desc')
      .startAfter(this.state.lastDisplayed)
      .limit(this.state.limit)
      .get()
      .then(snap => {
        const loadedPosts = [];
        snap.forEach(entry => {
          const { title, description, createdOn, icon } = entry.data();
          const { id } = entry;
          const date = createdOn.toDate();
          loadedPosts.push({ title, description, id, createdOn: date, icon });
        });
        const lastPost = loadedPosts.slice(-1)[0];
        this.setState(prevState => ({
          loadedPosts,
          lastDisplayed: lastPost ? lastPost.createdOn : prevState.lastDisplayed,
        }));
      });
  }

  fetchPosts() {
    this.setState(prevState => ({
      displayedPosts: prevState.displayedPosts.concat(prevState.loadedPosts),
      loadedPosts: [],
    }));
    firestore
      .collection('news')
      .orderBy('createdOn', 'desc')
      .startAfter(this.state.lastDisplayed)
      .limit(this.state.limit)
      .get()
      .then(snap => {
        const loadedPosts = [];
        snap.forEach(entry => {
          const { title, description, createdOn, icon } = entry.data();
          const { id } = entry;
          const date = createdOn.toDate();
          loadedPosts.push({ title, description, id, createdOn: date, icon });
        });
        const lastPost = loadedPosts.slice(-1)[0];
        this.setState(prevState => ({
          loadedPosts,
          lastDisplayed: lastPost ? lastPost.createdOn : prevState.lastDisplayed,
        }));
      });
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          height: '100%',
          width: '100%',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            backgroundColor: '#be3232',
            width: '100%',
            padding: 5,
          }}
        >
          <Icon name="newspaper-o" color="#f7e8e8" size={40} />
          <Text
            style={{
              paddingLeft: 5,
              fontSize: 24,
              color: '#f7e8e8',
            }}
          >
            News&Announcements
          </Text>
        </View>
        <FlatList
          style={{
            width: '95%',
          }}
          data={this.state.displayedPosts}
          extraData={this.state}
          renderItem={({ item }) => (
            <Announcement
              key={item.id}
              id={item.id}
              title={item.title}
              description={item.description}
              createdOn={item.createdOn}
              icon={item.icon}
            />
          )}
          keyExtractor={item => item.id}
          onEndReached={this.fetchPosts}
          onEndReachedThreshold={0.1}
          onScrollEndDrag={this.fetchPosts}
        />
        <MarqueeText
          style={{
            fontSize: 24,
            backgroundColor: '#be3232',
            color: '#f7e8e8',
          }}
          duration={4000}
          marqueeOnStart
          loop
          marqueeResetDelay={0}
        >
          ~~~~~~~~~~~~~~~~~~~~~~~~~News Flash~~~~~~~~~~~~~~~~~~~~~~~~~
        </MarqueeText>
      </View>
    );
  }
}
