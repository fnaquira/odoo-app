/**
 * @format
 */
import React from 'react';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import authReducer from './src/store/reducers/auth';
import saleReducer from './src/store/reducers/sale';

const store = createStore(
	combineReducers({
		auth: authReducer,
		sale: saleReducer
	}),
	applyMiddleware(thunk)
);

class MainApp extends React.Component {
	render() {
		return (
			<Provider store={store}>
				<App />
			</Provider>
		);
	}
}

AppRegistry.registerComponent(appName, () => MainApp);
