$(document).on('ready', function () {
	var $body = $('body');

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
			$('body').hide(); // hide content

			toggleSpecialVersion();

			location.reload(); // reload page
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
	// toggleSpecialVersion();
	function toggleSpecialVersion() {

		var $specialCssLink = $('#special-css-link');
		var path = cssPath || 'css/';

		console.log("$specialCssLink.length: ", $specialCssLink.length);

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

	/**
	 * !settings
	 * */
	$body.on('click', '.vimg-btn-js', function (e) {
		e.preventDefault();
		var $curBtn = $(this);
		$curBtn.toggleClass('active');
		if($curBtn.hasClass('active')) {
			$curBtn.attr('title', $curBtn.attr('data-title-on'));
		} else {
			$curBtn.attr('title', $curBtn.attr('data-title-off'));
		}
		$body.toggleClass('imageson');
	});

	// size

	$body.on('click', '.vsize-btn-sm-js', function (e) {
		e.preventDefault();
		var $curBtn = $(this);
		if(!$curBtn.hasClass('active')) {
			$curBtn.closest('.vbtn-group-js').find('.vsize-btn').removeClass('active');
			$curBtn.addClass('active');
			$body.removeClass('fontsize-normal');
			$body.removeClass('fontsize-large');
			$body.addClass('fontsize-small');
		}
	});

	$body.on('click', '.vsize-btn-md-js', function (e) {
		e.preventDefault();
		var $curBtn = $(this);
		if(!$curBtn.hasClass('active')) {
			$curBtn.closest('.vbtn-group-js').find('.vsize-btn').removeClass('active');
			$curBtn.addClass('active');
			$body.removeClass('fontsize-small');
			$body.removeClass('fontsize-large');
			$body.addClass('fontsize-normal');
		}
	});

	$body.on('click', '.vsize-btn-lg-js', function (e) {
		e.preventDefault();
		var $curBtn = $(this);
		if(!$curBtn.hasClass('active')) {
			$curBtn.closest('.vbtn-group-js').find('.vsize-btn').removeClass('active');
			$curBtn.addClass('active');
			$body.removeClass('fontsize-normal');
			$body.removeClass('fontsize-small');
			$body.addClass('fontsize-large');
		}
	});

	// color

	$body.on('click', '.vcolor-btn-black-js', function (e) {
		e.preventDefault();
		var $curBtn = $(this);
		if(!$curBtn.hasClass('active')) {
			$curBtn.closest('.vbtn-group-js').find('.vcolor-btn').removeClass('active');
			$curBtn.addClass('active');
			$body.removeClass('schemecolor-white');
			$body.removeClass('schemecolor-blue');
			$body.addClass('schemecolor-black');
		}
	});

	$body.on('click', '.vcolor-btn-white-js', function (e) {
		e.preventDefault();
		var $curBtn = $(this);
		if(!$curBtn.hasClass('active')) {
			$curBtn.closest('.vbtn-group-js').find('.vcolor-btn').removeClass('active');
			$curBtn.addClass('active');
			$body.removeClass('schemecolor-black');
			$body.removeClass('schemecolor-blue');
			$body.addClass('schemecolor-white');
		}
	});

	$body.on('click', '.vcolor-btn-blue-js', function (e) {
		e.preventDefault();
		var $curBtn = $(this);
		if(!$curBtn.hasClass('active')) {
			$curBtn.closest('.vbtn-group-js').find('.vcolor-btn').removeClass('active');
			$curBtn.addClass('active');
			$body.removeClass('schemecolor-black');
			$body.removeClass('schemecolor-white');
			$body.addClass('schemecolor-blue');
		}
	});
});