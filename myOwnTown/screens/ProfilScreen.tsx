import React, { useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import ignoreWarnings from 'react-native-ignore-warnings';
import {Button} from "react-native-elements"
import Icon from 'react-native-vector-icons/FontAwesome';
import MarqueeText from 'react-native-marquee';
import Announcement, { AnnouncementProps } from '../components/Announcement';
import LoginScreen from './LoginScreen';
import {auth, firestore} from '../dbconfig';

interface Props {
    uid:string
}
interface State {
    loggedIn:boolean;
}

ignoreWarnings('Setting a timer');
export default class NewsScreen extends React.Component<Props, State> {

  constructor(props) {
    super(props);
    this.state = {
        loggedIn: false
    };
  }

  componentDidMount() {
    if (this.props.uid == null)
    {
      this.setState({loggedIn:false});
    }
    else
    {
        this.setState({loggedIn:true});
    }
  }

  shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<State>, nextContext: any): boolean {
      return ((this.state.loggedIn !== nextState.loggedIn) || (this.props.uid !== nextProps.uid))
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
          {!this.state.loggedIn ? <LoginScreen/> :
              <View>
                  <Button title={"Logout"} onPress={() => auth.signOut().then(()=>this.forceUpdate())}/>
              </View>
          }
      </View>
    );
  }
}
