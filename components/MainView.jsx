import { SafeAreaView, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import {Styles,Fonts,FontSizes,FontAlignments, FontColors, BackgroudColors} from "../static/styles/styles" 

export default function MainView({navigation}){
    return (
        <SafeAreaView style={[Styles.CenteredView,  BackgroudColors.LightSlate]}>
            <Text style={[Fonts.bold, FontSizes.XLargeFontSize, FontAlignments.Center, FontColors.DarkSlateBlue]} onPress={() => navigation.navigate("gallery")}>Camera App</Text>
            {/* <Text style={[Fonts.medium,  FontSizes.LargeFontSize]}>MEDIUM medium</Text>
            <Text style={[Fonts.regular, FontSizes.MediumFontSize]}>regular REGULAR</Text>
            <Text style={[Fonts.regularItalic, FontSizes.SmallFontSize]}>REGULAR italic</Text>
            <Text style={[Fonts.light, FontSizes.XSmallFontSize]}>LIGHT light</Text> */}
        </SafeAreaView>
    )
}
