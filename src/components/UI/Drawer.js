import React from 'react';
import { connect } from 'react-redux';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { DrawerItems, SafeAreaView } from 'react-navigation';

const Drawer = props => {
	return (
		<ScrollView>
			<SafeAreaView
				style={styles.container}
				forceInset={{ top: 'always', horizontal: 'never' }}
			>
				<View style={styles.header}>
					<Text style={styles.headerName}>{props.name}</Text>
					<Text style={styles.headerEmail}>{props.email}</Text>
				</View>
				<DrawerItems {...props} />
			</SafeAreaView>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	header: {
		backgroundColor: '#86587b',
		color: '#fff',
		padding: 20
	},
	headerName: {
		fontWeight: 'bold',
		fontSize: 16,
		color: '#fff'
	},
	headerEmail: {
		color: '#fff'
	}
});

const mapStateToProps = state => {
	return {
		name: state.auth.name,
		email: state.auth.email
	};
};

export default connect(mapStateToProps)(Drawer);
