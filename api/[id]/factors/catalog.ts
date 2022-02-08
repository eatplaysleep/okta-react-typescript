/** @format */
import { VercelRequest, VercelResponse } from '@vercel/node';
import { getAvailableFactors } from '.';

const index = (req: VercelRequest, res: VercelResponse) => {
	try {
		return getAvailableFactors(req, res);
	} catch (error) {
		console.error(error);
		return res.status(500).send(error);
	}
};

export default index;
