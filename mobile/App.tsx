/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

// import type {PropsWithChildren} from 'react';
import {
  // SafeAreaView,
  // ScrollView,
  // StatusBar,
  // StyleSheet,
  // Text,
  // useColorScheme,
  // View,
} from 'react-native';

import {
} from 'react-native/Libraries/NewAppScreen';

// Main App Component
function App(): React.JSX.Element {
    console.log('App Component');


    return (
        <View style={styles.container}>
            <Text style={styles.text}></Text>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center', // Centre verticalement
        alignItems: 'center', // Centre horizontalement
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center', // Centre le texte lui-même
    },
});



export default App;
