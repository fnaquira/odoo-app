import React from 'react';
import { connect } from 'react-redux';
import {
	ScrollView,
	View,
	Text,
	Image,
	ActivityIndicator,
	StatusBar,
	TouchableOpacity,
	ImageBackground,
	ToastAndroid,
	KeyboardAvoidingView
} from 'react-native';
import Icon from 'react-native-ionicons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Fumi } from 'react-native-textinput-effects';

import * as actions from '../../store/actions/auth';

import imgLogo from '../../assets/img/logo.png';
import imgBackground from '../../assets/img/back-signin.jpg';

class SignInScreen extends React.Component {
	static navigationOptions = {
		title: 'Inicie sesión',
		tabBarIcon: ({ focused, horizontal, tintColor }) => {
			return <Ionicons name="ios-contact" size={25} color={tintColor} />;
		}
	};
	state = {
		user: '',
		password: '',
		server: 'localhost',
		db: '',
		port: '8069',
		showPassword: false
	};
	showPassword = () => {
		this.setState({ showPassword: !this.state.showPassword });
	};
	inputHandler = (field, value) => {
		this.setState({ [field]: value });
	};
	onSubmitHandler = () => {
		if (this.state.user === '' || this.state.password === '') {
			return ToastAndroid.showWithGravity(
				'Falta ingresar datos!',
				ToastAndroid.SHORT,
				ToastAndroid.TOP
			);
		}
		this.props.onAuth(
			this.state.user,
			this.state.password,
			this.state.port,
			this.state.server,
			this.state.db,
			() => {
				this.props.navigation.navigate('App');
			}
		);
	};
	registerHandler = () => {
		this.props.navigation.navigate('Contact');
	};
	render() {
		if (this.props.loading) {
			return (
				<ImageBackground
					source={imgBackground}
					style={{ width: '100%', height: '100%' }}
				>
					<View
						style={{
							flex: 1,
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'stretch'
						}}
					>
						<ActivityIndicator />
						<StatusBar barStyle="default" />
						<Text
							style={{
								textAlign: 'center',
								fontWeight: 'bold'
							}}
						>
							Obteniendo información de inicio...
						</Text>
					</View>
				</ImageBackground>
			);
		}
		return (
			<ScrollView style={{ flex: 1 }}>
				<ImageBackground
					source={imgBackground}
					style={{ width: '100%', height: '100%' }}
				>
					<KeyboardAvoidingView
						behavior="position"
						style={{
							justifyContent: 'center'
						}}
						enabled
					>
						<Text
							style={{
								textAlign: 'center',
								fontWeight: 'bold',
								fontSize: 48,
								color: '#e72258',
								marginTop: 30
							}}
						>
							Odoo App
						</Text>
						<Image
							source={imgLogo}
							style={{
								width: null,
								resizeMode: 'contain',
								height: 40
							}}
						/>
						<View style={{ padding: 10 }}>
							<View style={{ marginTop: 10 }}>
								<View>
									<Fumi
										style={{
											backgroundColor: '#46494f',
											opacity: 0.8,
											marginBottom: 8
										}}
										label={'URL Servidor'}
										iconClass={Icon}
										onChangeText={text => this.inputHandler('server', text)}
										iconName={'person'}
										value={this.state.server}
										autoCapitalize="none"
										iconColor={'#fff'}
										labelStyle={{ color: 'white' }}
										iconSize={30}
										iconWidth={40}
										inputPadding={16}
									/>
								</View>
								<View>
									<Fumi
										style={{
											backgroundColor: '#46494f',
											opacity: 0.8,
											marginBottom: 8
										}}
										label={'Puerto'}
										iconClass={Icon}
										onChangeText={text => this.inputHandler('port', text)}
										iconName={'person'}
										value={this.state.port}
										autoCapitalize="none"
										iconColor={'#fff'}
										labelStyle={{ color: 'white' }}
										iconSize={30}
										iconWidth={40}
										inputPadding={16}
									/>
								</View>
								<View>
									<Fumi
										style={{
											backgroundColor: '#46494f',
											opacity: 0.8,
											marginBottom: 8
										}}
										label={'Base de Datos'}
										iconClass={Icon}
										onChangeText={text => this.inputHandler('db', text)}
										iconName={'person'}
										value={this.state.db}
										autoCapitalize="none"
										iconColor={'#fff'}
										labelStyle={{ color: 'white' }}
										iconSize={30}
										iconWidth={40}
										inputPadding={16}
									/>
								</View>
								<View>
									<Fumi
										style={{
											backgroundColor: '#46494f',
											opacity: 0.8,
											marginBottom: 8
										}}
										label={'Usuario'}
										iconClass={Icon}
										keyboardType="email-address"
										autoCapitalize="none"
										onChangeText={text => this.inputHandler('user', text)}
										iconName={'person'}
										value={this.state.user}
										iconColor={'#fff'}
										labelStyle={{ color: 'white' }}
										iconSize={30}
										iconWidth={40}
										inputPadding={16}
									/>
								</View>
								<View style={{ flexDirection: 'row' }}>
									<Fumi
										style={{
											width: '82%',
											backgroundColor: '#46494f',
											opacity: 0.8
										}}
										label={'Contraseña'}
										labelStyle={{ color: 'white' }}
										autoCapitalize="none"
										onChangeText={text => this.inputHandler('password', text)}
										secureTextEntry={!this.state.showPassword}
										value={this.state.password}
										iconClass={Icon}
										iconName={'key'}
										iconColor={'#fff'}
										iconSize={30}
										iconWidth={40}
										inputPadding={16}
									/>
									<Icon
										color="#fff"
										style={{
											padding: 20,
											alignItems: 'center',
											backgroundColor: '#46494f',
											opacity: 0.8,
											height: 65
										}}
										size={25}
										name={this.state.showPassword ? 'md-eye' : 'md-eye-off'}
										onPress={this.showPassword}
									/>
								</View>
								<TouchableOpacity
									onPress={this.onSubmitHandler}
									style={{
										marginTop: 16,
										padding: 15,
										justifyContent: 'center',
										alignItems: 'center',
										borderRadius: 25,
										backgroundColor: '#dcdcdc'
									}}
								>
									<Text
										style={{
											color: '#46494f',
											fontSize: 15,
											fontWeight: 'bold'
										}}
									>
										Iniciar Sesión
									</Text>
								</TouchableOpacity>
								<View
									style={{
										marginTop: 10,
										justifyContent: 'center',
										alignItems: 'center',
										alignSelf: 'center'
									}}
								>
									<Text style={{ color: '#e72258', fontSize: 14 }}>
										No tienes una cuenta?
										<Text
											onPress={this.registerHandler}
											style={{
												color: '#e72258',
												fontSize: 16,
												fontWeight: 'bold'
											}}
										>
											{' '}
											Contáctanos
										</Text>
									</Text>
								</View>
							</View>
						</View>
					</KeyboardAvoidingView>
				</ImageBackground>
			</ScrollView>
		);
	}
}

const mapStateToProps = state => {
	return {
		isAuthenticated: state.auth.token !== null,
		loading: state.auth.loading
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onAuth: (username, password, port, server, db, callback) =>
			dispatch(actions.auth(username, password, port, server, db, callback))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SignInScreen);
