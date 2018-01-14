import {Alert, AsyncStorage} from 'react-native';

export class HabitController {
    static instance = null;

    static getInstance() {
        if (HabitController.instance === null) {
            HabitController.instance = new HabitController();
        }
        return HabitController.instance
    }

    constructor() {
        const HOST = "192.168.0.94";
        const PORT = 5000;
        this.URL = "http://" + HOST + ":" + PORT;
        this.user = null;
        this.observers = []
    }

    attach(handler) {
        this.observers.push(handler)
    }

    notify() {
        for (let i = 0; i < this.observers.length; ++i) {
            this.observers[i]();
        }
    }

    getUser() {
        return this.user;
    }

    // Habits
    async getHabits(email) {
        return fetch(this.URL + '/habits')
            .then((response) => {
                    return response.json()
                        .then((response) => {
                            let habits = [];
                            let habitsForEmail = [];
                            response.forEach((item) => {
                                habits.push(item);
                                if (item.email === email) {
                                    habitsForEmail.push(item);
                                }
                            });
                            AsyncStorage.setItem("habits", JSON.stringify(habits));
                            return habitsForEmail;
                        })
                },
                (error) => {
                    console.log(error);
                    Alert.alert("Offline mode", "Couldn't connect to server.");
                })
    }

    async getHabitsFromAsyncStorage() {
        return AsyncStorage.getItem("habits")
            .then((response) => JSON.parse(response))
            .then((response) => (response || []))
    }

    async addHabit(title, description) {
        let habit = {
            id: -1,
            title: title,
            description: description,
            email: this.user.email
        };

        return fetch(this.URL + '/habits', {
            method: 'POST',
            headers: {Accept: 'application/json', 'Content-Type': 'application/json'},
            body: JSON.stringify({habit: habit})
        })
            .then((response) => response.json()
                    .then((response) => {
                        return this.getHabitsFromAsyncStorage()
                            .then((habits) => {
                                habits.push(response);
                                return AsyncStorage.setItem("habits", JSON.stringify(habits));
                            });
                    }),
                (error) => {
                    console.log(error);
                    Alert.alert("Offline mode", "Couldn't connect to server.");
                })
            .then((response) => {
                this.notify();
                return response;
            })
    }

    async editHabit(habit) {
        return fetch(this.URL + '/habits', {
            method: 'POST',
            headers: {Accept: 'application/json', 'Content-Type': 'application/json'},
            body: JSON.stringify({habit: habit})
        })
            .then((response) => response.json()
                    .then((response) => {
                        return this.getHabitsFromAsyncStorage()
                            .then((habits) => {
                                for (let i = 0; i < habits.length; i++) {
                                    if (habits[i].id === response.id) {
                                        habits[i] = response;
                                        break;
                                    }
                                }
                                return AsyncStorage.setItem("habits", JSON.stringify(habits));
                            });
                    }),
                (error) => {
                    console.log(error);
                    Alert.alert("Offline mode", "Couldn't connect to server.");
                })
            .then((response) => {
                this.notify();
                return response;
            })
    }

    async deleteHabit(habit) {
        return fetch(this.URL + '/habits', {
            method: 'DELETE',
            headers: {Accept: 'application/json', 'Content-Type': 'application/json'},
            body: JSON.stringify({habit: habit})
        })
            .then((response) => response.json()
                    .then((response) => {
                        return this.getHabitsFromAsyncStorage()
                            .then((habits) => {
                                for (let i = 0; i < habits.length; i++) {
                                    if (habits[i].id === response.id) {
                                        habits.splice(i, 1);
                                        break;
                                    }
                                }
                                return AsyncStorage.setItem("habits", JSON.stringify(habits));
                            });
                    }),
                (error) => {
                    console.log(error);
                    Alert.alert("Offline mode", "Couldn't connect to server.");
                })
            .then((response) => {
                this.notify();
                return response;
            })
    }

    // Users
    async getUsers() {
        return fetch(this.URL + '/users')
            .then((response) => {
                    return response.json()
                        .then((response) => {
                            let users = [];
                            response.forEach((item) => {
                                users.push(item);
                            });
                            AsyncStorage.setItem("users", JSON.stringify(users));
                            return users;
                        })
                },
                (error) => {
                    console.log(error);
                    Alert.alert("Offline mode", "Couldn't connect to server.");
                })
    }

    async getUsersFromAsyncStorage() {
        return AsyncStorage.getItem("users")
            .then((response) => JSON.parse(response))
            .then((response) => (response || []))
    }

    async authenticateWithGoogle() {
        this.user = null;
        return Expo.Google.logInAsync({androidClientId: '301839357173-pu53i3s45io9oofm57p2n4vh0gl4pupv.apps.googleusercontent.com'})
            .then((response) => {
                if (response.type === 'success') {
                    return fetch(this.URL + '/users', {
                        method: 'POST',
                        headers: {Accept: 'application/json', 'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            user: {email: response.user.email, isAdmin: false}
                        })
                    })
                        .then((response) => {
                                return response.json()
                                    .then((response) => {
                                        return this.getUsersFromAsyncStorage()
                                            .then((users) => {
                                                let found = false;
                                                for (let i = 0; i < users.length; i++) {
                                                    if (users[i].email === response.email) {
                                                        users[i] = response;
                                                        found = true;
                                                        break;
                                                    }
                                                }
                                                if (!found) {
                                                    users.push(response);
                                                }
                                                this.user = response;
                                                return AsyncStorage.setItem("users", JSON.stringify(users));
                                            });

                                    })
                            },
                            (error) => {
                                console.log(error);
                                Alert.alert("Offline mode", "Can't connect to server.");
                            })

                } else {
                    this.user = null;
                    return null;
                }
            })
    }

    // Dates
    async getDates(habitId) {
        return fetch(this.URL + '/dates')
            .then((response) => {
                    return response.json()
                        .then((response) => {
                            let dates = [];
                            let habitDates = [];
                            response.forEach((item) => {
                                dates.push(item);
                                if (item.habitId === habitId) {
                                    let dt = new Date(item.date);
                                    let month = "" + (dt.getMonth() + 1);
                                    if (month.length === 1) {
                                        month = "0" + month;
                                    }
                                    habitDates.push(dt.getFullYear() + "-" + month + "-" + dt.getDate());
                                }
                            });
                            AsyncStorage.setItem("dates", JSON.stringify(dates));
                            return habitDates;
                        })
                },
                (error) => {
                    console.log(error);
                    Alert.alert("Offline mode", "Couldn't connect to server.");
                })
    }

    async getDatesFromAsyncStorage() {
        return AsyncStorage.getItem("dates")
            .then((response) => JSON.parse(response))
            .then((response) => (response || []))
    }

    async addDate(habitId, dateString) {
        let dateTimestamp = new Date(dateString).getTime();
        console.log(new Date(dateString));
        console.log(new Date(dateString).getTime());
        let date = {
            habitId: habitId,
            date: dateTimestamp,
            habitIdDate: "" + habitId + "" + dateTimestamp
        };

        return fetch(this.URL + '/dates', {
            method: 'POST',
            headers: {Accept: 'application/json', 'Content-Type': 'application/json'},
            body: JSON.stringify({habit_date: date})
        })
            .then((response) => response.json()
                    .then((response) => {
                        return this.getDatesFromAsyncStorage()
                            .then((dates) => {
                                dates.push(response);
                                return AsyncStorage.setItem("dates", JSON.stringify(dates));
                            });
                    }),
                (error) => {
                    console.log(error);
                    Alert.alert("Offline mode", "Couldn't connect to server.");
                })
            .then((response) => {
                return response;
            })
    }

    async deleteDate(habitId, dateString) {
        let dateTimestamp = new Date(dateString).getTime();
        let date = {
            habitId: habitId,
            date: dateTimestamp,
            habitIdDate: "" + habitId + "" + dateTimestamp
        };

        return fetch(this.URL + '/dates', {
            method: 'DELETE',
            headers: {Accept: 'application/json', 'Content-Type': 'application/json'},
            body: JSON.stringify({habit_date: date})
        })
            .then((response) => response.json()
                    .then((response) => {
                        return this.getDatesFromAsyncStorage()
                            .then((dates) => {
                                for (let i = 0; i < dates.length; i++) {
                                    if (dates[i].habitIdDate === response.habitIdDate) {
                                        dates.splice(i, 1);
                                        break;
                                    }
                                }
                                return AsyncStorage.setItem("dates", JSON.stringify(dates));
                            });
                    }),
                (error) => {
                    console.log(error);
                    Alert.alert("Offline mode", "Couldn't connect to server.");
                })
            .then((response) => {
                return response;
            })
    }
}