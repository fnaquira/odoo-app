import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../lib/utility';

const initialState = {
	url: '',
	db: '',
	port: 8069,
	email: null,
	password: null,
	name: null,
	uid: null,
	error: null,
	loading: false
};

const authCompany = (state, action) => {
	return updateObject(state, {
		url: action.url,
		db: action.db,
		port: action.port
	});
};

const authStart = (state, action) => {
	return updateObject(state, { error: null, loading: true });
};

const authSuccess = (state, action) => {
	return updateObject(state, {
		email: action.email,
		name: action.name,
		password: action.password,
		uid: action.uid,
		error: null,
		loading: false
	});
};

const authFail = (state, action) => {
	return updateObject(state, {
		error: action.error,
		loading: false
	});
};

const authLogout = (state, action) => {
	return updateObject(state, {
		password: null,
		email: null,
		name: null,
		uid: null
	});
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.AUTH_COMPANY:
			return authCompany(state, action);
		case actionTypes.AUTH_START:
			return authStart(state, action);
		case actionTypes.AUTH_SUCCESS:
			return authSuccess(state, action);
		case actionTypes.AUTH_FAIL:
			return authFail(state, action);
		case actionTypes.AUTH_LOGOUT:
			return authLogout(state, action);
		default:
			return state;
	}
};

export default reducer;
