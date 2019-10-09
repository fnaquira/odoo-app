import React from 'react';
import { Image } from 'react-native';
import {
	createSwitchNavigator,
	createDrawerNavigator,
	createAppContainer,
	createBottomTabNavigator,
	createStackNavigator
} from 'react-navigation';

import AuthLoadingScreen from './src/screens/AuthLoadingScreen/AuthLoadingScreen';
import SignInScreen from './src/screens/SignIn/SignIn';
import ContactScreen from './src/screens/Contact';
import HomeScreen from './src/screens/Home/Home';
import Settings from './src/screens/Settings/Settings';

import SaleOrder from './src/screens/Sales/SaleOrder';
import SaleOrderItem from './src/screens/Sales/SaleOrderItem';
import SaleOrderProduct from './src/screens/Sales/SaleOrderProduct';

import SaleOrderList from './src/screens/Sales/SaleOrderList';
import SaleOrderDetails from './src/screens/Sales/SaleOrderDetails';

import CustomerList from './src/screens/Customer/CustomerList';
import CustomerDetails from './src/screens/Customer/CustomerDetails';
import RouteDayClients from './src/screens/RouteDay/RouteDayClients';
import RouteDayMap from './src/screens/RouteDay/RouteDayMap';

import Drawer from './src/components/UI/Drawer';
import DrawerButton from './src/components/UI/DrawerButton';

const defaultNavigationOptions = {
	title: 'Conflux ERP',
	headerLeft: DrawerButton,
	headerStyle: {
		backgroundColor: '#86587b',
		shadowColor: 'transparent',
		shadowRadius: 0,
		elevation: 0,
		shadowOffset: {
			height: 0
		}
	},
	headerTintColor: '#fff',
	headerTitleStyle: {
		fontWeight: 'bold'
	},
	headerLeftContainerStyle: {
		paddingLeft: 10
	}
};

const Sales = createStackNavigator(
	{
		SaleOrder,
		SaleOrderItem,
		SaleOrderProduct
	},
	{ defaultNavigationOptions }
);
Sales.navigationOptions = {
	title: 'Nueva Venta',
	drawerIcon: () => (
		<Image
			source={require('./src/assets/img/odoo-sales.png')}
			resizeMode="contain"
			style={{ width: 20, height: 20 }}
		/>
	)
};
const SaleList = createStackNavigator(
	{
		SaleOrderList,
		SaleOrderDetails
	},
	{ defaultNavigationOptions }
);
SaleList.navigationOptions = {
	title: 'Mis Ventas',
	drawerIcon: () => (
		<Image
			source={require('./src/assets/img/odoo-sales.png')}
			resizeMode="contain"
			style={{ width: 20, height: 20 }}
		/>
	)
};
const RouteDayList = createStackNavigator(
	{
		RouteDayClients,
		RouteDayMap
	},
	{ defaultNavigationOptions }
);
RouteDayList.navigationOptions = {
	title: 'Ruta del día',
	drawerIcon: () => (
		<Image
			source={require('./src/assets/img/odoo-sales.png')}
			resizeMode="contain"
			style={{ width: 20, height: 20 }}
		/>
	)
};

const Customers = createStackNavigator(
	{
		CustomerList,
		CustomerDetails
	},
	{ defaultNavigationOptions }
);
Customers.navigationOptions = {
	title: 'Mis Clientes',
	drawerIcon: () => (
		<Image
			source={require('./src/assets/img/odoo-sales.png')}
			resizeMode="contain"
			style={{ width: 20, height: 20 }}
		/>
	)
};
const AppStack = createDrawerNavigator(
	{
		Home: HomeScreen,
		Sales,
		SaleList,
		RouteDayList,
		Customers,
		Settings
	},
	{
		contentComponent: Drawer
	}
);
const AuthStack = createBottomTabNavigator({
	SignIn: SignInScreen,
	Contact: ContactScreen
});

export default createAppContainer(
	createSwitchNavigator(
		{
			AuthLoading: AuthLoadingScreen,
			App: AppStack,
			Auth: AuthStack
		},
		{
			initialRouteName: 'AuthLoading'
		}
	)
);
