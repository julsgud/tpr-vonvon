import React, {PropTypes} from 'react';

const getIsMobile = () => {
	let isMobile = false;

	try {
		isMobile = ((window.navigator && window.navigator.standalone) || navigator.userAgent.match('CriOs') || navigator.userAgent.match('/mobile/i'));
	} catch (ex) {
		// continue
	}

	return isMobile;
}

class FacebookLogin extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isSdkLoaded: false,
			isProcessing: false
		};
	}

	static defaultProps = {
		appId: '1418273384901709',
		autoLoad: 'false',
		textButton: 'Continua con Facebook',
		typeButton: 'button',
		redirectUri: typeof window !== 'undefined' ? window.location.href : '/',
		scope: 'public_profile',
		xfbml: false,
		cookie: false,
		reAuthenticate: false,
		size: 'metro',
		fields: 'name',
		version: '2.8',
		language: 'en_US',
		disableMobileRedirect: false,
		isMobile: getIsMobile(),
		tag: 'button',
	};

	static state = {
		isSdkLoaded: false,
		isProcessing: false,
	};

	componentDidMount() {
		if (document.getElementById('facebook-jssdk')) {
			this.sdkLoaded();
			return;
		}
		this.setFbAsyncInit();
		this.loadSdkAsynchronously();
		let fbRoot = document.getElementById('fb-root');
		if(!fbRoot) {
			fbRoot = document.createElement('div');
			fbRoot.id = 'fb-root';
			document.body.appendChild(fbRoot);
		}
		this._isMounted = true;
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	setStateIfMounted(state) {
		if (this._isMounted) {
			this.setState(state);
		}
	}

	setFbAsyncInit() {
		const {appId, xbfml, cookie, version, autoLoad} = this.props;
		window.fbAsyncInit = () => {
			window.FB.init({
				version: `v${version}`,
				appId
			});
			this.setStateIfMounted({isSdkLoaded: true});
			if (autoLoad || window.location.search.includes('facebookdirect')) {
				// window.FB.getLoginStatus(this.checkLoginAfterRefresh);
			}
		};
	}

	sdkLoaded() {
		this.setState({isSdkLoaded: true});
	}

	loadSdkAsynchronously() {
		const { language } = this.props;

	    ((d, s, id) => {
	      const element = d.getElementsByTagName(s)[0];
	      const fjs = element;
	      let js = element;
	      if (d.getElementById(id)) { return; }
	      js = d.createElement(s); js.id = id;
	      js.src = `//connect.facebook.net/${language}/all.js`;
	      fjs.parentNode.insertBefore(js, fjs);
	    })(document, 'script', 'facebook-jssdk');
	}

	getInfo = (authResponse) => {
		window.FB.api('/me', {fields: this.props.fields}, (me) => {
			Object.assign(me, authResponse);
			this.props.infoCallback(me);
		});
	};

	getLargeProfilePicture(authResponse) {
		window.FB.api('/me/picture?type=large', (response) => {
			this.props.imageCallback(response);
		});
	}

	checkLoginState = (response) => {
		this.setStateIfMounted({isProcessing: false});
		if (response.authResponse) {
			this.getInfo(response.authResponse);
			this.getLargeProfilePicture(response.authResponse);
		} else {
			callback({status: response.status});
		}
	};

	checkLoginAfterRefresh = (response) => {
		if (response.status === 'connected') {
			this.checkLoginState(response);
		} else {
			window.FB.login(loginResponse => this.checkLoginState(loginResponse), true);
		}
	};

	click = () => {
		if (!this.state.isSdkLoaded || this.state.isProcessing || this.props.isDisabled) {
			return;
		}

		this.setState({isProcessing: true});
		const {scope, appId, onClick, reAuthenticate, redirectUri, disableMobileRedirect} = this.props;

		if (typeof onClick === 'function') {
			onClick();
		}

		const params = {
			client_id: appId,
			redirect_uri: redirectUri,
			state: 'facebookdirect',
			scope,
		}

		if (reAuthenticate) {
			params.auth_type = 'reauthenticate';
		}

		if (this.props.isMobile && !disableMobileRedirect) {
			window.location.href = `//www.facebook.com/dialog/oauth?${objectToParams(params)}`;
		} else {
			window.FB.login(this.checkLoginState, {scope, auth_type: params.auth_type});
		}
	};

	render() {
		const {typeButton, textButton} = this.props;

		return (
			<this.props.tag type={typeButton} onClick={this.click}>
				{textButton}
			</this.props.tag>
		)
	}
}

FacebookLogin.propTypes = {
	picHandler: React.PropTypes.func
}

export default FacebookLogin;