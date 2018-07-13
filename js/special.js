$(document).on('ready', function () {
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
	/*cookie end*/

	/**
	 * !switch special version
	 * */
	function switchSpecialVersion() {
		$('.special-version-toggle-js').on('click', function (e) {
			e.preventDefault();
			// $('body').hide(); // hide content

			toggleSpecialVersion();

			// location.reload(); // reload page
		});
	}
	switchSpecialVersion();
	/*switch special version end*/

	/**
	 * !check special version cookie
	 */
	function checkSpecialVersionCookie() {
		if (getCookie('specialVersion') === 'true' && !$('#special-css-link').length) {
			toggleSpecialVersion();
		}
	}
	checkSpecialVersionCookie();
	/*check special version cookie end*/

	/**
	 * !toggle special version
	 * */
	toggleSpecialVersion();
	function toggleSpecialVersion() {

		var $specialCssLink = $('#special-css-link');
		var $body = $('body');
		var path = cssPath || 'css/';

		// console.log("$specialCssLink.length: ", $specialCssLink.length);

		if ($specialCssLink.length) {

			$specialCssLink.remove();

			setCookie('specialVersion', false, {
				// expires: expiresValue,
				// domain: "minskvodokanal.by",
				path: "/"
			});

			$body.removeClass('vspec');
			// $body.removeClass('color-scheme-bw');
			// $body.removeClass('images-bw');

			$(document).trigger('specialVersionOff');

		} else {
			setCookie('specialVersion', true, {
				// expires: expiresValue,
				// domain: "minskvodokanal.by",
				path: "/"
			});

			$('<link/>', {
				id: 'special-css-link',
				rel: 'stylesheet',
				href: path + 'special.css'
			}).appendTo('head');

			$body.addClass('vspec');
			// $body.addClass('color-scheme-bw');
			// $body.addClass('images-bw');

			$(document).trigger('specialVersionOn');
		}
	}
	/*toggle special version end*/
});