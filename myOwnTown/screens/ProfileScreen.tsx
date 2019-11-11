import React, {Component, RefObject} from 'react';
import {
    StyleSheet,
    View,
    ImageBackground,
    Dimensions,
    LayoutAnimation,
    UIManager,
    Platform,
    KeyboardAvoidingView, Image, AsyncStorage,
} from 'react-native';
import {Input, Button, Icon, CheckBox, InputProps} from 'react-native-elements';
import {SplashScreen} from "expo";
import {auth} from "../dbconfig";


const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const BG_IMAGE = require('../assets/bg.png');



// eslint-disable-next-line react/prop-types
const TabSelector = ({ selected }) => {
    return (
        <View style={styles.selectorContainer}>
            <View style={selected && styles.selected} />
        </View>
    );
};

// Enable LayoutAnimation on Android
// eslint-disable-next-line no-unused-expressions
UIManager.setLayoutAnimationEnabledExperimental &&
UIManager.setLayoutAnimationEnabledExperimental(true);

interface Props {}

interface State {
    email:string,
    password: string,
    passwordConfirmation: string,
    selectedCategory: any,
    isLoading:boolean,
    isDisabled:boolean,
    isEmailValid:boolean,
    isPasswordValid:boolean,
    isConfirmationValid: boolean,
    checked:boolean

}
interface owrInput<T> {
    current: T | null
}


export default class ProfileScreen extends React.Component<Props, State> {
    emailInput: owrInput<Input>;

    passwordInput: owrInput<Input>;

    confirmationInput: owrInput<Input>;

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            passwordConfirmation:"",
            selectedCategory: 0,
            isLoading: false,
            isDisabled: true,
            isEmailValid: true,
            isPasswordValid: true,
            isConfirmationValid: true,
            checked:false,
        };

        this.selectCategory = this.selectCategory.bind(this);
        this.login = this.login.bind(this);
        this.signUp = this.signUp.bind(this);
        this.emailInput = React.createRef();
        this.passwordInput = React.createRef();
        this.confirmationInput = React.createRef();
    }

    componentDidMount() {
    }

    checkText = () =>{
        this.setState((prevState, props) => ({checked: !prevState.checked, isDisabled: !prevState.isDisabled}))
    };

    interpretError = (string) => {
        switch(string)
        {
            case "auth/email-already-in-use": this.setState({isEmailValid: false, isLoading:false});this.emailInput.current.shake(); break;
            case "auth/user-disabled": this.setState({isEmailValid: false, isLoading:false}); this.emailInput.current.shake(); break;
            case "auth/invalid-email": this.setState({isEmailValid: false, isLoading:false}); this.emailInput.current.shake(); break;
            case "auth/user-not-found": this.setState({isEmailValid: false, isLoading:false}); this.emailInput.current.shake(); break;
            case "auth/weak-password": this.setState({isPasswordValid: false, isLoading:false}); this.passwordInput.current.shake(); break;
            case "auth/wrong-password": this.setState({isPasswordValid: false, isLoading:false}); this.passwordInput.current.shake(); break;
            default: alert("The error might be ours, or you do not have internet connection. Contact us")
        }
    };

    selectCategory(selectedCategory) {
        LayoutAnimation.easeInEaseOut();
        this.setState({
            selectedCategory,
            isLoading: false,
        });
    }

    signUp() {
        this.setState({ isLoading: true, isEmailValid:true, isPasswordValid:true, isConfirmationValid:true});
        if(this.state.passwordConfirmation === this.state.password && this.state.checked === true) {
            auth
                .createUserWithEmailAndPassword(this.state.email, this.state.password)
                .then(async () => {
                    this.setState({isLoading:false});
                    await AsyncStorage.setItem("newAcc", "Yes");

                })
                .catch((error) => this.interpretError(error.code));
        }
        else
        {
            this.setState({isConfirmationValid: false, isLoading:false});
            this.confirmationInput.current.shake();
        }

    }

    login() {
        const { email, password } = this.state;
        this.setState({ isLoading: true, isEmailValid:true, isPasswordValid:true, isConfirmationValid:true});

        auth
            .signInWithEmailAndPassword(email, password)
            .then(() => {})
            .catch(error => this.interpretError(error.code));
        this.setState({isLoading:false});

    }

    render() {
        const {
            selectedCategory,
            isLoading,
            isDisabled,
            isEmailValid,
            isPasswordValid,
            isConfirmationValid,
            email,
            password,
            passwordConfirmation,
        } = this.state;
        const isLoginPage = selectedCategory === 0;
        const isSignUpPage = selectedCategory === 1;

        return (
            <View style={styles.container}>
                <ImageBackground source={BG_IMAGE} style={styles.bgImage} onLoadEnd={() => SplashScreen.hide()}>
                    <View>
                        <KeyboardAvoidingView
                            contentContainerStyle={styles.loginContainer}
                            behavior={Platform.OS === "ios" ? "padding" : null}
                            style={{ flex: 1 , alignItems:"center"}}
                        >
                            <View style={styles.titleContainer}>
                                <View>
                                    <Image
                                        /* eslint-disable-next-line global-require */
                                        style={{height:150, width:SCREEN_WIDTH - 30, resizeMode:"cover"}}
                                    />
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Button
                                    disabled={isLoading}
                                    type="clear"
                                    activeOpacity={0.7}
                                    onPress={() => this.selectCategory(0)}
                                    containerStyle={{ flex: 1 }}
                                    titleStyle={[
                                        styles.categoryText,
                                        isLoginPage && styles.selectedCategoryText,
                                    ]}
                                    title='Login'
                                />
                                <Button
                                    disabled={isLoading}
                                    type="clear"
                                    activeOpacity={0.7}
                                    onPress={() => this.selectCategory(1)}
                                    containerStyle={{ flex: 1 }}
                                    titleStyle={[
                                        styles.categoryText,
                                        isSignUpPage && styles.selectedCategoryText,
                                    ]}
                                    title='Sign up'
                                />
                            </View>
                            <View style={styles.rowSelector}>
                                <TabSelector selected={isLoginPage} />
                                <TabSelector selected={isSignUpPage} />
                            </View>
                            <View style={styles.formContainer}>
                                <Input
                                    leftIcon={
                                        <Icon
                                            name="envelope-o"
                                            type="font-awesome"
                                            color="rgba(0, 0, 0, 0.38)"
                                            size={25}
                                            style={{ backgroundColor: 'transparent' }}
                                        />
                                    }
                                    value={email}
                                    keyboardAppearance="light"
                                    autoFocus={false}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    keyboardType="email-address"
                                    returnKeyType="next"
                                    inputStyle={{ marginLeft: 10 }}
                                    placeholder='Email'
                                    containerStyle={{
                                        borderBottomColor: 'rgba(0, 0, 0, 0.38)',
                                    }}
                                    ref={input => {this.emailInput.current = input}}
                                    onSubmitEditing={() => this.passwordInput.current.focus()}
                                    /* eslint-disable-next-line no-shadow */
                                    onChangeText={email => this.setState({ email })}
                                    errorMessage={
                                        isEmailValid ? null : 'Please enter a valid email address'
                                    }
                                />

                                <Input
                                    leftIcon={
                                        <Icon
                                            name="lock"
                                            type="simple-line-icon"
                                            color="rgba(0, 0, 0, 0.38)"
                                            size={25}
                                            style={{ backgroundColor: 'transparent' }}
                                        />
                                    }
                                    value={password}
                                    keyboardAppearance="light"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    secureTextEntry
                                    returnKeyType={isSignUpPage ? 'next' : 'done'}
                                    blurOnSubmit
                                    containerStyle={{
                                        marginTop: 16,
                                        borderBottomColor: 'rgba(0, 0, 0, 0.38)',
                                    }}
                                    inputStyle={{ marginLeft: 10 }}
                                    placeholder='Password'
                                    ref={input => {this.passwordInput.current = input}}
                                    onSubmitEditing={() =>
                                        isSignUpPage ? this.confirmationInput.current.focus() : this.login()
                                    }
                                    /* eslint-disable-next-line no-shadow */
                                    onChangeText={password => this.setState({ password })}
                                    errorMessage={
                                        isPasswordValid
                                            ? null
                                            : 'Password is weak, try another one'
                                    }
                                />
                                {isSignUpPage && (
                                    <Input
                                        leftIcon={
                                            <Icon
                                                name="lock"
                                                type="simple-line-icon"
                                                color="rgba(0, 0, 0, 0.38)"
                                                size={25}
                                                style={{ backgroundColor: 'transparent' }}
                                            />
                                        }
                                        value={passwordConfirmation}
                                        secureTextEntry
                                        keyboardAppearance="light"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        keyboardType="default"
                                        returnKeyType='next'
                                        blurOnSubmit
                                        containerStyle={{
                                            marginTop: 16,
                                            borderBottomColor: 'rgba(0, 0, 0, 0.38)',
                                        }}
                                        inputStyle={{ marginLeft: 10 }}
                                        placeholder='Confirm password'
                                        ref={input => {this.confirmationInput.current = input}}
                                        /* eslint-disable-next-line no-shadow */
                                        onChangeText={passwordConfirmation =>
                                            this.setState({ passwordConfirmation })
                                        }
                                        errorMessage={
                                            isConfirmationValid
                                                ? null
                                                : 'Please enter the same password'
                                        }
                                    />
                                ) }
                                {isSignUpPage && (
                                    <CheckBox
                                        title="I agree "
                                        checked={this.state.checked}
                                        containerStyle={{width:"95%", backgroundColor:"transparent"}}
                                        onPress={() => this.checkText()}
                                    />
                                )}
                                <View>
                                    <Button
                                        buttonStyle={styles.loginButton}
                                        containerStyle={{ marginTop: 32, flex: 0 }}
                                        activeOpacity={0.8}
                                        title={isLoginPage ? 'LOGIN' : 'SIGN UP'}
                                        onPress={isLoginPage ? this.login : this.signUp}
                                        titleStyle={styles.loginTextButton}
                                        loading={isLoading}
                                        disabled={isLoading || (isDisabled && !isLoginPage)}
                                    />
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                    </View>
                </ImageBackground>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    rowSelector: {
        height: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectorContainer: {
        flex: 1,
        alignItems: 'center',
    },
    selected: {
        position: 'absolute',
        borderRadius: 50,
        height: 0,
        width: 0,
        top: -5,
        borderRightWidth: 70,
        borderBottomWidth: 70,
        borderColor: 'white',
        backgroundColor: 'white',
    },
    loginContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginTextButton: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
    },
    loginButton: {
        backgroundColor: 'rgba(232, 147, 142, 1)',
        borderRadius: 10,
        marginRight:"25%",
        marginLeft:"25%",
    },
    titleContainer: {
        marginTop:50,
        backgroundColor: 'transparent',
        justifyContent: 'center',
    },
    formContainer: {
        backgroundColor: 'white',
        width: SCREEN_WIDTH - 30,
        borderRadius: 10,
        paddingTop: 32,
        paddingBottom: 32,
        alignItems: 'center',
    },
    loginText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    bgImage: {
        flex: 1,
        top: 0,
        left: 0,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 24,
        backgroundColor: 'transparent',
        opacity: 0.54,
    },
    selectedCategoryText: {
        opacity: 1,
    },
    titleText: {
        color: 'white',
        fontSize: 50,
    },
    helpContainer: {
        height: 64,
        alignItems: 'center',
        justifyContent: 'center',
    },
});