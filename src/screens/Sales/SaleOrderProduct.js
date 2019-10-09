import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {
	View,
	ActivityIndicator,
	FlatList,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	Alert
} from 'react-native';
import { Button } from 'react-native-elements';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Fumi } from 'react-native-textinput-effects';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FloatingAction } from 'react-native-floating-action';

import * as actions from '../../store/actions/sale';

import connectDb from '../../lib/connect';
import { formatCurrency } from '../../lib/utility';

import LoadingView from '../../components/UI/LoadingView';

import { styles } from '../../styles/grid';

const PER_PAGE = 25;
const DB_MODEL = 'product.product';
const DB_PARAMS = {
	domain: [['sale_ok', '=', true]],
	fields: [
		'name',
		'default_code',
		'list_price',
		'type_sale_tax',
		'qty_available'
	],
	order: 'name',
	limit: PER_PAGE,
	offset: 0
};

class SaleOrderProduct extends Component {
	static navigationOptions = {
		title: 'Agregar producto'
	};
	state = {
		loading: true,
		search: '',
		serverData: [],
		fetching_from_server: false,
		offset: 0,
		productId: null,
		product: null,
		qty: '1',
		ubication_id: '',
		stock_available: ''
	};

	async componentDidMount() {
		DB_PARAMS.domain = [['sale_ok', '=', true]];
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
				DB_PARAMS.domain = [['sale_ok', '=', true]];
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

	selectHandler = product => {
		this.setState({ productId: product.id, product });
	};

	qtyHandler = qty => {
		this.setState({ qty });
	};
	minusHandler = () => {
		if (!isNaN(this.state.qty))
			this.setState({ qty: parseFloat(this.state.qty) - 1 + '' });
	};
	plusHandler = () => {
		if (!isNaN(this.state.qty))
			this.setState({ qty: parseFloat(this.state.qty) + 1 + '' });
	};

	addRow = () => {
		if (!this.state.product) {
			return Alert.alert(
				'Complete la información!',
				'Debe seleccionar un producto!'
			);
		}
		if (isNaN(this.state.qty)) {
			return Alert.alert(
				'Complete la información!',
				'Debe ingresar una cantidad válida!'
			);
		}
		this.props.setProduct(this.state.product, this.state.qty);
		this.props.navigation.navigate('SaleOrder');
	};

	renderItem = ({ item, index }) => {
		return (
			<Fragment>
				<TouchableOpacity onPress={() => this.selectHandler(item)}>
					<View style={styles.item}>
						<Text style={styles.text}>{item.name.toUpperCase()}</Text>
						<Text style={styles.subtext}>
							[{item.default_code}] {formatCurrency(item.list_price)} - Stock
							Disponible {item.qty_available}
						</Text>
					</View>
				</TouchableOpacity>
				{this.state.productId === item.id ? (
					<View>
						<View
							style={{ flexDirection: 'row', paddingLeft: 5, paddingRight: 5 }}
						>
							<Button
								onPress={this.minusHandler}
								buttonStyle={{ backgroundColor: 'red' }}
								icon={
									<FontAwesomeIcon
										name="minus-circle"
										size={15}
										color="white"
									/>
								}
							/>
							<TextInput
								style={{ textAlign: 'center', width: '83%' }}
								onChangeText={this.qtyHandler}
								value={this.state.qty}
								keyboardType="decimal-pad"
							/>
							<Button
								onPress={this.plusHandler}
								icon={
									<FontAwesomeIcon name="plus-circle" size={15} color="white" />
								}
							/>
						</View>
					</View>
				) : null}
			</Fragment>
		);
	};

	renderHeader = () => {
		return (
			<View style={styles.header}>
				<Fumi
					label={'Busque su producto...'}
					iconClass={FontAwesomeIcon}
					iconName={'shopping-cart'}
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
		if (this.state.loading) return <LoadingView />;
		const actions = [
			{
				text: 'Agregar producto',
				name: 'bt_add',
				color: '#22b79a',
				icon: <Ionicons name="ios-checkmark" size={30} color="#fff" />,
				position: 1
			},
			{
				text: 'Cancelar',
				name: 'bt_cancel',
				color: 'red',
				icon: <Ionicons name="ios-close" size={30} color="#fff" />,
				position: 2
			}
		];
		return (
			<View style={styles.container}>
				<FlatList
					style={{ width: '100%' }}
					keyExtractor={(item, index) => `${index}`}
					data={this.state.serverData}
					renderItem={this.renderItem}
					ItemSeparatorComponent={() => <View style={styles.separator} />}
					ListHeaderComponent={this.renderHeader}
					ListFooterComponent={this.renderFooter}
				/>
				<FloatingAction
					floatingIcon={
						<Ionicons name="ios-checkmark" size={40} color="#fff" />
					}
					position="right"
					color="#22b79a"
					actions={actions}
					onPressItem={name => {
						if (name === 'bt_add') {
							this.addRow();
						} else if (name === 'bt_cancel') {
							this.cancelHandler();
						}
					}}
				/>
			</View>
		);
	}
}

const mapDispatchToProps = dispatch => {
	return {
		setProduct: (product, qty) => dispatch(actions.setProduct(product, qty))
	};
};

export default connect(
	null,
	mapDispatchToProps
)(SaleOrderProduct);
