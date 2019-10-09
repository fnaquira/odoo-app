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

const PER_PAGE = 25;
const DB_MODEL = 'res.partner';
const DB_PARAMS = {
	domain: [['customer', '=', true]],
	fields: ['name', 'vat', 'street', 'customer'],
	order: 'name',
	limit: PER_PAGE,
	offset: 0
};

class CustomerList extends Component {
	static navigationOptions = {
		title: 'Seleccionar Cliente'
	};
	state = {
		loading: true,
		search: '',
		serverData: [],
		fetching_from_server: false,
		offset: 0
	};

	async componentDidMount() {
		DB_PARAMS.domain = [['customer', '=', true]];
		DB_PARAMS.offset = 0;
		const odoo = await connectDb();
		odoo
			.search_read(DB_MODEL, DB_PARAMS)
			.then(response => {
				this.setState({
					serverData: [...this.state.serverData, ...response.data],
					offset: 1,
					loading: false
				});
			})
			.catch(e => {
				console.log(e);
			});
	}

	loadMoreData = () => {
		this.setState({ fetching_from_server: true }, async () => {
			const odoo = await connectDb();
			DB_PARAMS.offset = this.state.offset * PER_PAGE;
			odoo
				.search_read(DB_MODEL, DB_PARAMS)
				.then(response => {
					this.setState({
						serverData: [...this.state.serverData, ...response.data],
						offset: this.state.offset + 1,
						fetching_from_server: false
					});
				})
				.catch(e => {
					console.log(e);
				});
		});
	};

	searchData = () => {
		this.setState({ loading: true }, async () => {
			const odoo = await connectDb();
			if (this.state.search.length === 0) {
				DB_PARAMS.domain = [['customer', '=', true]];
			} else {
				if (DB_PARAMS.domain.length === 1)
					DB_PARAMS.domain.push(['name', 'ilike', this.state.search]);
				else DB_PARAMS.domain[1][2] = this.state.search;
			}
			DB_PARAMS.offset = 0;
			odoo
				.search_read(DB_MODEL, DB_PARAMS)
				.then(response => {
					this.setState({
						serverData: [...response.data],
						offset: 1,
						loading: false
					});
				})
				.catch(e => {
					console.log(e);
				});
		});
	};

	selectHandler = partner => {
		const mode = this.props.navigation.getParam('mode');
		if (mode) {
			this.props.setPartner(partner);
			this.props.navigation.navigate('SaleOrder');
		} else {
			this.props.navigation.navigate('CustomerDetails', {
				partnerId: partner.id
			});
		}
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

	renderHeader = () => {
		return (
			<View style={styles.header}>
				<Fumi
					label={'Busque su cliente...'}
					iconClass={FontAwesomeIcon}
					iconName={'user'}
					iconColor={'#f95a25'}
					iconSize={20}
					iconWidth={40}
					inputPadding={16}
					style={{ margin: 5 }}
					onChangeText={search => this.setState({ search })}
					value={this.state.search}
					onSubmitEditing={this.searchData}
				/>
			</View>
		);
	};

	renderFooter = () => {
		return (
			<View style={styles.footer}>
				<TouchableOpacity
					activeOpacity={0.9}
					onPress={this.loadMoreData}
					style={styles.loadMoreBtn}
				>
					<Text style={styles.btnText}>Ver más</Text>
					{this.state.fetching_from_server ? (
						<ActivityIndicator color="white" style={{ marginLeft: 8 }} />
					) : null}
				</TouchableOpacity>
			</View>
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
						ListHeaderComponent={this.renderHeader}
						ListFooterComponent={this.renderFooter}
					/>
				)}
			</View>
		);
	}
}

const mapDispatchToProps = dispatch => {
	return {
		setPartner: partner => dispatch(actions.setPartner(partner))
	};
};

export default connect(
	null,
	mapDispatchToProps
)(CustomerList);
