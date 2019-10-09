import React from 'react';
import { connect } from 'react-redux';
import { TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import * as actions from '../../../store/actions/sale';

const SaleOrderSave = ({ saveOrder }) => {
	return (
		<TouchableOpacity
			onPress={saveOrder}
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
	);
};

const mapDispatchToProps = dispatch => {
	return {
		saveOrder: () => dispatch(actions.saveOrder())
	};
};

export default connect(
	null,
	mapDispatchToProps
)(SaleOrderSave);
