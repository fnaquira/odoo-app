export const updateObject = (oldObject, updatedProperties) => {
	return {
		...oldObject,
		...updatedProperties
	};
};

export const formatCurrency = (value, currency = 'PEN') => {
	let sign = 'S/';
	if (currency === 'USD') sign = '$';
	return sign + parseFloat(value).toFixed(2);
};
