import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Overlay } from 'react-native-elements';

export interface MapModalProps {
    id:string
}
interface State {
    isVisible?: boolean
}

export default class MapModalScreen extends React.Component<MapModalProps, State> {
    constructor(props)
    {
        super(props);
        this.state ={
            isVisible:false
        }
    }

    render(){
        return(
            <Overlay isVisible={this.state.isVisible} onBackdropPress={() => this.setState({isVisible:false})}>
                <Text>Hello from Overlay!</Text>
            </Overlay>
        )
    }
}