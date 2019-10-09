import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-ionicons';
import { Fumi } from 'react-native-textinput-effects';

import * as actions from '../../../store/actions/sale';

import SaleOrderItemEdit from './SaleOrderItemEdit';
import LoadingView from '../../../components/UI/LoadingView';

class index extends Component {
	static navigationOptions = ({ navigation }) => {
		return {
			title: 'Editar línea',
			headerRight: <SaleOrderItemEdit navigation={navigation} />
		};
	};
	state = {
		qty: '',
		price: ''
	};
	componentDidMount() {
		this.setState({
			qty: `${this.props.qty}`,
			price: `${this.props.price}`
		},
		() => {
			this.props.navigation.setParams({
				price: this.state.price,
				qty: this.state.qty
			});
		});
	}
	componentDidUpdate(oldProps) {
		if (oldProps.qty !== this.props.qty || oldProps.price !== this.props.price)
			this.setState(
				{
					qty: `${this.props.qty}`,
					price: `${this.props.price}`
				},
				() => {
					this.props.navigation.setParams({
						price: this.state.price,
						qty: this.state.qty
					});
				}
			);
	}
	inputHandler = (field, value) => {
		this.setState({ [field]: value }, () => {
			this.props.navigation.setParams({
				price: this.state.price,
				qty: this.state.qty
			});
		});
	};
	render() {
		if (!this.props.product) {
			return <LoadingView />;
		}
		return (
			<ScrollView style={styles.container}>
				<View style={[styles.card]}>
					<Text style={{ fontSize: 16, fontWeight: 'bold', margin: 10 }}>
						{this.props.product.name}
					</Text>
					<View>
						<Fumi
							style={{
								backgroundColor: '#46494f',
								opacity: 0.8,
								marginBottom: 8
							}}
							label={'Cantidad'}
							iconClass={Icon}
							onChangeText={text => this.inputHandler('qty', text)}
							iconName={'calculator'}
							value={this.state.qty}
							autoCapitalize="none"
							iconColor={'#fff'}
							labelStyle={{ color: 'white' }}
							iconSize={20}
							iconWidth={30}
							inputPadding={16}
						/>
					</View>
					<View>
						<Fumi
							style={{
								backgroundColor: '#46494f',
								opacity: 0.8,
								marginBottom: 8
							}}
							label={'Precio'}
							iconClass={Icon}
							onChangeText={text => this.inputHandler('price', text)}
							iconName={'cash'}
							value={this.state.price}
							autoCapitalize="none"
							iconColor={'#fff'}
							labelStyle={{ color: 'white' }}
							iconSize={20}
							iconWidth={30}
							inputPadding={16}
						/>
					</View>
				</View>
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: '100%',
		height: '100%',
		backgroundColor: '#f4f3f4'
	},
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
	if (state.sale.selected !== -1) {
		const selected = state.sale.selected;
		return {
			product: state.sale.items[selected].product,
			qty: state.sale.items[selected].qty,
			price: state.sale.items[selected].price_unit
		};
	} else return {};
};

const mapDispatchToProps = dispatch => {
	return {
		setPartner: partner => dispatch(actions.setPartner(partner))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(index);
