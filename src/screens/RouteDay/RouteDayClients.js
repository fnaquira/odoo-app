import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	View,
	ActivityIndicator,
	FlatList,
	Text,
	TouchableOpacity
} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Fumi } from 'react-native-textinput-effects';

import * as actions from '../../store/actions/sale';

import connectDb from '../../lib/connect';

import { styles } from '../../styles/grid';

class CustomerList extends Component {
	static navigationOptions = {
		title: 'Seleccionar Cliente'
	};
	state = {
		loading: true,
		serverData: [],
		fetching_from_server: false
	};

	async componentDidMount() {
		const odoo = await connectDb();
		const respo = await odoo
			.rpc_call('/web/dataset/call_kw', {
				model: 'res.partner',
				method: 'get_daily_route',
				args: [
					[parseInt(this.props.uid, 10)],
					{ uid: parseInt(this.props.uid, 10) }
				],
				kwargs: {}
			})
			.then(response => {
				this.setState({
					serverData: [...this.state.serverData, ...response.data],
					loading: false
				});
			})
			.catch(e => {
				console.log(e);
			});
	}
	selectHandler = partner => {
		this.props.navigation.navigate('CustomerDetails', {
			partnerId: partner.id,
			mode: 'route'
		});
	};

	renderItem = ({ item, index }) => {
		return (
			<TouchableOpacity onPress={() => this.selectHandler(item)}>
				<View style={styles.item}>
					<Text style={styles.text}>{`[${
						item.vat
					}] ${item.name.toUpperCase()}`}</Text>
					<Text style={styles.subtext}>
						{item.street ? item.street.toUpperCase() : ''}
					</Text>
				</View>
			</TouchableOpacity>
		);
	};
	render() {
		return (
			<View style={styles.container}>
				{this.state.loading ? (
					<ActivityIndicator size="large" />
				) : (
					<FlatList
						style={{ width: '100%' }}
						keyExtractor={(item, index) => `${index}`}
						data={this.state.serverData}
						renderItem={this.renderItem}
						ItemSeparatorComponent={() => <View style={styles.separator} />}
					/>
				)}
			</View>
		);
	}
}
const mapStateToProps = state => {
	return {
		uid: state.auth.uid
	};
};
const mapDispatchToProps = dispatch => {
	return {
		setPartner: partner => dispatch(actions.setPartner(partner))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(CustomerList);
