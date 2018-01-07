import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';

export default class HabitView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            habit: this.props.habit,
        };
    }

    render() {
        let habit = this.state.habit;
        return (
            <View style={styles.container}>
                <Text>{habit.title}</Text>
                <Text>{habit.description}</Text>
                <Button
                    title="Edit"
                    onPress={() => {
                        this.props.navigation.navigate('EditHabit', habit);
                    }}
                />
                <Text/>
                <Button
                    title="View"
                    onPress={() => {
                        this.props.navigation.navigate('ViewHabit', habit);
                    }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 30,
        margin: 2,
        alignSelf: 'stretch',
        backgroundColor: 'white'
    },
});