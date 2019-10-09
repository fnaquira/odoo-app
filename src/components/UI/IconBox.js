import React from 'react';
import { StyleSheet, Image, Text, View, TouchableOpacity } from 'react-native';

import { textColor } from '../../styles/base';

const IconBox = props => {
	return (
		<TouchableOpacity onPress={props.onPress}>
			<View style={styles.container}>
				<Image style={styles.icon} source={props.icon} />
				<Text style={styles.value}>{props.value}</Text>
				<Text style={styles.label}>{props.label}</Text>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		padding: 20
	},

	icon: {
		flex: 1,
		alignSelf: 'center',
		height: 34,
		width: 34
	},

	value: {
		flex: 1,
		fontSize: 19,
		fontWeight: '200',
		color: textColor,
		textAlign: 'center'
	},

	label: {
		flex: 1,
		fontSize: 12,
		color: textColor,
		textAlign: 'center'
	}
});

export default IconBox;
