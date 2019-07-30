import {Image,FlatList, View, Text, StyleSheet, TextInput,TouchableOpacity } from "react-native";
import React, { Component } from "react";
import Config from "../Config"

export default class SearchScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      search : 'undefined',
      isloading : true,
      location : null,
      mylatitude : null,
      mylongitude : null,
    };
    this.arrayholder = [];
    this.findCoordinates();
  }

  findCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
      position => { 
        const location = JSON.stringify(position);
        console.log(position.coords.latitude);
        console.log(position.coords.longitude);

        this.setState({mylatitude : position.coords.latitude});
        this.setState({mylongitude : position.coords.longitude});

        this.setState({ location : location });
      
      },
      error => Alert.alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  //search url 따로 만들어서 하기 
  async searchDB() {
    var joined = [];
    //console.log(Config.host + '/get/search/trip/'+ String(this.state.search));
    await fetch(Config.host + '/get/search/trip/'+ String(this.state.search))
    .then((resopnse) => resopnse.json())
    .then((resopnseJson) => { 
      console.log(resopnseJson); 
      joined = joined.concat(resopnseJson);
      })
    .catch((error) => { alert(error); });

    await fetch(Config.host + '/get/search/marker/' + String(this.state.search))
    .then((resopnse) => resopnse.json())
    .then((resopnseJson) => { 
      console.log(resopnseJson); 
      joined = joined.concat(resopnseJson);
      this.setState({ arrayholder: joined })
      })
    .catch((error) => { alert(error); });
  }

  async searchGPS(){
    console.log("mylocation " + this.state.mylatitude + " " + this.state.mylongitude);
    var joined = [];
    await fetch(Config.host + '/get/search/gpsmarker/'+String(this.state.mylatitude)+'/'+String(this.state.mylongitude))
    .then((resopnse) => resopnse.json())
    .then((resopnseJson) => { 
      console.log(resopnseJson); 
      joined = joined.concat(resopnseJson);
      this.setState({ arrayholder: joined })
      })
    .catch((error) => { alert(error); });
  }

  onPressTour(item) {
    this.props.navigation.navigate('Tour3', item);
  }

  onPressFindMylocation() {
    this.findCoordinates();
    //console.log(this.state.location.coords);
    this.searchGPS();
  }

  onPressMarker(item) {
    // this.props.navigation.navigate('Tour3', item);
  }

  //search 하는 부분 url 어떻게 만들 것인지 생각해보기
  _makeCard = ({ item }) => {
    if (item.doctype == "trip") {
      return (
        <View style={styles.CardContainer}>
          <TouchableOpacity onPress={() => this.onPressTour(item)}>
            <Image source={{ uri: Config.host + "/picture/" + item.mainImage }} style={{ width: "100%", height: 300, borderRadius: 4 }} />
            <Text style={styles.CardTitle}>[여행] {item.title}</Text>
            <Text style={styles.CardContent}>{item.userEmail}</Text>
            <Text style={styles.CardContent}>{item.dayList[0] + "~" + item.dayList[item.dayList.length - 1]}</Text>
          </TouchableOpacity>
        </View>
      )
    }
    else {
      return(
      <View style={styles.CardContainer}>
        <TouchableOpacity activeOpacity={0.6}>
        <Image source={{ uri: Config.host + "/picture/" + item.mainImage }} style={{ width: "100%", height: 300, borderRadius: 4 }} />
          <Text style={styles.CardTitle}>마커 {item.title}</Text>
          <Text style={styles.CardTitle}>시간 : {item.timeStamp}</Text>
          <Text style={styles.CardTitle}>설명 : {item.description}</Text>

        </TouchableOpacity>
      </View>
      )
    }
  };

  render() {
    return (
      <View style={styles.container}>
      <TextInput style={styles.textBox} 
      returnKeyType={'search'} 
      onChangeText={(search) => this.setState({search})} 
      placeholder="검색할 내용을 입력하세요"
      onSubmitEditing={()=>this.searchDB()}
       />
      <TouchableOpacity style={styles.buttonContainer} onPress={() => this.onPressFindMylocation()}>
          <Text style={styles.text}>내 위치 주변 마커 검색</Text>
      </TouchableOpacity>
      <FlatList
        data = {this.state.arrayholder}
        renderItem = {this._makeCard}
        keyExtractor = {(item) => item._id}
      />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //alignItems: "center",
    //justifyContent: "center"
  },
  textBox:
  {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    margin: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    borderColor: '#000',
    borderWidth: 1
  },
 
  visibilityBtn:
  {
    position: 'absolute',
    right: 3,
    height: 50,
    width: 50,
    padding: 5
  },
  CardContainer: {
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    margin: 20,
  },
  CardTitle: {
    width: '100%',
    fontWeight: 'bold',
    fontSize: 20,
    padding: 3
  },
  CardContent: {
    width: '100%',
    fontSize: 12,
    padding: 3
  },  
  buttonContainer: {
    display: 'flex',
    height: 50,
    margin : 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: '#2AC062',
    shadowColor: '#2AC062',
    shadowOpacity: 0.4,
    shadowOffset: { height: 10, width: 0 },
    shadowRadius: 20,
},
});
