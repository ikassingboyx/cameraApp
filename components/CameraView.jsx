import React, { useState, useEffect,useRef } from 'react';
import { View, Text, ScrollView , Alert ,StyleSheet,Animated,Dimensions,StatusBar,BackHandler ,ToastAndroid} from 'react-native';
import { Camera } from 'expo-camera';
import * as MediaLibrary from "expo-media-library";
import { BackgroudColors, Components, Fonts, FontSizes, Styles } from '../static/styles/styles';
import ClickableImage from './ClickableImage';
const screenHeight =  Dimensions.get('window').height 
import RadioButtonGroup from './RadioButtonGroup';
export default function CameraView({navigation}) {
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [animatedPos, setAnimatedPos] = useState(new Animated.Value(screenHeight))
    const [hidden, setHidden] = useState(true)
    const [currentFlashLightMode, setCurrentFlashLightMode] = useState(Camera.Constants.FlashMode.Torch)
    const [currentWhiteBalance, setCurrentWhiteBalance] = useState(Camera.Constants.WhiteBalance.Auto)  
    const [currentRatio, setCurrentRatio] = useState({sizes:[],ratio:null})
    const [currentResulution, setCurrentResulution] = useState(null)
    const [cameraSettings, setCameraSettings] = useState({
      whiteBalances: [],
      ratios :[],
      flashMode: []
    })
    const cameraRef = useRef()
    useEffect(() => {
      (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      })();

    }, []);
  
    if (hasPermission === null) {
      return <View />;
    }
    if (hasPermission === false) {
      return <Text>No access to camera</Text>;
    }

    const takePicture = async () => {
      if (cameraRef.current) {
        const options = { quality: 1, base64: true };
        const foto = await cameraRef.current.takePictureAsync(options);
        let asset = await MediaLibrary.createAssetAsync(foto.uri); 
        // Alert.alert(JSON.stringify(asset, null, 4))
        ToastAndroid.showWithGravity(
          'Photo has been taken',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
    }
    };
    const getSizes = async () =>{
      let availableRatios = []
      const ratios = await cameraRef.current.getSupportedRatiosAsync()
      for(const ratio of ratios)
      {
        const sizes = await cameraRef.current.getAvailablePictureSizesAsync(ratio);
        availableRatios.push({ratio:ratio,sizes:sizes})
      }
      setCurrentRatio(availableRatios[0])
      setCurrentResulution(currentRatio.sizes[0])

      const whiteBalances = Object.keys(Camera.Constants.WhiteBalance)
      const flashlightModes =  Object.keys(Camera.Constants.FlashMode)
      setCameraSettings({
        ratios: [...availableRatios],
        whiteBalances : [...whiteBalances],
        flashMode : flashlightModes,
      })
    }

    const changeCameraFrontBack = () =>{
        setType(
            type === Camera.Constants.Type.back
              ? Camera.Constants.Type.front
              : Camera.Constants.Type.back
          );
    }
    const toggleAnimatedView = () =>{
      const toPos = (hidden)? 0 :screenHeight
      Animated.spring(
        animatedPos,{
          toValue:toPos, 
          velocity:1,
          tension:0,
          friction:10,
          useNativeDriver:true
        }
      ).start()
      setHidden(!hidden)

    }


    const changeWhiteBalance = (value) =>{  
      setCurrentWhiteBalance(Camera.Constants.WhiteBalance[value])      
    }
    const changeFlashLightMode = (value) =>{
      setCurrentFlashLightMode(Camera.Constants.FlashMode[value])      
    }
    const changeRatio = async (value) =>{
      const sizes = await cameraRef.current.getAvailablePictureSizesAsync(value);
      setCurrentRatio({ratio: value, sizes:sizes})
      setCurrentResulution(currentRatio.sizes[0])
    }
    const changeResulution = (value) =>{
      setCurrentResulution(currentRatio.sizes[currentRatio.sizes.indexOf(value)])
    }
    return (
      <View style={[{ flex: 4 }, BackgroudColors.LightSlate]}>
        <StatusBar />
        <Camera 
          style={{ flex: 7 }} 
          type={type} 
          ref={cameraRef}
          onCameraReady={() => getSizes()}
          ratio={currentRatio.ratio}
          whiteBalance={currentWhiteBalance}
          pictureSize={currentResulution}
          flashMode={currentFlashLightMode}
          >
          <View
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              flexDirection: 'row',
            }}>
          </View>
        </Camera>
        <View style={{ flex:3, flexDirection:"row",alignItems:"center", justifyContent:"center",gap:20 }}>
          <ClickableImage uri={"https://cdn2.iconfinder.com/data/icons/multimedia-line-icons-1/100/flip-cam-512.png"} handlePress={changeCameraFrontBack} styles={ [Styles.CenteredView,Components.CricleButton]}/>
           <ClickableImage uri={"https://static.thenounproject.com/png/2663275-200.png"}  handlePress={takePicture} styles={ [Styles.CenteredView,Components.CricleButton]}/>
           <ClickableImage uri={"https://icons.veryicon.com/png/o/miscellaneous/streamline/setting-gear.png"}  handlePress={toggleAnimatedView} styles={ [Styles.CenteredView,Components.CricleButton]}/>
        </View>
        <Animated.View
            style={[styles.animatedView,
                {
                    transform: [
                        { translateY: animatedPos}
                    ]
                }]} >
              <ScrollView>
                <RadioButtonGroup valueChange={changeFlashLightMode} buttons={cameraSettings.flashMode} header={"Flash"} />
                <RadioButtonGroup valueChange={changeRatio} buttons={cameraSettings.ratios.map((ratio)=>ratio.ratio)} header={"Ratios"} />
                <RadioButtonGroup valueChange={changeWhiteBalance} buttons={cameraSettings.whiteBalances} header={"WhiteBalance"}></RadioButtonGroup>
                <RadioButtonGroup valueChange={changeResulution} buttons={currentRatio.sizes} header={"Resolutions"}/>
              </ScrollView>
                    
        </Animated.View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({

    animatedView: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#D1CFE2",
        height: screenHeight,
        width:180,
        textAlign:"center",
        padding:10,
        paddingTop:100,
    }
});