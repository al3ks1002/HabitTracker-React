import React from 'react';
import {ListView, StyleSheet, Text, View} from 'react-native';
import {HabitController} from "../controller/HabitController";

export default class UserList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: false,
            users: []
        };
    }

    async componentDidMount() {
        const users = await HabitController.getInstance().getUsers();
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});
        this.setState({
            dataSource: ds.cloneWithRows(users),
            loaded: true,
            users: users
        });
    }

    renderRow(user) {
        let isAdminText = "is not admin.";
        if(user.isAdmin) {
            isAdminText = "is admin.";
        }
        return (
            <View>
                <Text>{user.email} {isAdminText}</Text>
            </View>
        );
    }

    render() {
        if (this.state.loaded) {
            if (this.state.users.length > 0) {
                return (
                    <View>
                        <ListView dataSource={this.state.dataSource} renderRow={this.renderRow.bind(this)}/>
                    </View>
                );
            } else {
                return (
                    <View>
                        <Text>No Users</Text>
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
