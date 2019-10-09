import Odoo from 'react-native-odoo-promise-based';
import AsyncStorage from '@react-native-community/async-storage';

module.exports = () => {
	return new Promise(async (resolve, reject) => {
		const url = await AsyncStorage.getItem('url');
		const db = await AsyncStorage.getItem('db');
		const port = await AsyncStorage.getItem('port');
		const email = await AsyncStorage.getItem('email');
		const password = await AsyncStorage.getItem('password');
		const odoo = new Odoo({
			host: url,
			port: port,
			database: db,
			username: email,
			password: password
		});
		odoo
			.connect()
			.then(response => {
				resolve(odoo);
			})
			.catch(e => {
				reject(e);
			});
	});
};
