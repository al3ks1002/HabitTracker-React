import React from 'react';
import {Button, StyleSheet, TextInput, View, Linking} from 'react-native';
import {NavigationActions} from "react-navigation";
import {HabitController} from "../controller/HabitController";

export default class EditHabit extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: -1,
            title: '',
            description: '',
            email: ''
        };

        if (this.props.navigation.state.params !== undefined) {
            let habit = this.props.navigation.state.params;
            this.state.id = habit.id;
            this.state.title = habit.title;
            this.state.description = habit.description;
            this.state.email = habit.email;
        }
    }

    async editHabit() {
        let habit = this.state;

        if (habit.id === -1) {
            // add habit
            await HabitController.getInstance().addHabit(habit.title, habit.description);
        } else {
            // edit habit
            await HabitController.getInstance().editHabit(habit);

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
        let habit = this.state;
        await HabitController.getInstance().deleteHabit(habit);
    }

    render() {
        let deleteButton = null;
        if (this.state.id !== -1) {
            deleteButton =
                <Button
                    title="Delete"
                    onPress={() => {
                        this.deleteHabit().then(() => {
                            this.props.navigation.goBack();
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
                                this.props.navigation.goBack();
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