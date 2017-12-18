import React from 'react';
import HabitList from "./components/HabitList";
import EditHabit from "./components/EditHabit";
import {StackNavigator} from 'react-navigation';
import {View} from "react-native";

global.habits = [
    {
        id: 1,
        title: 'habit1',
        description: 'habit1 description',
    },
    {
        id: 2,
        title: 'habit2',
        description: 'habit2 description',
    },
];

const HabitListScreen = ({navigation}) => (
    <View>
        <HabitList navigation={navigation}/>
    </View>
);

export const HabitApp = StackNavigator({
    Home: {screen: HabitListScreen},
    EditHabit: {screen: EditHabit, path: 'EditHabit/:habit'},
});

export default class App extends React.Component {
    render() {
        return <HabitApp/>;
    }
}
