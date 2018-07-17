$(document).on('ready', function () {
	var $body = $('body'),
		cssId = '#special-css-link',
		$specialCssLink = $(cssId),
		path = cssPath || 'css/',
		cookies = {
			'specVersionOn': 'special-version',
			'specVersionMods': 'special-mods'
		},
		elem = {
			'btnCheck': '.sv-btn-check-js', // if check modifier
			'btnGroup': '.vbtn-group-js'
		},
		mod = {
			'hidePage': 'hide-page',
			'specOn': 'vspec',
			'btnActive': 'active', // active class of the buttons
			'imagesOn': 'imageson', // show images on page
			'sizeSm': 'fontsize-small',
			'sizeNorm': 'fontsize-normal',
			'sizeLg': 'fontsize-large',
			'colorBlack': 'schemecolor-black',
			'colorWhite': 'schemecolor-white',
			'colorBlue': 'schemecolor-blue'
		};

	/**
	 * !cookie
	 * */
	function setCookie(name, value, options) {
		// https://learn.javascript.ru/cookie
		options = options || {};

		var expires = options.expires;

		if (typeof expires === "number" && expires) {
			var d = new Date();
			d.setTime(d.getTime() + expires * 1000);
			expires = options.expires = d;
		}
		if (expires && expires.toUTCString) {
			options.expires = expires.toUTCString();
		}

		value = encodeURIComponent(value);

		var updatedCookie = name + "=" + value;

		for (var propName in options) {
			updatedCookie += "; " + propName;
			var propValue = options[propName];
			if (propValue !== true) {
				updatedCookie += "=" + propValue;
			}
		}

		document.cookie = updatedCookie;
	}

	function getCookie(name) {
		// https://learn.javascript.ru/cookie
		var matches = document.cookie.match(new RegExp(
			"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
		));
		return matches ? decodeURIComponent(matches[1]) : undefined;
	}

	function setCookieMod (name, val) {
		setCookie(name, val, {
			// expires: expiresValue,
			// domain: "minskvodokanal.by",
			path: "/"
		});
	}
	/*cookie end*/

	/**
	 * !include special css and add special class on a body
	 */
	if (getCookie(cookies.specVersionOn) === 'true' && !$(cssId).length) {
		$('<link/>', {
			id: cssId.substr(1),
			rel: 'stylesheet',
			href: path + 'special.css'
		}).appendTo('head');

		$body.addClass(mod.specOn);
	}

	/**
	 * !add special modifiers class
	 * */
	var cookieMods = getCookie(cookies.specVersionMods);
	if (cookieMods) {
		$body.addClass(cookieMods.replace(/, /g, ' '));
		$(elem.btnCheck).removeClass(mod.btnActive);

		var cookieModsArr = cookieMods.split(', ');
		for(var i = 0; i < cookieModsArr.length; i++){
			// console.log(cookieModsArr[i]);
			$('[data-mod=' + cookieModsArr[i] + ']').addClass(mod.btnActive);
		}
	}

	/**
	 * !switch special version
	 * */
	$('.special-version-toggle-js').on('click', function (e) {
		e.preventDefault();
		$('body').addClass(mod.hidePage); // first hide content
		// toggle special version cookie
		if(getCookie(cookies.specVersionOn) === 'true'){
			setCookieMod(cookies.specVersionOn, "false");
		} else {
			setCookieMod(cookies.specVersionOn, "true");
		}
		location.reload(); // reload page
	});
	/*switch special version end*/

	/**
	 * !change settings
	 * */
	$body.on('click', '.vimg-btn-js', function (e) {
		e.preventDefault();
		var $curBtn = $(this);
		$curBtn.toggleClass(mod.btnActive);
		if($curBtn.hasClass(mod.btnActive)) {
			$curBtn.attr('title', $curBtn.attr('data-title-on'));
		} else {
			$curBtn.attr('title', $curBtn.attr('data-title-off'));
		}
		$body.toggleClass(mod.imagesOn);
	});

	// size

	$body.on('click', elem.btnCheck, function (e) {
		e.preventDefault();
		var $curBtn = $(this);

		if(!$curBtn.hasClass(mod.btnActive)) {
			var $curGroup = $curBtn.closest(elem.btnGroup),
				modsArr = [],
				_curMod = $curBtn.attr('data-mod');

			// create mods array
			$.each($curGroup.find(elem.btnCheck), function (i, el) {
				modsArr.push($(el).attr('data-mod'));
			});

			// toggle active class on buttons
			$curGroup.find(elem.btnCheck).removeClass(mod.btnActive);
			$curBtn.addClass(mod.btnActive);

			// toggle modifiers class on a body
			$body.removeClass(modsArr.join(' '));
			$body.addClass(_curMod);

			// toggle a cookies
			// for(var i = 0; i < modsArr.length; i++){
			// 	setCookieMod(modsArr[i], 'false');
			// }
			// setCookieMod(_curMod, 'true');

			var curCookieMods = getCookie(cookies.specVersionMods);
			// console.log("getCookie(cookies.specVersionOn): ", curCookieMods);
			var curCookieModsArr = curCookieMods ? curCookieMods.split(', ') : [];
			// var newModsArr = [];
			// console.log("curCookieModsArr: ", curCookieModsArr);
			for(var i = 0; i < modsArr.length; i++){
				// console.log("modsArr[i]: ", modsArr[i]);
				for(var j = 0; j < curCookieModsArr.length; j++){
					// console.log("curCookieModsArr[j]: ", curCookieModsArr[j]);
					if(modsArr[i] === curCookieModsArr[j]) {
						// console.log("curCookieModsArr[j]: ", curCookieModsArr[j]);
						// newModsArr.push(curCookieModsArr[j]);
						// break outer;
						// console.log("j: ", j);
						curCookieModsArr.splice(j, 1);
					}
				}
			}
			curCookieModsArr.push(_curMod);
			// console.log("curCookieModsArr: ", curCookieModsArr);
			setCookieMod(cookies.specVersionMods, curCookieModsArr.join(', '));
		}
	});

});