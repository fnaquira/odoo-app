import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

const Button = props => {
	return (
		<TouchableOpacity
			onPress={props.onPress}
			style={{
				marginTop: 5,
				padding: 10,
				justifyContent: 'center',
				alignItems: 'center',
				borderRadius: 25,
				backgroundColor: props.color || '#dcdcdc'
			}}
		>
			<Text
				style={{
					color: '#46494f',
					fontSize: 12,
					fontWeight: 'bold'
				}}
			>
				{props.title}
			</Text>
		</TouchableOpacity>
	);
};

export default Button;
