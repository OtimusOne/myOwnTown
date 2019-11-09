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
                const {title, text, description, img} = doc.data();
                const ref = storage.ref(img);
                const imgUrl = await ref.getDownloadURL();
                this.setState({title, text, description, imgUrl});
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
                    <ScrollView>
                        {this.state.readyToShow && this.state.text !== null ?
                            <View>
                                <Text style={[{alignSelf:"center"},material.title]}>{this.state.title}</Text>
                                <Text style={[{alignSelf:"center"},material.subheading]}>{this.state.description}</Text>

                                <HTML style={{alignSelf:"center"}} html = {this.state.text} imagesMaxWidth={Dimensions.get('window').width - 30}/>
                            </View>
                            : <Progress.Pie
                                style={{alignSelf:"center"}}
                                progress={80}
                                indeterminate
                            />
                        }
                        <Image style={{height: this.state.imgHeight, width: this.state.imgWidth, alignSelf:"center"}} source={{uri: this.state.imgUrl}} onLoadEnd={() => this.setState({readyToShow:true, imgHeight:0, imgWidth:0})}/>
                    </ScrollView>
                </Overlay>
        )
    }
}