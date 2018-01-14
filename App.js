import React from 'react';
import HabitList from "./components/HabitList";
import EditHabit from "./components/EditHabit";
import {StackNavigator} from 'react-navigation';
import {Button, View, StyleSheet, Text, ScrollView} from "react-native";
import ViewHabit from "./components/ViewHabit";
import {HabitController} from "./controller/HabitController";
import UserList from "./components/UserList";

const LoginScreen = ({navigation}) => (
    <View>
        <Button
            title="Sign in with Google"
            onPress={() => {
                HabitController.getInstance().authenticateWithGoogle()
                    .then(() => {
                        let user = HabitController.getInstance().getUser();
                        if (user !== null) {
                            if (user.isAdmin) {
                                navigation.navigate('AdminView');
                            } else {
                                navigation.navigate('Home');
                            }
                        }
                    })
            }}
        />
    </View>
);

const HabitListScreen = ({navigation}) => (
    <ScrollView style={styles.container}>
        <HabitList navigation={navigation}/>
        <Button
            title="Add habit"
            onPress={() => {
                navigation.navigate('EditHabit');
            }}
        />
    </ScrollView>
);

const AdminScreen = ({navigation}) => (
    <ScrollView style={styles.container}>
        <UserList navigation={navigation}/>
    </ScrollView>
);

export const HabitApp = StackNavigator({
    Login: {screen: LoginScreen},
    Home: {screen: HabitListScreen},
    AdminView: {screen: AdminScreen},
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
    container: {
        height: 587
    }
});
