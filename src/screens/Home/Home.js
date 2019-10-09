import React from 'react';
import { connect } from 'react-redux';
import { ScrollView, StyleSheet, View, Image, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';

import IconBox from '../../components/UI/IconBox';

//import { fonts } from '../../styles/base';
import { styles } from '../../styles/global';

import imgCampus from '../../assets/img/back-machu.jpg';

class HomeScreen extends React.Component {
	static navigationOptions = {
		title: 'Inicio',
		tabBarIcon: ({ focused, horizontal, tintColor }) => {
			return <Ionicons name="ios-clipboard" size={25} color={tintColor} />;
		}
	};
	go2MyOrder = () => {
		this.props.navigation.navigate('Sales');
	};
	go2Profile = () => {
		this.props.navigation.navigate('Profile');
	};
	go2Lists = () => {
		this.props.navigation.navigate('SaleOrderList');
	};
	go2MyCustomers = () => {
		this.props.navigation.navigate('Customers');
	};
	go2Settings = () => {
		this.props.navigation.navigate('Settings');
	};
	logoutHandler = async () => {
		await AsyncStorage.clear();
		this.props.navigation.navigate('Auth');
	};
	render() {
		return (
			<ScrollView>
				<Image source={imgCampus} />
				<Text style={styles.title}>Hola {this.props.userName}</Text>
				<View style={styles.iconContainer}>
					<IconBox
						value={'Nueva Venta'}
						label={'Inicia ya!'}
						icon={require('../../assets/img/odoo-sales.png')}
						onPress={this.go2MyOrder}
					/>
					<IconBox
						value={'Mis Ventas'}
						label={'Historial'}
						icon={require('../../assets/img/icon-list.png')}
						onPress={this.go2Lists}
					/>
				</View>
				<View style={styles.iconContainer}>
					<IconBox
						value={'Clientes'}
						label={'Revisa su información'}
						icon={require('../../assets/img/odoo-contacts.png')}
						onPress={this.go2MyCustomers}
					/>
					{/*<IconBox
						value={'Config'}
						label={'Mis utilidades'}
						icon={require('../../assets/img/odoo-settings.png')}
						onPress={this.go2Settings}
					/>*/}
					<IconBox
						value={'Salir'}
						label={'Cerrar sesión'}
						icon={require('../../assets/img/icon-logout.png')}
						onPress={this.logoutHandler}
					/>
				</View>
			</ScrollView>
		);
	}
}

const mapStateToProps = state => {
	return {
		userName: state.auth.name
	};
};

export default connect(mapStateToProps)(HomeScreen);
