import React from 'react';
import { connect } from 'react-redux';
import {
	ActivityIndicator,
	StatusBar,
	View,
	Text,
	Image,
	ImageBackground
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import * as actions from '../../store/actions/auth';

import imgLogo from '../../assets/img/logo.png';
import imgBackground from '../../assets/img/back-signin.jpg';

class AuthLoadingScreen extends React.Component {
	componentDidMount() {
		this.props.onTryAutoSignup();
		this._bootstrapAsync();
	}
	_bootstrapAsync = async () => {
		const userToken = await AsyncStorage.getItem('uid');
		this.props.navigation.navigate(userToken ? 'App' : 'Auth');
	};
	render() {
		return (
			<View
				style={{
					flex: 1,
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'stretch'
				}}
			>
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
						<Image
							source={imgLogo}
							style={{
								width: null,
								resizeMode: 'contain',
								height: 40
							}}
						/>
						<Text
							style={{
								textAlign: 'center',
								fontWeight: 'bold',
								fontSize: 24,
								color: '#e72258'
							}}
						>
							Cargando...
						</Text>
					</View>
				</ImageBackground>
			</View>
		);
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onTryAutoSignup: () => dispatch(actions.authCheckState())
	};
};

export default connect(
	null,
	mapDispatchToProps
)(AuthLoadingScreen);
