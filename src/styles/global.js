import { StyleSheet } from 'react-native';

import { fonts } from './base';

const styles = StyleSheet.create({
	title: {
		fontSize: fonts.lg,
		textAlign: 'center'
	},
	subtitle: {
		fontSize: fonts.lg,
		textAlign: 'center'
	},
	iconContainer: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-around'
	}
});

export { styles };
