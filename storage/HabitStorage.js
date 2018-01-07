import {Alert, AsyncStorage} from 'react-native';

export class HabitStorage {
    static async put(id, habit) {
        await AsyncStorage.setItem(JSON.stringify(id), JSON.stringify(habit));
    }

    static async addHabit(title, description) {
        let nextId = parseInt(await AsyncStorage.getItem("nextId") || 1);
        let newHabit = {
            id: nextId,
            title: title,
            description: description,
            dates: [],
        };
        await this.put(nextId, newHabit);
        await AsyncStorage.setItem("nextId", JSON.stringify(nextId + 1));
    }

    static async editHabit(id, habit) {
        await this.put(id, habit);
    }

    static async deleteHabit(id) {
        await AsyncStorage.removeItem(JSON.stringify(id));
    }

    static async getHabits() {
        let nextId = parseInt(await AsyncStorage.getItem("nextId") || 1);
        let habits = [];
        for (let i = 1; i < nextId; ++i) {
            let habitResponse = await AsyncStorage.getItem(JSON.stringify(i));
            let habit = await JSON.parse(habitResponse);
            if (habit !== null) {
                habits.push(habit);
            }
        }
        return habits;
    }
}