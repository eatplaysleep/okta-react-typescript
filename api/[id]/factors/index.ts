/** @format */

// const okta = require('@okta/okta-sdk-nodejs');

// const API_KEY = process.env.API_OKTA_KEY;
// const CLIENT_ID = process.env.API_OKTA_CLIENT_ID;
// const ORG_URL = 'https://expedia-oie.dannyfuhriman.com';

// const client = new okta.Client({
// 	orgUrl: ORG_URL,
// 	token: API_KEY,
// });

import { VercelRequest, VercelResponse } from '@vercel/node';
import * as okta from '@okta/okta-sdk-nodejs';
import { RequestOptions } from '@okta/okta-auth-js';

import { getAuthenticators, Authenticator } from '../../authenticators';

interface Factor extends Omit<OktaFactor, '_links'> {
	userId: string;
	id: string;
	key: string;
	authenticator?: Authenticator;
	name:
		| 'call'
		| 'email'
		| 'push'
		| 'question'
		| 'sms'
		| 'token:hardware'
		| 'token:hotp'
		| 'token:software:totp'
		| 'token'
		| 'u2f'
		| 'webauthn'
		| 'unknown';
	isRequired: boolean;
	_links?: { [name: string]: unknown };
}

interface OktaFactor extends Omit<okta.UserFactor, 'delete'> {
	enrollment?: string;
	profile?: {
		credentialId: string;
		authenticatorName: string;
	};
}

const API_KEY = '00zG_uCLPChFQrszrq3gTGF34GIECT5lVx281WKErp',
	ORG_URL = process.env.REACT_APP_OKTA_URL,
	client = new okta.Client({ orgUrl: ORG_URL, token: API_KEY });

const parseFactors = async (
	res: Response,
	filter?: { status: string; type: string }
): Promise<Factor[]> => {
	try {
		if (res.ok) {
			const url = new URL(res.url),
				paths = url.pathname.split('/'),
				userId = paths[paths.indexOf('users') + 1],
				body = (await res.json()) as OktaFactor[];

			let factors: Factor[] = [];

			const { authenticators } = await getAuthenticators();

			body.forEach(factor => {
				const _key = `${factor?.factorType}-${factor?.provider}`;

				let resp: Factor = {
					key: _key,
					userId: userId,
					name: factorMap[factor?.factorType as string] ?? 'Unknown',
					isRequired: factor?.enrollment === 'REQUIRED' ? true : false,
					authenticator: authenticators.filter(
						authenticator => _key === authenticatorMap[authenticator?.key]
					)[0],
					...factor,
				};

				delete resp._links;

				if (filter) {
					if (
						factor?.factorType === filter?.type ||
						factor?.status === filter?.status
					) {
						factors.push(resp);
					}
				} else {
					factors.push(resp);
				}
			});

			console.log(JSON.stringify(factors, null, 2));

			return factors;
		} else {
			throw new Error(`Response not ok! [${res}]`);
		}
	} catch (error) {
		console.error(error);
		throw error;
	}
};

const factorMap = {
	call: 'Call',
	email: 'Email',
	push: 'Okta Verify',
	question: 'Security Question',
	sms: 'SMS',
	'token:hardware': 'Hardware TOTP',
	'token:hotp': 'Custom HOTP',
	'token:software:totp': 'Software TOTP',
	token: 'OTP Device/Application',
	u2f: 'Hardware U2F',
	webauthn: 'WebAuthN',
};

const authenticatorMap = {
	google_otp: 'token:software:totp-GOOGLE',
	okta_verify: 'push-OKTA',
	okta_email: 'email-OKTA',
	webauthn: 'webauthn-FIDO',
	phone_number: 'sms-OKTA',
};

export const getAvailableFactors = async (
	req: VercelRequest,
	res: VercelResponse
) => {
	try {
		const {
			query: { id },
		} = req || {};

		const url = `${ORG_URL}/api/v1/users/${id}/factors/catalog`;

		const request: RequestInit = {
			method: 'get',
		};

		const response = await client.http.http(url, request as RequestOptions);

		return res.status(response?.status).send(await parseFactors(response));
	} catch (error) {
		console.error(error);
		return res.status(500).send(error);
	}
};

const getFactors = async (req: VercelRequest, res: VercelResponse) => {
	try {
		const {
			query: { id },
		} = req || {};

		const url = `${ORG_URL}/api/v1/users/${id}/factors`;

		const request: RequestInit = {
			method: 'get',
		};

		const response = await client.http.http(url, request as RequestOptions);

		return res.status(response?.status).send(await parseFactors(response));
	} catch (error) {
		console.error(error);
		return res.status(500).send(error);
	}
};

const index = (req: VercelRequest, res: VercelResponse) => {
	try {
		return getFactors(req, res);
	} catch (error) {
		console.error(error);
		return res.status(500).send(error);
	}
};

export default index;
