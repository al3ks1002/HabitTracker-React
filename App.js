import React from 'react';
import HabitList from "./components/HabitList";
import EditHabit from "./components/EditHabit";
import {StackNavigator} from 'react-navigation';
import {Button, View, StyleSheet, Text} from "react-native";
import ViewHabit from "./components/ViewHabit";

const HabitListScreen = ({navigation}) => (
    <View>
        <HabitList navigation={navigation}/>
        <Button
            title="Add habit"
            onPress={() => {
                navigation.navigate('EditHabit');
            }}
        />
    </View>
);

export const HabitApp = StackNavigator({
    Login: {screen: LoginScreen},
    Home: {screen: HabitListScreen},
    EditHabit: {screen: EditHabit, path: 'EditHabit/:habit'},
    ViewHabit: {screen: ViewHabit, path: 'ViewHabit/:habit'},
});

export default class App extends React.Component {
    render() {
        return <HabitApp/>;
    }
}

const styles = StyleSheet.create({
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
});
