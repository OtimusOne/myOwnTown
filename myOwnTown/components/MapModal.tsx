import React from 'react';
import { View, Text, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Overlay } from 'react-native-elements';
import * as Progress from 'react-native-progress';
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
            readyToShow:false
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
                <Overlay isVisible={this.state.isVisible} onBackdropPress={this.props.closeModal}>
                    <View>
                        {this.state.readyToShow ?
                            <View>
                                <Text>Hello {this.state.title}, we got this {this.state.text}, and
                                    this {this.state.description},
                                    aaaand this </Text>
                            </View>
                            : <Progress.Pie
                                progress={80}
                                indeterminate
                            />
                        }
                        <Image style={{height: 200, width: 200}} source={{uri: this.state.imgUrl}} onLoadEnd={() => this.setState({readyToShow:true})}/>
                    </View>
                </Overlay>
        )
    }
}