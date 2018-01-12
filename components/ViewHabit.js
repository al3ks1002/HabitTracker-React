import React from 'react';
import {Button, StyleSheet, View, Text} from 'react-native';
import {NavigationActions} from "react-navigation";
import DatePicker from 'react-native-datepicker'
import {Bar} from 'react-native-pathjs-charts';

import {HabitStorage} from "../controller/HabitController";

export default class ViewHabit extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            habit: {
                id: -1,
                title: '',
                description: '',
                dates: [],
            },
            currentDate: "2018-01-15",
            chartData: [],
        };

        if (this.props.navigation.state.params !== undefined) {
            let habit = this.props.navigation.state.params;
            this.state.habit.id = habit.id;
            this.state.habit.title = habit.title;
            this.state.habit.description = habit.description;
            this.state.habit.dates = habit.dates.sort((a, b) => new Date(a) - new Date(b));

            this.updateChart();
        }
    }

    async addDate() {
        for (let date of this.state.habit.dates) {
            if (date === this.state.currentDate) {
                return;
            }
        }
        this.state.habit.dates.push(this.state.currentDate);
        this.state.habit.dates = this.state.habit.dates.sort((a, b) => new Date(a) - new Date(b));
        this.updateChart();
        await HabitStorage.editHabit(this.state.habit.id, this.state.habit);
    }

    async deleteDate() {
        let index = this.state.habit.dates.indexOf(this.state.currentDate);
        if (index > -1) {
            this.state.habit.dates.splice(index, 1);
            this.updateChart();
            await HabitStorage.editHabit(this.state.habit.id, this.state.habit);
        }
    }

    addDays(dateString, days) {
        let date = new Date(dateString);
        date.setDate(date.getDate() + days);
        return date;
    }

    updateChart() {
        this.state.chartData = [];

        if (this.state.habit.dates.length === 0) {
            return;
        }

        this.state.chartData.push([{"v": 1, "name": this.state.habit.dates[0]}]);
        for (let i = 0; i < this.state.habit.dates.length - 1; ++i) {
            let first = new Date(this.state.habit.dates[i]);
            first = this.addDays(first, 1);
            let last = new Date(this.state.habit.dates[i + 1]);
            while (first < last) {
                this.state.chartData.push([{"v": 0, "name": ""}]);
                first = this.addDays(first, 1);
            }

            let dateString = "";
            if (i === this.state.habit.dates.length - 2 || i === this.state.habit.dates.length / 2 - 1) {
                dateString = this.state.habit.dates[i + 1];
            }
            this.state.chartData.push([{"v": 1, "name": dateString}]);
        }
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
        let options = {
            width: 300,
            height: 300,
            margin: {
                top: 20,
                left: 25,
                bottom: 50,
                right: 20
            },
            color: '#2980B9',
            gutter: 20,
            animate: {
                type: 'oneByOne',
                duration: 200,
                fillTransition: 3
            },
            axisX: {
                showAxis: true,
                showLines: true,
                showLabels: true,
                showTicks: true,
                zeroAxis: false,
                orient: 'bottom',
                label: {
                    fontFamily: 'Arial',
                    fontSize: 8,
                    fontWeight: true,
                    fill: '#34495E'
                }
            },
            axisY: {
                showAxis: true,
                showLines: true,
                showLabels: true,
                showTicks: true,
                zeroAxis: false,
                orient: 'left',
                label: {
                    fontFamily: 'Arial',
                    fontSize: 8,
                    fontWeight: true,
                    fill: '#34495E'
                }
            }
        };

        let chart = null;
        if (this.state.chartData.length > 0) {
            chart =
                <View>
                    <Bar data={this.state.chartData} options={options} accessorKey='v'/>
                </View>
        }

        return (
            <View style={styles.container}>
                <View>
                    <Text>{this.state.title}</Text>
                    <Text>{this.state.description}</Text>
                </View>
                <View>
                    <DatePicker
                        style={{width: 200}}
                        date={this.state.currentDate}
                        mode="date"
                        placeholder="select date"
                        format="YYYY-MM-DD"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={{
                            dateIcon: {
                                position: 'absolute',
                                left: 0,
                                top: 4,
                                marginLeft: 0
                            },
                            dateInput: {
                                marginLeft: 36
                            }
                            // ... You can check the source to find the other keys.
                        }}
                        onDateChange={(date) => {
                            this.setState({currentDate: date})
                        }}
                    />
                </View>
                <View>
                    <Button
                        title="Add date"
                        onPress={() => {
                            this.addDate().then(() => {
                                this.reset();
                            });
                        }}
                    />
                    <Text/>
                    <Button
                        title="Delete date"
                        onPress={() => {
                            this.deleteDate().then(() => {
                                this.reset();
                            });
                        }}
                    />
                </View>
                {chart}
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