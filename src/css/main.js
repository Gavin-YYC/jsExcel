import React, {StyleSheet, Dimensions, PixelRatio} from "react-native";
const {width, height, scale} = Dimensions.get("window"),
    vw = width / 100,
    vh = height / 100,
    vmin = Math.min(vw, vh),
    vmax = Math.max(vw, vh);

export default StyleSheet.create({
    "wrapper": {
        "width": 400,
        "marginTop": 100,
        "marginRight": "auto",
        "marginBottom": 0,
        "marginLeft": "auto"
    },
    "wrapper drop": {
        "height": 300,
        "lineHeight": 300,
        "fontSize": 40,
        "border": "2px dashed #bbb",
        "borderRadius": 5,
        "paddingTop": 25,
        "paddingRight": 25,
        "paddingBottom": 25,
        "paddingLeft": 25,
        "textAlign": "center",
        "color": "#bbb"
    },
    "loading": {
        "position": "fixed",
        "top": 0,
        "left": 0,
        "right": 0,
        "bottom": 0,
        "color": "#fff",
        "backgroundColor": "rgba(0, 0, 0, 0.8)",
        "textAlign": "center",
        "fontSize": 40,
        "paddingTop": 300,
        "display": "none"
    },
    "preview": {
        "width": "70%",
        "marginTop": 0,
        "marginRight": "auto",
        "marginBottom": 0,
        "marginLeft": "auto"
    },
    "preview title": {
        "textAlign": "center",
        "fontWeight": "bold"
    },
    "modal modal-body check-area": {
        "paddingTop": 15,
        "paddingRight": 15,
        "paddingBottom": 15,
        "paddingLeft": 15,
        "marginBottom": 15,
        "borderBottom": "1px solid #e5e5e5"
    }
});