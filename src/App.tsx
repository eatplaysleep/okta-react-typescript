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

import { useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { Security, SecureRoute } from '@okta/okta-react';
import { Container } from 'semantic-ui-react';
import { CorsErrorModal, NavBar } from './components';
import { authConfig, routes } from './config';
import './styles/App.css';

const oktaAuth = new OktaAuth(authConfig.oidc);

// oktaAuth.start();

const App = () => {
	const history = useHistory(); // example from react-router

	const restoreOriginalUri = async (
		_oktaAuth: OktaAuth,
		originalUri: string
	) => {
		history.replace(toRelativeUrl(originalUri || '/', window.location.origin));
	};
	console.log(routes);
	const [corsErrorModalOpen, setCorsErrorModalOpen] = useState<boolean>(false);
	return (
		<Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>
			<NavBar {...{ setCorsErrorModalOpen }} />
			<CorsErrorModal {...{ corsErrorModalOpen, setCorsErrorModalOpen }} />
			<Container text style={{ marginTop: '7em' }}>
				<div>
					<Switch>
						{routes.map(route => {
							if (route?.isSecure) {
								return (
									<SecureRoute
										key={route.path}
										path={route.path}
										exact={route?.isExact ?? false}
										component={route.component}
									/>
								);
							} else {
								return (
									<Route
										key={route.path}
										path={route.path}
										exact={route?.isExact ?? false}
										component={route.component}
									/>
								);
							}
						})}
					</Switch>
				</div>
			</Container>
		</Security>
	);
};

export default App;
