import React from 'react';
import { View, Text, KeyboardAvoidingView } from 'react-native';
import ignoreWarnings from 'react-native-ignore-warnings';
import { Button, Input } from 'react-native-elements';
import LoginScreen from './LoginScreen';
import { auth } from '../dbconfig';

interface Props {
  uid: string;
}
interface State {
  loggedIn: boolean;
  inputPassword: string;
  inputDisplayName: string;
  inputMail: string;
}

ignoreWarnings('Setting a timer');
export default class NewsScreen extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      inputDisplayName: '',
      inputMail: '',
      inputPassword: '',
    };
  }

  componentDidMount() {
    this.getUID();
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    if (prevProps.uid !== this.props.uid) this.getUID();
  }

  getUID = () => {
    if (this.props.uid == null) {
      this.setState({ loggedIn: false });
    } else {
      this.getUserData();
      this.setState({ loggedIn: true });
    }
  };

  getUserData = () => {
    if (this.props.uid !== null) {
      this.setState({
        inputDisplayName: auth.currentUser.displayName,
        inputMail: auth.currentUser.email,
      });
    }
  };

  setUserData = () => {
    if (this.state.inputDisplayName !== '')
      auth.currentUser.updateProfile({ displayName: this.state.inputDisplayName });
    if (this.state.inputMail !== auth.currentUser.email)
      auth.currentUser.updateEmail(this.state.inputMail);
    if (this.state.inputPassword !== '' && this.state.inputPassword.length > 4)
      auth.currentUser.updatePassword(this.state.inputPassword);
  };

  render() {
    return (
      <View>
        {!this.state.loggedIn ? (
          <LoginScreen />
        ) : (
          <View
            style={{
              flex: 1,
              height: '100%',
              width: '100%',
              alignItems: 'center',
            }}
          >
            <Text>Welcome,</Text>

            <Input
              placeholder="Numele cu car"
              value={this.state.inputDisplayName}
              onChangeText={inputDisplayName => this.setState({ inputDisplayName })}
              containerStyle={{
                borderBottomColor: 'rgba(0, 0, 0, 0.38)',
              }}
            />
            <Input
              placeholder="Adresa de maii"
              value={this.state.inputMail}
              onChangeText={inputMail => this.setState({ inputMail })}
              containerStyle={{
                borderBottomColor: 'rgba(0, 0, 0, 0.38)',
              }}
            />
            <Input
              placeholder="Parola "
              value={this.state.inputPassword}
              onChangeText={inputPassword => this.setState({ inputPassword })}
              containerStyle={{
                borderBottomColor: 'rgba(0, 0, 0, 0.38)',
              }}
            />

            <Button
              buttonStyle={{ borderRadius: 30 }}
              containerStyle={{ marginTop: 20, flex: 0 }}
              title="Save"
              onPress={() => this.setUserData()}
            />
            <Button
              buttonStyle={{ borderRadius: 30 }}
              containerStyle={{ marginTop: 20, flex: 0 }}
              title="Logout"
              onPress={() => auth.signOut().then(() => {})}
            />
          </View>
        )}
      </View>
    );
  }
}
