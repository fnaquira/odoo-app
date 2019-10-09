import React from 'react';
import Icon from 'react-native-ionicons';

export default function DrawerButton(props) {
	return (
		<Icon
			size={30}
			name={'md-menu'}
			color="#fff"
			onPress={() => props.scene.descriptor.navigation.openDrawer()}
		/>
	);
}
