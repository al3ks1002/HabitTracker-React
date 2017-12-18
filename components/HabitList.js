import React from 'react';
import {ListView, View} from 'react-native';
import HabitView from "./HabitView";

export default class HabitList extends React.Component {
    constructor(props) {
        super(props);

        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});
        this.state = {
            dataSource: ds.cloneWithRows(global.habits),
        };
    }

    renderRow(habit) {
        return (
            <View>
                <HabitView habit={habit} navigation={this.props.navigation}/>
            </View>
        );
    }

    render() {
        return (
            <View>
                <ListView dataSource={this.state.dataSource} renderRow={this.renderRow.bind(this)}/>
            </View>
        );
    }
}
