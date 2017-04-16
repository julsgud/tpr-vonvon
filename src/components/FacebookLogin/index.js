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

const flatten = (o) => {
	let result = Object.create(o);
	for (let key in result) {
		result[key] = result[key];
	}
	return result;
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
		scope: 'public_profile, user_photos',
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
		return window.FB.api('/me', {fields: this.props.fields}, (me) => {
			Object.assign(me, authResponse);
			return this.props.infoCallback(me);
		});
	};

	getAlbums(authResponse) {
		let albumId;

		return window.FB.api('/me/albums', (response) => {
			response.data.forEach((a) => {
				if (a.name === "Profile Pictures") {
					albumId = a.id;
				};
			});
			return this.getProfilePictureAlbum(albumId);
		});
	}

	getProfilePictureAlbum(id) {
		let images = [];

		return window.FB.api('/' + id + '/photos', (response) => {
			response.data.forEach((i) => {
				images.push(i.id);
			});
			return this.props.imageCallback(images);
		});
	}

	getProfilePictures(images) {
		let collection = {};
		let coll;
		let fields = 'images';
		let counter = 0;

		return images.forEach((i) => {
			window.FB.api('/' + i + '?fields=' + fields, (response) => {
				collection['image-'+counter.toString()] = response;
				console.log(response.images);
				console.log(collection['image-'+counter]);
				counter++; 
			});
		});
		let o = flatten(collection);
		console.log(collection);
		console.log(collection['0']);
		console.log(collection[0]);
		console.log(Object.getOwnPropertyNames(collection));

		console.log(o);
		console.log(o['0']);
		console.log(o[0]);
		console.log(Object.getOwnPropertyNames(o));
		return this.props.imageCallback(collection);
	}

	checkLoginState = (response) => {
		this.setStateIfMounted({isProcessing: false});
		if (response.authResponse) {
			this.getInfo(response.authResponse);
			this.getAlbums(response.authResponse);
		} else {
			console.log({status: response.status});
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