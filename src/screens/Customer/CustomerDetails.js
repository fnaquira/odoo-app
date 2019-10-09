import React, { Component } from 'react';
import {
	Text,
	ScrollView,
	TouchableOpacity,
	ActivityIndicator,
	StatusBar,
	Button,
	Modal,
	View,
	StyleSheet,
	Picker,
	BackHandler
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import connectDb from '../../lib/connect';

import { colors } from '../../styles/base';

class CustomerDetails extends Component {
	static navigationOptions = ({ navigation }) => {
		const { state } = navigation;
		return {
			title: `${state.params.title ? state.params.title : 'Cargando...'}`
		};
	};
	state = {
		loading: true,
		data: null,
		modalVisible: false,
		modalPaymentVisible: false,
		day_of_week: '',
		payment_term: '',
		payments: null
	};
	async componentDidMount() {
		const partnerId = this.props.navigation.getParam('partnerId');
		const odoo = await connectDb();
		try {
			const response = await odoo.get('res.partner', {
				ids: [partnerId],
				fields: [
					'name',
					'doc_type',
					'vat',
					'street',
					'property_payment_term_id'
				]
			});
			this.setState({
				loading: false,
				data: response.data[0],
				day_of_week: response.data[0].visit_day,
				payment_term: response.data[0].property_payment_term_id[0]
			});
			this.props.navigation.setParams({ title: response.data[0].name });
		} catch (error) {
			console.log(error);
			this.setState({ loading: false });
		}
		const domain = [['active', '=', true]];
		try {
			const payment = await odoo.search_read('account.payment.term', {
				ids: [partnerId],
				fields: ['name']
			});
			this.setState({ payments: payment.data, loading: false });
		} catch (error) {
			console.log(error);
			this.setState({ loading: false });
		}
	}
	locateHandler = () => {
		this.props.navigation.navigate({
			routeName: 'Map',
			params: { route: '1', mode: 'add', partnerId: this.state.data.id }
		});
	};
	modalHandler = () =>
		this.setState({ modalVisible: !this.state.modalVisible });
	modalPaymentHandler = () =>
		this.setState({ modalPaymentVisible: !this.state.modalPaymentVisible });
	saveHandler = async () => {
		const partnerId = this.props.navigation.getParam('partnerId');
		const odoo = await connectDb();
		try {
			const response = await odoo.update('res.partner', [partnerId], {
				visit_day: this.state.day_of_week,
				property_payment_term_id: this.state.payment_term
			});
			console.log(response);

			this.goBackHandler();
		} catch (error) {
			console.log(error);
		}
	};
	goBackHandler = () => {
		const mode = this.props.navigation.getParam('mode');
		if (mode === 'route') {
			this.props.navigation.navigate({
				routeName: 'RouteDayClients'
			});
		} else {
			this.props.navigation.goBack();
		}
	};
	render() {
		if (this.state.loading) {
			return (
				<ScrollView
					style={{
						flex: 1,
						width: '100%',
						height: '100%',
						backgroundColor: '#f4f3f4'
					}}
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
							Enviando información a servidor...
						</Text>
					</View>
				</ScrollView>
			);
		}
		let payment_term = '';
		const customer = this.state.data;
		if (customer.property_payment_term_id) {
			payment_term = customer.property_payment_term_id[1];
		}
		let doc_type = 'DNI';
		if (customer.doc_type === '6') doc_type = 'RUC';
		let day_of_week = '';
		if (this.state.day_of_week === '0') {
			day_of_week = 'Lunes';
		} else if (this.state.day_of_week === '1') {
			day_of_week = 'Martes';
		} else if (this.state.day_of_week === '2') {
			day_of_week = 'Miercoles';
		} else if (this.state.day_of_week === '3') {
			day_of_week = 'Jueves';
		} else if (this.state.day_of_week === '4') {
			day_of_week = 'Viernes';
		} else if (this.state.day_of_week === '5') {
			day_of_week = 'Sabado';
		} else if (this.state.day_of_week === '6') {
			day_of_week = 'Domingo';
		} else {
			day_of_week = 'Sin definir';
		}
		const modalBackgroundStyle = {
			backgroundColor: 'rgba(0, 0, 0, 0.5)'
		};
		const innerContainerTransparentStyle = {
			borderRadius: 10,
			backgroundColor: '#fff',
			padding: 15
		};
		return (
			<ScrollView
				style={{
					flex: 1,
					backgroundColor: '#f4f3f4'
				}}
			>
				<View style={styles.card}>
					<Text style={{ color: '#000', fontSize: 16 }}>{customer.name}</Text>
					<Text>
						{doc_type} {customer.vat}
					</Text>
					<Text>{customer.street}</Text>
					<Modal
						animationType="fade"
						transparent={true}
						visible={this.state.modalVisible}
					>
						<View style={[styles.container, modalBackgroundStyle]}>
							<View style={innerContainerTransparentStyle}>
								<Text>Escoge el día de la visita:</Text>
								<Picker
									selectedValue={this.state.day_of_week}
									style={{ height: 50, width: 200 }}
									onValueChange={(itemValue, itemIndex) =>
										this.setState({ day_of_week: itemValue })
									}
								>
									<Picker.Item label="Lunes" value="0" />
									<Picker.Item label="Martes" value="1" />
									<Picker.Item label="Miercoles" value="2" />
									<Picker.Item label="Jueves" value="3" />
									<Picker.Item label="Viernes" value="4" />
									<Picker.Item label="Sabado" value="5" />
									<Picker.Item label="Domingo" value="6" />
								</Picker>
								<Button
									color="green"
									onPress={this.saveHandler}
									title="Guardar"
								/>
								<Button
									color="orange"
									onPress={this.modalHandler}
									title="Cancelar"
								/>
							</View>
						</View>
					</Modal>
					<Modal
						animationType="fade"
						transparent={true}
						visible={this.state.modalPaymentVisible}
					>
						<View style={[styles.container, modalBackgroundStyle]}>
							<View style={innerContainerTransparentStyle}>
								<Text>Escoge el plazo de pago:</Text>
								{this.state.payments ? (
									<Picker
										selectedValue={this.state.payment_term}
										style={{ height: 50, width: 200 }}
										onValueChange={(itemValue, itemIndex) =>
											this.setState({ payment_term: itemValue })
										}
									>
										<Picker.Item label={'Escoge una opción:'} value={'-'} />
										{this.state.payments.map((item, key) => {
											return (
												<Picker.Item
													key={key}
													label={item.name}
													value={item.id}
												/>
											);
										})}
									</Picker>
								) : null}
								<Button
									color="green"
									onPress={this.saveHandler}
									title="Guardar"
								/>
								<Button
									color="orange"
									onPress={this.modalPaymentHandler}
									title="Cancelar"
								/>
							</View>
						</View>
					</Modal>
					<TouchableOpacity style={styles.btnMap} onPress={this.modalHandler}>
						<Ionicons name="ios-calendar" size={30} color="#fff" />
						<Text style={{ color: '#fff' }}>
							Se le visita los: {day_of_week}
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.btnMap}
						onPress={this.modalPaymentHandler}
					>
						<Ionicons name="ios-calendar" size={30} color="#fff" />
						<Text style={{ color: '#fff' }}>
							Termino de pago: {payment_term}
						</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingTop: 10,
		backgroundColor: '#ecf0f1'
	},
	card: {
		margin: 10,
		padding: 10,
		backgroundColor: '#fff',
		borderColor: '#bfbdbf',
		borderWidth: 1,
		borderRadius: 5
	},
	btnMap: {
		margin: 5,
		padding: 10,
		textAlign: 'center',
		backgroundColor: colors.odooGreen,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	}
});

export default CustomerDetails;
