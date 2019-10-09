import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { TouchableOpacity, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import * as actions from '../../../store/actions/sale';

const SaleOrderItemEdit = ({ editItem, removeItem, navigation }) => {
	return (
		<Fragment>
			<TouchableOpacity
				onPress={() => {
					const item = {
						qty: navigation.getParam('qty'),
						price_unit: navigation.getParam('price')
					};
					if (
						isNaN(item.qty) ||
						isNaN(item.price_unit) ||
						item.qty === '' ||
						item.price_unit === ''
					) {
						return Alert.alert(
							'Falta validar!',
							'Debe ingresar valores correctos tanto en cantidad como en precio!'
						);
					}
					navigation.goBack();
					editItem(item);
				}}
				style={{
					backgroundColor: '#22b79a',
					borderRadius: 25,
					borderWidth: 1,
					borderColor: '#fff',
					width: 30,
					paddingLeft: 8,
					marginRight: 10
				}}
			>
				<Ionicons name="ios-checkmark" size={30} color="#fff" />
			</TouchableOpacity>
			<TouchableOpacity
				onPress={() => {
					Alert.alert(
						'Eliminar item',
						'¿Está seguro de eliminar el item seleccionado?',
						[
							{
								text: 'Si, eliminar',
								onPress: () => {
									navigation.goBack();
									removeItem();
								}
							},
							{
								text: 'Cancelar',
								onPress: () => navigation.goBack(),
								style: 'cancelar'
							}
						],
						{ cancelable: false }
					);
				}}
				style={{
					backgroundColor: 'red',
					borderRadius: 25,
					borderWidth: 1,
					borderColor: '#fff',
					width: 30,
					paddingLeft: 6,
					marginRight: 10
				}}
			>
				<Ionicons name="ios-trash" size={28} color="#fff" />
			</TouchableOpacity>
		</Fragment>
	);
};

const mapDispatchToProps = dispatch => {
	return {
		editItem: item => dispatch(actions.editItem(item)),
		removeItem: () => dispatch(actions.removeItem())
	};
};

export default connect(
	null,
	mapDispatchToProps
)(SaleOrderItemEdit);
