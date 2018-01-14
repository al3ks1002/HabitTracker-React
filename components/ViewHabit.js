import React from 'react';
import {Button, StyleSheet, View, Text} from 'react-native';
import DatePicker from 'react-native-datepicker'
import {Bar} from 'react-native-pathjs-charts';

import {HabitController} from "../controller/HabitController";

export default class ViewHabit extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: false,
            habit: {
                id: -1,
                title: '',
                description: '',
                email: ''
            },
            currentDate: "2018-01-15",
            dates: [],
            chartData: [],
        };

        if (this.props.navigation.state.params !== undefined) {
            let habit = this.props.navigation.state.params;
            this.state.habit.id = habit.id;
            this.state.habit.title = habit.title;
            this.state.habit.description = habit.description;
            this.state.habit.email = habit.email;

            this.updateChart();
        }
    }


    async componentDidMount() {
        console.log(this.state.habit.id);
        const dates = await HabitController.getInstance().getDates(this.state.habit.id);
        const sortedDates = dates.sort((a, b) => new Date(a) - new Date(b));

        this.setState({
            dates: sortedDates
        });
        this.updateChart();

        this.setState({
            loaded: true
        });
    }

    async addDate() {
        for (let date of this.state.dates) {
            if (date === this.state.currentDate) {
                return;
            }
        }
        this.state.dates.push(this.state.currentDate);
        this.state.dates = this.state.dates.sort((a, b) => new Date(a) - new Date(b));
        this.updateChart();
        await HabitController.getInstance().addDate(this.state.habit.id, this.state.currentDate);
    }

    async deleteDate() {
        let index = this.state.dates.indexOf(this.state.currentDate);
        if (index > -1) {
            this.state.dates.splice(index, 1);
            this.updateChart();
            await HabitController.getInstance().deleteDate(this.state.habit.id, this.state.currentDate);
        }
    }

    addDays(dateString, days) {
        let date = new Date(dateString);
        date.setDate(date.getDate() + days);
        return date;
    }

    updateChart() {
        this.state.chartData = [];

        if (this.state.dates.length === 0) {
            return;
        }

        this.state.chartData.push([{"v": 1, "name": this.state.dates[0]}]);
        for (let i = 0; i < this.state.dates.length - 1; ++i) {
            let first = new Date(this.state.dates[i]);
            first = this.addDays(first, 1);
            let last = new Date(this.state.dates[i + 1]);
            while (first < last) {
                this.state.chartData.push([{"v": 0, "name": ""}]);
                first = this.addDays(first, 1);
            }

            let dateString = "";
            if (i === this.state.dates.length - 2 || i === this.state.dates.length / 2 - 1) {
                dateString = this.state.dates[i + 1];
            }
            this.state.chartData.push([{"v": 1, "name": dateString}]);
        }
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
        if (this.state.chartData.length > 0 && this.state.loaded) {
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
                                this.props.navigation.goBack();
                            });
                        }}
                    />
                    <Text/>
                    <Button
                        title="Delete date"
                        onPress={() => {
                            this.deleteDate().then(() => {
                                this.props.navigation.goBack();
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