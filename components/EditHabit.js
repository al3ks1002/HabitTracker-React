import React from 'react';
import {Button, StyleSheet, TextInput, View, Linking} from 'react-native';
import {NavigationActions} from "react-navigation";
import {HabitStorage} from "../controller/HabitController";

export default class EditHabit extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: -1,
            title: '',
            description: '',
            dates: []
        };

        if (this.props.navigation.state.params !== undefined) {
            let habit = this.props.navigation.state.params;
            this.state.id = habit.id;
            this.state.title = habit.title;
            this.state.description = habit.description;
            this.state.dates = habit.dates;
        }
    }

    async editHabit() {
        let habit = this.state;

        if (habit.id === -1) {
            // add habit
            await HabitStorage.addHabit(habit.title, habit.description);
        } else {
            // edit habit
            await HabitStorage.editHabit(habit.id, habit);

            // send mail
            let body = "Habit updated!" + '\n'
                + 'Title: ' + habit.title + '\n'
                + 'Description: ' + habit.description + '\n';
            Linking.openURL(
                "mailto:al3ks1002@gmail.com" +
                "?subject=" + "Habit updated!" +
                "&body=" + body
            );
        }
    }

    async deleteHabit() {
        await HabitStorage.deleteHabit(this.state.id);
    }

    reset() {
        return this.props
            .navigation
            .dispatch(NavigationActions.reset(
                {
                    index: 0,
                    actions: [
                        NavigationActions.navigate({routeName: 'Home'})
                    ]
                }));
    }

    render() {
        let deleteButton = null;
        if (this.state.id !== -1) {
            deleteButton =
                <Button
                    title="Delete"
                    onPress={() => {
                        this.deleteHabit().then(() => {
                            this.reset();
                        });
                    }}
                />;
        }
        return (
            <View style={styles.container}>
                <View>
                    <TextInput
                        style={styles.inputText}
                        value={this.state.title}
                        onChangeText={(title) => this.setState({title})}
                    />
                    <TextInput
                        style={styles.inputText}
                        value={this.state.description}
                        onChangeText={(description) => this.setState({description})}
                    />
                </View>
                <View>
                    <Button
                        title="Save changes"
                        onPress={() => {
                            this.editHabit().then(() => {
                                this.reset();
                            });
                        }}
                    />
                    {deleteButton}
                </View>
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
    inputText: {
        height: 30,
    }
});