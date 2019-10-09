import React from 'react';
import {
	View,
	Text,
	Image,
	TouchableOpacity,
	StyleSheet,
	Linking,
	ImageBackground
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import imgBackground from '../../assets/img/back-signup.jpg';
import imgLogo from '../../assets/img/logo.png';

export default class SignInScreen extends React.Component {
	static navigationOptions = {
		title: 'Contáctenos',
		tabBarIcon: ({ focused, horizontal, tintColor }) => {
			return <Ionicons name="ios-call" size={25} color={tintColor} />;
		}
	};
	callPhone = phoneNumber => {
		Linking.openURL(`tel:${phoneNumber}`);
	};
	sendMail = () => {
		Linking.openURL(
			`mailto:${'fnaquiravargas@gmail.com'}?subject=Asistencia-App-Odoo`
		);
	};
	openUrl = () => {
		Linking.openURL(`http://tecsup.edu.pe`);
	};
	openMap = () => {
		Linking.openURL(`geo:${'-16.3979753,-71.5479009'}`);
	};
	render() {
		return (
			<View style={{ flex: 1 }}>
				<ImageBackground
					source={imgBackground}
					style={{ width: '100%', height: '100%' }}
				>
					<Text
						style={{
							textAlign: 'center',
							fontWeight: 'bold',
							fontSize: 36,
							color: '#e72258'
						}}
					>
						Toma Pedidos
					</Text>
					<Image
						source={imgLogo}
						style={{
							width: null,
							resizeMode: 'contain',
							height: 35
						}}
					/>
					<View style={{ padding: 10 }}>
						<View style={{ marginTop: 10 }}>
							<Text style={styles.subtitle}>Correo</Text>
							<TouchableOpacity onPress={this.sendMail}>
								<Text style={styles.content}>contacto@conflux.pe</Text>
							</TouchableOpacity>
							<Text style={styles.subtitle}>Teléfonos de asistencia: </Text>
							<TouchableOpacity onPress={() => this.callPhone('999555444')}>
								<Text style={styles.content}>999555444</Text>
							</TouchableOpacity>
							<Text style={styles.subtitle}>Sitio Web</Text>
							<TouchableOpacity onPress={this.openUrl}>
								<Text style={styles.content}>http://tecsup.edu.pe</Text>
							</TouchableOpacity>
							<Text style={styles.subtitle}>Dirección</Text>
							<TouchableOpacity onPress={this.openMap}>
								<Text style={styles.content}>Arequipa, Perú</Text>
							</TouchableOpacity>
						</View>
					</View>
				</ImageBackground>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	subtitle: {
		fontSize: 18,
		fontWeight: 'bold'
	},
	content: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#e72258'
	}
});
