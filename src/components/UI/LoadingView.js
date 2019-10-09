import React from 'react';
import {
	View,
	ScrollView,
	Text,
	ActivityIndicator,
	StatusBar
} from 'react-native';

export default function LoadingView() {
	return (
		<ScrollView
			style={{
				flex: 1,
				width: '100%',
				height: '100%',
				backgroundColor: '#f4f3f4'
			}}
		>
			<View
				style={{
					flex: 1,
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'stretch',
					paddingTop: 20
				}}
			>
				<ActivityIndicator />
				<StatusBar barStyle="default" />
				<Text
					style={{
						textAlign: 'center',
						fontWeight: 'bold'
					}}
				>
					Solicitando información a servidor...
				</Text>
			</View>
		</ScrollView>
	);
}
