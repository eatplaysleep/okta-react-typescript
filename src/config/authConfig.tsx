/**
 * /*
 * Copyright (c) 2018-Present, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 *
 * @format
 */

type AuthConfig = {
	oidc: OidcConfig;
};

type OidcConfig = {
	clientId: string;
	issuer: string;
	redirectUri: string;
	scopes: string[];
	pkce: boolean;
	tokenManager: {
		autoRenew: boolean;
	};
	disableHttpsCheck?: boolean;
};

const OKTA_TESTING_DISABLEHTTPSCHECK =
	process.env.OKTA_TESTING_DISABLEHTTPSCHECK ?? false;
const REDIRECT_URI = `${window.location.origin}/login/callback`;
const SCOPES: string = process.env.REACT_APP_OKTA_SCOPES ?? 'openid profile';
const CLIENT_ID = process.env.REACT_APP_OKTA_CLIENT_ID ?? '';
const AUTH_SERVER_ID = process.env.REACT_APP_OKTA_AUTH_SERVER_ID ?? 'default';
const OKTA_URL = process.env.REACT_APP_OKTA_URL ?? '';
const ISSUER = `${OKTA_URL}/oauth2/${AUTH_SERVER_ID}`;

export const authConfig: AuthConfig = {
	oidc: {
		clientId: CLIENT_ID,
		issuer: ISSUER,
		redirectUri: REDIRECT_URI,
		scopes: SCOPES.split(' '),
		pkce: true,
		tokenManager: {
			autoRenew: true,
		},
		disableHttpsCheck: OKTA_TESTING_DISABLEHTTPSCHECK as boolean,
	},
};
