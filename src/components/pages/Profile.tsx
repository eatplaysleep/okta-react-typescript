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
import { UserClaims } from '@okta/okta-auth-js';
import { Button, Divider, Header, Icon, Table } from 'semantic-ui-react';

export const Profile = () => {
	const { authState, oktaAuth } = useOktaAuth();
	const [userInfo, setUserInfo] = useState<UserClaims | null>(null);
	const [availableFactors, setAvailableFactors] = useState<Array<any>>([]);

	useEffect(() => {
		if (!authState || !authState.isAuthenticated) {
			// When user isn't authenticated, forget any user info
			setUserInfo(null);
		} else {
			oktaAuth
				.getUser()
				.then((info) => {
					setUserInfo(info);
				})
				.catch((err) => {
					console.error(err);
				});
		}
	}, [authState, oktaAuth]); // Update if authState changes

	useEffect(() => {
		const getAvailableFactors = () => {
			let url = `${window.location.origin}/api/${userInfo?.sub}/factors/catalog`;

			return fetch(url)
				.then((resp) => {
					return resp.json();
				})
				.then((resp) => {
					if (Array.isArray(resp) && resp.length > 0) {
						setAvailableFactors(resp);
					}
				});
		};

		if (userInfo?.sub) {
			getAvailableFactors();
		}
		return () => setAvailableFactors(() => []);
	}, [userInfo?.sub, setAvailableFactors]);

	const handleSetup = (authenticatorId: string) => {
		const url = `${process.env.REACT_APP_OKTA_URL}/idp/authenticators/setup/${authenticatorId}?fromURI=http://localhost:3000`;

		window.open(url);
	};

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
					<Icon name='drivers license' /> My User Profile (ID Token Claims){' '}
				</Header>
				<p>
					Below is the information from your ID token which was obtained during the &nbsp;
					<a href='https://developer.okta.com/docs/guides/implement-auth-code-pkce'>PKCE Flow</a> and is now stored in
					local storage.
				</p>
				<p>
					This route is protected with the <code>&lt;SecureRoute&gt;</code> component, which will ensure that this page
					cannot be accessed until you have authenticated.
				</p>
				<Table>
					<Table.Header>
						<Table.HeaderCell>Claim</Table.HeaderCell>
						<Table.HeaderCell>Value</Table.HeaderCell>
					</Table.Header>
					<Table.Body>
						{Object.entries(userInfo).map((claimEntry) => {
							const claimName = claimEntry[0];
							const claimValue = claimEntry[1];
							const claimId = `claim-${claimName}`;
							return (
								<Table.Row key={claimName}>
									<Table.Cell>{claimName}</Table.Cell>
									<Table.Cell id={claimId}>{claimValue.toString()}</Table.Cell>
								</Table.Row>
							);
						})}
					</Table.Body>
				</Table>
			</div>
			<Divider />
			<div>
				<Table>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell>Factor</Table.HeaderCell>
							<Table.HeaderCell>Provider</Table.HeaderCell>
							<Table.HeaderCell>Status</Table.HeaderCell>
							<Table.HeaderCell>Required</Table.HeaderCell>
							<Table.HeaderCell />
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{availableFactors.map((factor) => {
							let canEnroll = (factor?.authenticator?.id && factor?.status === 'NOT_SETUP') ?? false,
								enrolledPhones: string[] = [],
								setupText = 'Setup';

							if (factor?._embedded?.phones) {
								const phones = factor._embedded.phones;

								phones.forEach((phone: { id: string; profile: { phoneNumber: string }; status: string }) => {
									const {
										profile: { phoneNumber },
										status,
									} = phone;

									if (status === 'ACTIVE') {
										enrolledPhones.push(`${phoneNumber.substring(0, 2)}******${phoneNumber.substring(8, 12)}`);
									}
								});
							}

							const buildEnrolledPhones = () =>
								enrolledPhones.map((phone) => (
									<Table.Row>
										<Table.Cell>{phone}</Table.Cell>
										<Table.Cell />
										<Table.Cell />
										<Table.Cell />
									</Table.Row>
								));

							let rowSpan = enrolledPhones?.length + 1;

							if (enrolledPhones?.length > 0 && enrolledPhones?.length < 2) {
								canEnroll = true;
								setupText = 'Add Another';
							}

							let row = (
								<Table.Row key={factor?.key}>
									<Table.Cell rowSpan={rowSpan}>{factor?.factorType}</Table.Cell>
									<Table.Cell>{factor?.provider}</Table.Cell>
									<Table.Cell>{factor?.status}</Table.Cell>
									<Table.Cell>{factor?.enrollment}</Table.Cell>
									{canEnroll && (
										<Table.Cell>
											<Button onClick={() => handleSetup(factor?.authenticator?.id)}>{setupText}</Button>
										</Table.Cell>
									)}
								</Table.Row>
							);

							if (enrolledPhones?.length > 0) {
								return (
									<React.Fragment>
										{row}
										{buildEnrolledPhones()}
									</React.Fragment>
								);
							} else return row;
						})}
					</Table.Body>
				</Table>
			</div>
		</div>
	);
};
