# Okta React + Okta Hosted Login Example (Typescript)

This example shows you how to use the [Okta React Library][] and [React Router](https://github.com/ReactTraining/react-router) to login a user to a React application.  The login is achieved with the [Okta Sign In Widget][], which gives you more control to customize the login experience within your app.

This example is built with [Create React App][] and modified for Typescript.

## Prerequisites

Before running this sample, you will need the following:

* An Okta Developer Account, you can sign up for one at https://developer.okta.com/signup/.
* An Okta Application, configured for Single-Page App (SPA) mode. This is done from the Okta Developer Console, you can see the [OIDC SPA Setup Instructions][].  When following the wizard, use the default properties.  They are are designed to work with our sample applications.
* A custom domain.

## Running This Example

### Gather Variables

You will need to gather the following information from the Okta Developer Console:

| Variable | |
| --- | --- |
| `REACT_APP_CLIENT_ID` | The client ID of the SPA application that you created earlier. This can be found on the "General" tab of an application, or the list of applications.  This identifies the application that tokens will be minted for. |
| `REACT_APP_OKTA_URL` | This is the URL of the authorization server that will perform authentication.  All Developer Accounts have a "default" authorization server.  The issuer is a combination of your Org URL (found in the upper right of the console home page) and `/oauth2/default`. For example, `https://dev-1234.oktapreview.com/oauth2/default`. |

These values must exist as environment variables. They can be exported in the shell, or saved in a file named `.env`, at the root of this repository. See [dotenv](https://www.npmjs.com/package/dotenv) for more details on this file format.

If opting to deploy via Vercel, you will be prompted to enter these values after clicking the button.

```ini
REACT_APP_OKTA_URL=https://yourOktaDomain.com/oauth2/default
REACT_APP_CLIENT_ID=123xxxxx123
REACT_APP_MESSAGES_URL=https://{{messages-app-url}}/api/messages
PORT=8080
```

___
### Option 1 - Deploy to Vercel
For the easiest option, [sign up](https://vercel.com/signup) for a free Vercel account and click the following button.

When prompted, enter the appropriate environmental variables.

* _For the `CI` variable, enter `false`._
* _See [here](https://vercel.com/docs/get-started) for more details on how to use Vercel._

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Featplaysleep%2Fokta-react-typescript%2Ftree%2Fs&env=REACT_APP_OKTA_AUTH_SERVER_ID,REACT_APP_OKTA_CLIENT_ID,REACT_APP_OKTA_URL,CI&demo-title=Okta%20React%20Typescript&demo-description=Sample%20React%20Typescript%20project%20showcasing%20Okta%20AuthN%20%26%20AuthZ&demo-url=https%3A%2F%2Fsubway-app.atko.rocks)

___
### Option 2
To run this application, you first need to clone this repo:

```bash
git clone https://github.com/eatplaysleep/okta-react-typescript.git
```

Then install dependencies:

```bash
npm install
```

With variables set, start the app server:

```bash
npm start
```

Now navigate to http://localhost:8080 in your browser.

___

If you see a home page that prompts you to login, then things are working!  Clicking the **Log in** button will render a custom login page component that uses the Okta Sign-In Widget to perform authentication.

You can login with the same account that you created when signing up for your Developer Org, or you can use a known username and password from your Okta Directory.

**Note:** If you are currently using your Developer Console, you already have a Single Sign-On (SSO) session for your Org.  You will be automatically logged into your application as the same user that is using the Developer Console.  You may want to use an incognito tab to test the flow from a blank slate.

## Integrating The Resource Server

If you were able to successfully login in the previous section you can continue with the resource server example.  Please download and run one of these sample applications in another terminal.

* [Vercel Node/Express Resource Server Example](https://github.com/eatplaysleep/okta-demo-messages) <- Recommended
* [Node/Express Resource Server Example](https://github.com/okta/samples-nodejs-express-4/tree/master/resource-server)
* [Java/Spring MVC Resource Server Example](https://github.com/okta/samples-java-spring/tree/master/resource-server)
* [ASP.NET](https://github.com/okta/samples-aspnet/tree/master/resource-server) and [ASP.NET Core](https://github.com/okta/samples-aspnetcore/tree/master/samples-aspnetcore-3x/resource-server) Resource Server Examples

Once you have the resource server running (it will run on port 8000) you can visit the `/messages` page within the React application to see the authentication flow.  The React application will use its stored access token to authenticate itself with the resource server, you will see this as the `Authorization: Bearer <access_token>` header on the request if you inspect the network traffic in the browser.

[Create React App]: https://create-react-app.dev
[Okta React Library]: https://github.com/okta/okta-react
[OIDC SPA Setup Instructions]: https://developer.okta.com/docs/guides/sign-into-spa/react/before-you-begin
[PKCE Flow]: https://developer.okta.com/docs/guides/implement-auth-code-pkce
[Okta Sign In Widget]: https://github.com/okta/okta-signin-widget
