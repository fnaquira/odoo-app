import Odoo from 'react-native-odoo-promise-based';
import AsyncStorage from '@react-native-community/async-storage';

import * as actionTypes from './actionTypes';

export const authStart = () => {
	return {
		type: actionTypes.AUTH_START
	};
};

export const authSuccess = (email, password, name, uid) => {
	return {
		type: actionTypes.AUTH_SUCCESS,
		email,
		password,
		name,
		uid
	};
};

export const authFail = error => {
	return {
		type: actionTypes.AUTH_FAIL,
		error: error
	};
};

export const logout = () => {
	return {
		type: actionTypes.AUTH_LOGOUT
	};
};

export const auth = (email, password, port, server, db, cb) => {
	return (dispatch, getState) => {
		dispatch(authStart());
		console.log({
			host: server,
			port: parseInt(port, 10),
			database: db,
			username: email,
			password: password
		});
		const odoo = new Odoo({
			host: server,
			port: parseInt(port, 10),
			database: db,
			username: email,
			password: password
		});
		odoo
			.connect()
			.then(async response => {
				console.log(response.data);
				const { name, uid } = response.data;
				if (!uid) dispatch(authFail('Usuario inválido'));
				await AsyncStorage.setItem('url', server);
				await AsyncStorage.setItem('db', db);
				await AsyncStorage.setItem('port', port);
				await AsyncStorage.setItem('email', email);
				await AsyncStorage.setItem('password', password);
				await AsyncStorage.setItem('name', name);
				await AsyncStorage.setItem('uid', `${uid}`);
				dispatch(authSuccess(email, password, name, uid));
				cb();
			})
			.catch(e => {
				console.log('Error Odoo', e);
				dispatch(authFail(e));
			});
	};
};

export const authCheckState = () => {
	return async dispatch => {
		const token = await AsyncStorage.getItem('uid');
		if (!token) {
			await AsyncStorage.clear();
			dispatch(logout());
		} else {
			const email = await AsyncStorage.getItem('email');
			const password = await AsyncStorage.getItem('password');
			const name = await AsyncStorage.getItem('name');
			const uid = await AsyncStorage.getItem('uid');
			dispatch(authSuccess(email, password, name, uid));
		}
	};
};
