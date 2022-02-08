/** @format */

import { VercelRequest, VercelResponse } from '@vercel/node';
import * as okta from '@okta/okta-sdk-nodejs';
import { RequestOptions } from '@okta/okta-auth-js';

const API_KEY = '00zG_uCLPChFQrszrq3gTGF34GIECT5lVx281WKErp',
	ORG_URL = process.env.REACT_APP_OKTA_URL,
	client = new okta.Client({ orgUrl: ORG_URL, token: API_KEY });

export interface Authenticator extends Omit<okta.Authenticator, '_links'> {
	_links?: { [name: string]: unknown };
}

const parseAuthenticators = async (
	res: Response,
	filter?: { status: string; type: string }
): Promise<Authenticator[]> => {
	try {
		if (res.ok) {
			const body = (await res.json()) as Authenticator[];

			let authenticators: Authenticator[] = [];

			body.forEach((authenticator) => {
				delete authenticator._links;
				authenticators.push(authenticator);
			});

			return authenticators;
		} else {
			throw new Error(`Response not ok! [${res}]`);
		}
	} catch (error) {
		console.error(error);
		throw error;
	}
};

export const getAuthenticators = async () => {
	try {
		const url = `${ORG_URL}/api/v1/authenticators`;

		const request: RequestInit = {
			method: 'get',
		};

		const response = await client.http.http(url, request as RequestOptions);

		const authenticators = await parseAuthenticators(response);

		return { status: 200, authenticators };
	} catch (error) {
		console.error(error);
		return { status: 500, error };
	}
};

const index = (req: VercelRequest, res: VercelResponse) => {
	try {
		return getAuthenticators().then((resp) => res.status(resp?.status).send(resp?.authenticators));
	} catch (error) {
		console.error(error);
		return res.status(500).send(error);
	}
};

export default index;
