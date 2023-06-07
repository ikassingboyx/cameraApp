import { SafeAreaView, Text,Image, Alert,View } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from "expo-media-library";
import { BackgroudColors, FontAlignments, Fonts, FontSizes, Styles, FontColors } from '../static/styles/styles';
import Clickable from './Clickable';
import { Components } from '../static/styles/styles';
export default function ImageView({navigation, route}){
    const {data} = route.params

    const handleShareClick = async () =>
    {
        Sharing.isAvailableAsync().then(yes=>{  
            if(yes)
            {
                Sharing.shareAsync(data.uri)
            }
            else{
                Alert.alert("nie możesz udostępnić pliku")
            }
        });
    }
    const handleDelteClick = async () =>{
        await MediaLibrary.deleteAssetsAsync(data)
        navigation.navigate("gallery")
    }
    const handleUploadClick = () =>{
        const formidableData = new FormData();
        formidableData.append("element", {
                uri: data.uri,
                type: 'image/jpeg',
                name: data.filename
                });
                fetch("http://192.168.119.105:3000/upload", {
                method: 'POST',
                body: formidableData
            })

    }
    
    return (
        <SafeAreaView style={[{flex:1}, BackgroudColors.LightSlate]}>
            <View style={{flex:7}}>
            <Image source={{
                uri: data.uri,
                width: data.dimentions.width,
                height:600
            }}  />
            </View>
            <Text style={[FontSizes.MediumFontSize, FontAlignments.Center]}>{data.width}x{data.height}</Text>
            <View style={{flex:1,flexDirection:"row", alignItems:"center",justifyContent:"center",gap:20}}>
                <Clickable text={"Share"} handlePress={handleShareClick} styles={[Components.Button]} />
                <Clickable text={"Delete"} handlePress={handleDelteClick} styles={[Components.Button]}/>
                <Clickable text={"Upload"} handlePress={handleUploadClick} styles={[Components.Button]}/>
            </View>
        </SafeAreaView>
    )
}