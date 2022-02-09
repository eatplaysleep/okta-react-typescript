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

import React, { useState, useEffect } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import { JWTObject, UserClaims } from '@okta/okta-auth-js';
import { Accordion, AccordionTitleProps, Header, Icon, Table } from 'semantic-ui-react';
import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/monikai.css';

interface UserInfo extends UserClaims {
	[key: string]: any;
}

export const Profile = () => {
	const { authState, oktaAuth } = useOktaAuth();
	const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
	const [atClaims, setAtClaims] = useState<UserClaims | null>(null);
	const [activeIndex, setActiveIndex] = useState<number>(0);

	const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, titleProps: AccordionTitleProps) => {
		const { index } = titleProps;

		setActiveIndex(() => (activeIndex === index ? -1 : (index as number)));
	};
	useEffect(() => {
		const decodeToken = (token: string): JWTObject => oktaAuth.token.decode(token);

		if (!authState || !authState.isAuthenticated) {
			// When user isn't authenticated, forget any user info
			setUserInfo(null);
		} else {
			oktaAuth
				.getUser()
				.then((info: UserInfo) => {
					if (info?.headers) {
						delete info.headers;
					}

					console.log(JSON.stringify(info, null, 2));
					setUserInfo(info);
				})
				.catch((err) => {
					console.error(err);
				});

			setAtClaims(() => {
				const { payload } = decodeToken(oktaAuth.getAccessToken() as string) || {};

				return payload;
			});
		}
	}, [authState, oktaAuth]); // Update if authState changes

	if (!userInfo) {
		return (
			<div>
				<p>Fetching user profile...</p>
			</div>
		);
	}

	return (
		<div>
			<div>
				<Header as='h1'>
					<Icon name='drivers license' /> My User Profile (Token Claims){' '}
				</Header>
				<p>
					Below is the information from calling /userinfo as well as parsing the Access Token, which was obtained during
					the &nbsp;
					<a href='https://developer.okta.com/docs/guides/implement-auth-code-pkce'>PKCE Flow</a> and is now stored in
					local storage.
				</p>
				<p>
					This route is protected with the <code>&lt;SecureRoute&gt;</code> component, which will ensure that this page
					cannot be accessed until you have authenticated.
				</p>
				<Accordion styled fluid>
					<Accordion.Title active={activeIndex === 0} index={0} onClick={handleClick}>
						<Icon name='dropdown' />
						/userinfo
					</Accordion.Title>
					<Accordion.Content active={activeIndex === 0}>
						<JSONPretty id='userinfo' data={userInfo} />
					</Accordion.Content>
					<Accordion.Title active={activeIndex === 1} index={1} onClick={handleClick}>
						<Icon name='dropdown' />
						Access Token
					</Accordion.Title>
					<Accordion.Content active={activeIndex === 1}>
						<JSONPretty id='atClaims' data={atClaims} />
					</Accordion.Content>
				</Accordion>
			</div>
		</div>
	);
};
