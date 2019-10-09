import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import {
	View,
	ScrollView,
	Text,
	StyleSheet,
	DatePickerAndroid,
	Alert,
	TouchableOpacity
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import * as actions from '../../../store/actions/sale';
import { formatCurrency } from '../../../lib/utility';

import SaleOrderSave from './SaleOrderSave';
import LoadingView from '../../../components/UI/LoadingView';

class SaleOrder extends Component {
	static navigationOptions = {
		title: 'Registrar Venta',
		headerRight: <SaleOrderSave />
	};
	componentDidMount() {
		this.props.newOrder();
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.error) {
			Alert.alert('Complete la información!', nextProps.error);
			this.props.resetError();
		}
		if (nextProps.saleId) {
			this.props.navigation.navigate({
				routeName: 'SaleOrderDetails',
				params: { saleId: nextProps.saleId }
			});
			this.props.resetOrder();
		}
	}
	dateHandler = async () => {
		try {
			const { action, year, month, day } = await DatePickerAndroid.open({
				date: new Date()
			});
			if (action !== DatePickerAndroid.dismissedAction) {
				const date = moment({ year, month, day });
				this.props.setDate(date.format('YYYY-MM-DD'));
			}
		} catch ({ code, message }) {
			console.warn('Cannot open date picker', message);
		}
	};
	partnerHandler = () => {
		this.props.navigation.navigate({
			routeName: 'CustomerList',
			params: { mode: 'sale' }
		});
	};
	addItemHandler = () => {
		this.props.navigation.navigate('SaleOrderProduct');
	};
	editItemHandler = index => {
		this.props.selectItem(index);
		this.props.navigation.navigate('SaleOrderItem');
	};
	render() {
		if (this.props.loading) {
			return <LoadingView />;
		}
		return (
			<ScrollView
				style={{
					flex: 1,
					backgroundColor: '#f4f3f4'
				}}
			>
				<View style={styles.card}>
					<Text>Fecha de Pedido</Text>
					<TouchableOpacity
						onPress={this.dateHandler}
						style={{
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center'
						}}
					>
						<Text style={{ color: '#000', fontSize: 14 }}>
							{this.props.date}
						</Text>
						<Ionicons name="ios-calendar" size={30} color="#22b79a" />
					</TouchableOpacity>
					<Text>Cliente</Text>
					<TouchableOpacity
						style={{
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center'
						}}
						onPress={this.partnerHandler}
					>
						<Text style={{ color: '#000', fontSize: 14 }}>
							{this.props.partner_name}
						</Text>
						<Ionicons name="ios-person" size={30} color="#22b79a" />
					</TouchableOpacity>
				</View>
				<TouchableOpacity
					style={{
						flexDirection: 'row',
						justifyContent: 'space-around',
						alignItems: 'flex-start',
						padding: 10
					}}
					onPress={this.addItemHandler}
				>
					<Ionicons name="ios-basket" size={30} color="#22b79a" />
					<Text style={{ color: '#22b79a', fontSize: 16 }}>
						AGREGAR LÍNEAS DE PEDIDO
					</Text>
				</TouchableOpacity>
				{!!this.props.items.length &&
					this.props.items.map((item, index) => {
						return (
							<TouchableOpacity
								style={[styles.card, { marginBottom: 2, marginTop: 2 }]}
								key={index}
								onPress={() => this.editItemHandler(index)}
							>
								<Text style={{ color: '#000', fontWeight: 'bold' }}>
									[{item.product.default_code}] {item.product.name}
								</Text>
								<View
									style={{
										flexDirection: 'row',
										justifyContent: 'space-around',
										alignItems: 'flex-start',
										padding: 3
									}}
								>
									<View
										style={{
											flex: 1,
											alignItems: 'center',
											borderRightWidth: 1,
											borderColor: 'bfbdbf'
										}}
									>
										<Text>Cant.</Text>
										<Text style={{ color: '#000' }}>{item.qty}</Text>
									</View>
									<View
										style={{
											flex: 1,
											alignItems: 'center',
											borderRightWidth: 1,
											borderColor: 'bfbdbf'
										}}
									>
										<Text>Pre.Unit</Text>
										<Text style={{ color: '#000' }}>
											{formatCurrency(item.price_unit)}
										</Text>
									</View>
									<View
										style={{
											flex: 1,
											alignItems: 'center'
										}}
									>
										<Text>SubTotal</Text>
										<Text style={{ color: '#000' }}>
											{formatCurrency(item.subtotal)}
										</Text>
									</View>
								</View>
							</TouchableOpacity>
						);
					})}
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-around',
						alignItems: 'flex-start',
						padding: 10
					}}
				>
					<Text style={{ color: '#22b79a', fontSize: 16 }}>
						Resumen de Pedido
					</Text>
				</View>
				<View
					style={[
						styles.card,
						{
							flexDirection: 'row',
							justifyContent: 'space-around',
							alignItems: 'flex-end'
						}
					]}
				>
					<Text>Total</Text>
					<Text style={{ color: '#000' }}>
						{formatCurrency(this.props.total)}
					</Text>
				</View>
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
	card: {
		margin: 10,
		padding: 10,
		backgroundColor: '#fff',
		borderColor: '#bfbdbf',
		borderWidth: 1,
		borderRadius: 5
	}
});

const mapStateToProps = state => {
	return {
		loading: state.sale.loading,
		error: state.sale.error,
		saleId: state.sale.id,
		total: state.sale.total,
		date: state.sale.date,
		partner_name: state.sale.partner_name,
		items: state.sale.items
	};
};

const mapDispatchToProps = dispatch => {
	return {
		newOrder: () => dispatch(actions.saleId(null)),
		resetError: () => dispatch(actions.saleResetError()),
		resetOrder: () => dispatch(actions.saleReset()),
		setDate: date => dispatch(actions.saleDate(date)),
		selectItem: i => dispatch(actions.saleSelectItem(i))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SaleOrder);
