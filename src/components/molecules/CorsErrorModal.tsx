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

import * as React from 'react';
import { Modal } from 'semantic-ui-react';
import { authConfig } from '../../config';

export const CorsErrorModal = ({
	corsErrorModalOpen,
	setCorsErrorModalOpen,
}: {
	corsErrorModalOpen: boolean;
	setCorsErrorModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	// Build URL to "Trusted Origins" page in Admin panel
	const { issuer } = authConfig.oidc;
	const baseUrl: string = issuer.split('/oauth2')[0];
	const hostParts: string[] = new URL(baseUrl).host.split('.');
	hostParts[0] += '-admin';
	const adminHost: string = hostParts.join('.');
	const corsAdminUrl: string = `https://${adminHost}/admin/access/api/trusted_origins`;

	// URL to guide for enabling CORS
	const guideUrl: string =
		'https://developer.okta.com/docs/guides/enable-cors/granting-cors/';

	// CORS error modal
	return (
		<Modal
			onClose={() => setCorsErrorModalOpen(false)}
			open={corsErrorModalOpen}
			closeIcon
		>
			<Modal.Header>Network Error</Modal.Header>
			<Modal.Content>
				<Modal.Description>
					<p>Seems like logout API call resulted with CORS error.</p>
					<p>
						You may need to add your origin {window.location.origin} to list of
						trusted origins in your{' '}
						<a href={corsAdminUrl} target='_blank' rel='noreferrer'>
							Okta Administrator Dashboard
						</a>
					</p>
					<p>
						Read{' '}
						<a href={guideUrl} target='_blank' rel='noreferrer'>
							this guide
						</a>{' '}
						for more info.
					</p>
				</Modal.Description>
			</Modal.Content>
		</Modal>
	);
};
