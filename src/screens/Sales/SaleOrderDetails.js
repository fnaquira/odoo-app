import React, { Component } from 'react';
import {
	Text,
	ScrollView,
	TouchableOpacity,
	View,
	StyleSheet
} from 'react-native';

import connectDb from '../../lib/connect';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { formatCurrency } from '../../lib/utility';

class SaleOrderDetails extends Component {
	static navigationOptions = ({ navigation }) => {
		const { state } = navigation;
		return {
			title: `${state.params.title ? state.params.title : 'Cargando...'}`
		};
	};
	state = {
		loading: true,
		data: null,
		lines: []
	};
	async componentDidMount() {
		const saleOrderId = this.props.navigation.getParam('saleId');
		const odoo = await connectDb();
		try {
			const response = await odoo.get('sale.order', {
				ids: [saleOrderId],
				fields: [
					'name',
					'date_order',
					'partner_id',
					'order_line',
					'amount_total'
				]
			});
			const DB_PARAMS = {
				ids: response.data[0].order_line,
				domain: [['order_id', '=', this.props.navigation.getParam('saleId')]],
				fields: [
					'name',
					'price_unit',
					'price_subtotal',
					'product_uom_qty',
					'product_uom'
				],
				offset: 0
			};
			odoo
				.search_read('sale.order.line', DB_PARAMS)
				.then(order_details => {
					this.setState({ lines: order_details.data });
				})
				.catch(e => {
					console.log(e);
				});
			this.setState({ loading: false, data: response.data[0] });
			this.props.navigation.setParams({ title: response.data[0].name });
		} catch (error) {
			console.log(error);
			this.setState({ loading: false });
		}
	}
	render() {
		let fecha = '';
		let cliente = '';
		let name = '';
		let total = '';
		if (this.state.data) {
			fecha = this.state.data.date_order.slice(0, 10);
			cliente = this.state.data.partner_id[1];
			name = this.state.data.name;
			total = this.state.data.amount_total;
		}
		return (
			<ScrollView
				style={{
					flex: 1,
					backgroundColor: '#f4f3f4'
				}}
			>
				<View style={styles.card}>
					<Text>Orden:</Text>
					<TouchableOpacity
						style={{
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center'
						}}
					>
						<Text style={{ color: '#000', fontSize: 14 }}>{name}</Text>
						<Ionicons name="ios-paper" size={30} color="#22b79a" />
					</TouchableOpacity>
					<Text>Fecha de Pedido:</Text>
					<TouchableOpacity
						style={{
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center'
						}}
					>
						<Text style={{ color: '#000', fontSize: 14 }}>{fecha}</Text>
						<Ionicons name="ios-calendar" size={30} color="#22b79a" />
					</TouchableOpacity>
					<Text>Cliente:</Text>
					<TouchableOpacity
						style={{
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center'
						}}
					>
						<Text style={{ color: '#000', fontSize: 14 }}>{cliente}</Text>
						<Ionicons name="ios-person" size={30} color="#22b79a" />
					</TouchableOpacity>
				</View>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-around',
						alignItems: 'flex-start',
						padding: 10
					}}
				>
					<Text style={{ color: '#22b79a', fontSize: 16 }}>
						Lineas de Pedido
					</Text>
				</View>
				{this.state.lines.map((item, index) => {
					return (
						<View
							style={[styles.card, { marginBottom: 2, marginTop: 2 }]}
							key={index}
						>
							<Text style={{ color: '#000', fontWeight: 'bold' }}>
								{item.name}
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
									<Text style={{ color: '#000' }}>{item.product_uom_qty}</Text>
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
										{formatCurrency(item.price_subtotal)}
									</Text>
								</View>
							</View>
						</View>
					);
				})}
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
					<Text style={{ color: '#000' }}>{formatCurrency(total)}</Text>
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

export default SaleOrderDetails;
