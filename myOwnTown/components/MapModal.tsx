import React from 'react';
import {View, Text, Image, ScrollView, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Overlay } from 'react-native-elements';
import * as Progress from 'react-native-progress';
import HTML from 'react-native-render-html';
import { material } from 'react-native-typography'

import {firestore, storage} from "../dbconfig"



export interface MapModalProps {
    id:string
    isVisible:boolean
    closeModal: any
}
interface State {
    title:string,
    description:string,
    text:string,
    imgUrl:string,
    isVisible: boolean,
    readyToShow: boolean,
    imgHeight: number,
    imgWidth: number
}

export default class MapModalScreen extends React.Component<MapModalProps, State> {
    constructor(props) {
        super(props);
        this.state = {
            title: null,
            description: null,
            text: null,
            imgUrl: null,
            isVisible: this.props.isVisible,
            readyToShow:false,
            imgHeight: 1,
            imgWidth: 1
        }
    }

    componentDidMount() {
        firestore.collection("markers").doc(this.props.id).get().then(async (doc) => {
            if (doc.exists) {
                const {title, text, description} = doc.data();
                this.setState({title, text, description});

            }
        });
    }

    render() {
        return (
                <Overlay isVisible={this.state.isVisible}
                         onBackdropPress={this.props.closeModal}
                         overlayStyle={{
                             height: 'auto',
                             maxHeight:"80%",
                             borderWidth: 1,
                             borderColor: '#388E3C',
                             borderRadius: 20,
                         }}>
                    <View>
                        <Text style={[{alignSelf:"center"},material.title]}>{this.state.title}</Text>
                        <Text style={[{alignSelf:"center"},material.subheading]}>{this.state.description}</Text>
                        <ScrollView>
                        {this.state.text !== null ?
                            <HTML style={{alignSelf:"center", height:"80%"}} html = {this.state.text} imagesMaxWidth={Dimensions.get('window').width - 30}/>
                            : <Progress.Pie
                                style={{alignSelf:"center"}}
                                progress={80}
                                indeterminate
                            />
                        }
                        </ScrollView>
                    </View>
                </Overlay>
        )
    }
}