import * as actionTypes from './actionTypes';

import connectDb from '../../lib/connect';

export const saleStart = () => {
	return {
		type: actionTypes.SALE_START
	};
};

export const saleSuccess = id => {
	return {
		type: actionTypes.SALE_SUCCESS,
		id
	};
};

export const saleFail = error => {
	return {
		type: actionTypes.SALE_FAIL,
		error
	};
};

export const saleResetError = () => {
	return {
		type: actionTypes.SALE_RESET_ERROR
	};
};

export const saleReset = () => {
	return {
		type: actionTypes.SALE_RESET
	};
};

export const saleId = id => {
	return {
		type: actionTypes.SALE_ID,
		id
	};
};

export const saleDate = date => {
	return {
		type: actionTypes.SALE_DATE,
		date
	};
};

export const setPartner = partner => {
	return {
		type: actionTypes.SALE_PARTNER,
		partner_id: partner.id,
		partner_name: partner.name
	};
};

export const setProduct = (product, qty) => {
	return {
		type: actionTypes.SALE_ADD_ROW,
		product: product,
		qty: qty
	};
};

export const saleSelectItem = index => {
	return {
		type: actionTypes.SALE_ROW_SELECT,
		index
	};
};

export const editItem = item => {
	return {
		type: actionTypes.SALE_ROW_EDIT,
		item
	};
};

export const removeItem = () => {
	return {
		type: actionTypes.SALE_ROW_REMOVE
	};
};

export const saveOrder = () => {
	return async (dispatch, getState) => {
		dispatch(saleStart());
		const sale = getState().sale;
		if (!sale.partner_id) {
			return dispatch(saleFail('Debe seleccionar un cliente!'));
		}
		if (sale.items.length === 0) {
			return dispatch(saleFail('Debe seleccionar al menos un producto!'));
		}
		const data = {
			partner_id: sale.partner_id,
			date_order: sale.date,
			order_line: sale.items.map(item => {
				return [
					0,
					0,
					{
						product_id: item.product.id,
						product_uom_qty: item.qty,
						price_unit: item.price_unit
					}
				];
			})
		};
		const context = {
			lang: 'es_PE',
			uid: getState().auth.uid,
			tz: 'America/Lima'
		};
		const odoo = await connectDb();
		try {
			const saleOdoo = await odoo.create('sale.order', data, context);
			await odoo.rpc_call('/web/dataset/call_kw', {
				model: 'sale.order',
				method: 'action_confirm',
				args: [[saleOdoo.data], context],
				kwargs: {}
			});
			dispatch(saleSuccess(saleOdoo.data));
		} catch (err) {
			dispatch(saleFail(err));
		}
	};
};
