import React from 'react';
import {Button, StyleSheet, TextInput, View, Linking} from 'react-native';
import {NavigationActions} from "react-navigation";

export default class EditHabit extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: -1,
            title: '',
            description: '',
        };

        if (this.props.navigation.state.params.id !== undefined) {
            let habit = this.props.navigation.state.params;
            this.state.id = habit.id;
            this.state.title = habit.title;
            this.state.description = habit.description;
        }
    }

    editHabit() {
        let habit = this.state;
        for (let i = 0; i < global.habits.length; i++) {
            if (global.habits[i].id === habit.id) {
                global.habits[i] = habit;
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
    }

    reset(){
        return this.props
            .navigation
            .dispatch(NavigationActions.reset(
                {
                    index: 0,
                    actions: [
                        NavigationActions.navigate({ routeName: 'Home'})
                    ]
                }));
    }

    render() {
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
                            this.editHabit();
                            this.reset();
                        }}
                    />
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