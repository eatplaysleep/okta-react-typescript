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

import { LoginCallback } from '@okta/okta-react';
import { Home, Profile } from '../components';

type Route = {
	path: string;
	isSecure?: boolean;
	isExact?: boolean;
	component: any;
};

export const routes: Route[] = [
	{
		path: '/login/callback',
		component: LoginCallback,
		isExact: true,
	},
	{
		path: '/profile',
		component: Profile,
		isSecure: true,
		isExact: true,
	},
	{
		path: '/*',
		component: Home,
	},
];
