import { StyleSheet } from 'react-native';

import { fonts, colors } from './base';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	item: {
		padding: 10
	},
	separator: {
		height: 0.5,
		backgroundColor: 'rgba(0,0,0,0.4)'
	},
	text: {
		fontSize: 15,
		color: 'black'
	},
	subtext: {
		fontSize: 13,
		color: 'gray'
	},
	header: {
		backgroundColor: colors.odoo
	},
	footer: {
		padding: 10,
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row'
	},
	loadMoreBtn: {
		padding: 10,
		backgroundColor: '#800000',
		borderRadius: 4,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	btnText: {
		color: 'white',
		fontSize: 15,
		textAlign: 'center'
	}
});

export { styles };
