import React from 'react';
import {ListView, StyleSheet, Text, View} from 'react-native';
import HabitView from "./HabitView";
import {HabitController} from "../controller/HabitController";

export default class HabitList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: false,
            habits: []
        };
    }

    async componentDidMount() {
        const habits = await HabitController.getInstance().getHabits(HabitController.getInstance().getUser().email);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});
        this.setState({
            dataSource: ds.cloneWithRows(habits),
            loaded: true,
            habits: habits
        });
        HabitController.getInstance().attach(this.update.bind(this));
    }

    async update() {
        this.setState({loaded: false});
        HabitController.getInstance().getHabitsFromAsyncStorage()
            .then((habits) => {
                const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});
                this.setState({
                    dataSource: ds.cloneWithRows(habits),
                    loaded: true,
                    habits: habits
                });
            })
    }

    renderRow(habit) {
        return (
            <View>
                <HabitView habit={habit} navigation={this.props.navigation}/>
            </View>
        );
    }

    render() {
        if (this.state.loaded) {
            if (this.state.habits.length > 0) {
                return (
                    <View>
                        <ListView dataSource={this.state.dataSource} renderRow={this.renderRow.bind(this)}/>
                    </View>
                );
            } else {
                return (
                    <View>
                        <Text>No habits</Text>
                    </View>
                )
            }
        } else {
            return (
                <Text>Waiting to load...</Text>
            )
        }
    }
}

