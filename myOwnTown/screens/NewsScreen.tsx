import React from 'react';
import { View, Text, FlatList } from 'react-native';
import ignoreWarnings from 'react-native-ignore-warnings';
import { firestore } from '../dbconfig';
import Announcement from '../components/Announcement';

interface Props {}
interface State {
  news: announcement[];
  limit: number;
}
interface announcement {
  id: string;
  title: string;
  description: string;
}

ignoreWarnings('Setting a timer');
export default class NewsScreen extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      news: [],
      limit: 10,
    };
    this.onEndReached = this.onEndReached.bind(this);
    this.fetchNews();
  }

  onEndReached() {
    this.setState(prevState => {
      return { limit: prevState.limit + 5 };
    });
    this.fetchNews();
  }

  fetchNews() {
    firestore
      .collection('news')
      .limit(this.state.limit)
      .get()
      .then(snap => {
        const news = [];
        snap.forEach(entry => {
          const { title, description } = entry.data();
          const { id } = entry;
          news.push({ title, description, id });
        });
        this.setState({ news });
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
        <Text
          style={{
            paddingLeft: 5,
            paddingVertical: 5,
            fontFamily: 'Roboto',
            fontSize: 18,
          }}
        >
          News&Announcements
        </Text>

        <FlatList
          style={{
            width: '95%',
            margin: 1,
          }}
          data={this.state.news}
          renderItem={({ item }) => (
            <Announcement title={item.title} description={item.description} />
          )}
          keyExtractor={item => item.id}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={0.7}
        />
        <Text
          style={{
            paddingLeft: 5,
            paddingVertical: 5,
            fontFamily: 'Roboto',
            fontSize: 18,
          }}
        >
          Footer
        </Text>
      </View>
    );
  }
}
