import React from 'react';
import {ListView, Text, View} from 'react-native';
import HabitView from "./HabitView";
import {HabitStorage} from "../storage/HabitStorage";

export default class HabitList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: false,
            habits: []
        };
    }

    async componentDidMount() {
        const habits = await HabitStorage.getHabits();
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});
        this.setState({
            dataSource: ds.cloneWithRows(habits),
            loaded: true,
            habits: habits
        });
    }

    async shouldComponentUpdate() {
        const habits = await HabitStorage.getHabits();
        return habits !== this.state.habits;
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
