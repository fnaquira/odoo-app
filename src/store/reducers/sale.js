import moment from 'moment';
import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../lib/utility';

const initialState = {
	error: null,
	loading: false,
	id: null,
	date: moment()
		.add(1, 'days')
		.format('YYYY-MM-DD'),
	partner_name: '',
	partner_id: null,
	total: 0,
	selected: -1,
	items: []
};

const saleStart = (state, action) => {
	return updateObject(state, { error: null, loading: true });
};

const saleSuccess = (state, action) => {
	return updateObject(state, {
		id: action.id,
		error: null,
		loading: false
	});
};

const saleFail = (state, action) => {
	return updateObject(state, {
		error: action.error,
		loading: false
	});
};

const saleResetError = (state, action) => {
	return updateObject(state, {
		error: null
	});
};

const saleReset = (state, action) => {
	return initialState;
};

const saleId = (state, action) => {
	return updateObject(state, {
		id: action.id
	});
};

const saleDate = (state, action) => {
	return updateObject(state, {
		date: action.date
	});
};

const salePartner = (state, action) => {
	return updateObject(state, {
		partner_id: action.partner_id,
		partner_name: action.partner_name
	});
};

const saleAddRow = (state, action) => {
	const newState = updateObject(state, {
		items: [
			...state.items,
			{
				product: action.product,
				qty: action.qty,
				tax: action.product.type_sale_tax,
				price_unit: action.product.list_price,
				subtotal: action.qty * action.product.list_price
			}
		]
	});
	return {
		...newState,
		...calcTotals(newState.items)
	};
};

const calcTotals = items => {
	let total = 0;
	items.forEach(item => {
		total += item.subtotal;
	});
	return {
		total: total
	};
};

const saleSelectItem = (state, action) => {
	return updateObject(state, {
		selected: action.index
	});
};

const saleRemoveRow = (state, action) => {
	return updateObject(state, {
		selected: -1,
		items: state.items.filter((it, i) => i !== state.selected)
	});
};

const saleEditRow = (state, action) => {
	const newState = updateObject(state, {
		selected: -1,
		items: state.items.map((it, i) => {
			if (i === state.selected) {
				return {
					...it,
					...action.item,
					subtotal:
						parseFloat(action.item.qty) * parseFloat(action.item.price_unit)
				};
			}
			return it;
		})
	});
	return {
		...newState,
		...calcTotals(newState.items)
	};
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.SALE_START:
			return saleStart(state, action);
		case actionTypes.SALE_SUCCESS:
			return saleSuccess(state, action);
		case actionTypes.SALE_FAIL:
			return saleFail(state, action);
		case actionTypes.SALE_RESET_ERROR:
			return saleResetError(state, action);
		case actionTypes.SALE_RESET:
			return saleReset(state, action);
		case actionTypes.SALE_ID:
			return saleId(state, action);
		case actionTypes.SALE_DATE:
			return saleDate(state, action);
		case actionTypes.SALE_PARTNER:
			return salePartner(state, action);
		case actionTypes.SALE_ADD_ROW:
			return saleAddRow(state, action);
		case actionTypes.SALE_ROW_SELECT:
			return saleSelectItem(state, action);
		case actionTypes.SALE_ROW_REMOVE:
			return saleRemoveRow(state, action);
		case actionTypes.SALE_ROW_EDIT:
			return saleEditRow(state, action);
		default:
			return state;
	}
};

export default reducer;
