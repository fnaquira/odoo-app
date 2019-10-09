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
const DB_MODEL = 'sale.order';
const DB_PARAMS = {
	domain: [['state', '!=', 'cancel']],
	fields: ['name', 'date_order', 'partner_id', 'order_line'],
	order: 'name',
	limit: PER_PAGE,
	offset: 0
};

class SaleOrderClient extends Component {
	static navigationOptions = {
		title: 'Ordenes de Cliente'
	};
	state = {
		loading: true,
		search: '',
		serverData: [],
		fetching_from_server: false,
		offset: 0
	};

	async componentDidMount() {
		DB_PARAMS.domain = [['state', '!=', 'cancel']];
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
				DB_PARAMS.domain = [['state', '!=', 'cancel']];
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

	selectHandler = sale_order => {
		id = sale_order.id;
		this.props.navigation.navigate({
			routeName: 'SaleOrderDetails',
			params: { saleId: id }
		});
	};

	renderItem = ({ item, index }) => {
		return (
			<TouchableOpacity onPress={() => this.selectHandler(item)}>
				<View style={styles.item}>
					<Text style={styles.text}>{`${item.name.toUpperCase()}`}</Text>
					<Text style={styles.text}>
						{item.date_order ? item.date_order.slice(0, 10) : ''}
					</Text>
					<Text style={styles.text}>
						{item.partner_id ? item.partner_id[1] : ''}
					</Text>
				</View>
			</TouchableOpacity>
		);
	};

	renderHeader = () => {
		return (
			<View style={styles.header}>
				<Fumi
					label={'Busque una orden...'}
					iconClass={FontAwesomeIcon}
					iconName={'search'}
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
)(SaleOrderClient);
