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
import { useOktaAuth } from '@okta/okta-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Icon, Image, Menu } from 'semantic-ui-react';

type CorsError = {
	name?: string;
	errorCode?: string | number;
	xhr?: {
		message?: string;
	};
};

export const NavBar = ({
	setCorsErrorModalOpen,
}: {
	setCorsErrorModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const { authState, oktaAuth } = useOktaAuth() || {};

	// Note: Can't distinguish CORS error from other network errors
	const isCorsError = (error: CorsError) =>
		error?.name === 'AuthApiError' &&
		!error?.errorCode &&
		error.xhr?.message === 'Failed to fetch';

	const login = async () => oktaAuth.signInWithRedirect();

	const logout = async () => {
		try {
			await oktaAuth.signOut();
		} catch (error) {
			if (isCorsError(error as CorsError)) {
				setCorsErrorModalOpen(true);
			} else {
				throw error;
			}
		}
	};

	if (!authState) {
		return null;
	}

	return (
		<div>
			<Menu fixed='top' inverted>
				<Container>
					<Menu.Item header>
						<Image size='mini' src='/react.svg' />
						&nbsp;
						<Link to='/'>Okta-React Sample Project</Link>
					</Menu.Item>
					{authState?.isAuthenticated && (
						<Menu.Item id='profile-button'>
							<Link to='/profile'>Profile</Link>
						</Menu.Item>
					)}
					{authState?.isAuthenticated && (
						<Menu.Item id='logout-button' onClick={logout}>
							Logout
						</Menu.Item>
					)}
					{!authState?.isPending && !authState?.isAuthenticated && (
						<Menu.Item onClick={login}>Login</Menu.Item>
					)}
				</Container>
			</Menu>
		</div>
	);
};
