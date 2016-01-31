/* placeholder */
function placeholderInit(){
	$('[placeholder]').placeholder();
}
/* placeholder end */

/*drop language*/
var closeDropLong = function () {
	$('.lang').removeClass('lang-opened');
};
function dropLanguageInit() {
	var $langList = $('.lang-list');
	if(!$langList.length){return;}

	$('.lang-active').on('click', function (e) {
		e.preventDefault();
		$(this).closest('.lang').toggleClass('lang-opened');
		e.stopPropagation();
	});

	$langList.on('click', function (e) {
		e.stopPropagation();
	});

	$(document).on('click', function () {
		closeDropLong();
	})
}
/*drop language end*/

/*show form search */
function showFormSearch(){
	var searchForm = $('.search-form__header');
	if(!searchForm.length){ return; }

	var $body = $('body');
	$body.on('click', '.btn-search-open', function(){
		var $currentBtnOpen = $(this);
		var $currentWrap = $currentBtnOpen.closest('.header-options');
		var $searchFormContainer = $currentWrap.find('.search-form__header');

		var $searchForm = $searchFormContainer.find('form');
		if ( $searchForm.find('input:not(:submit)').val().length && $searchFormContainer.is(':visible') ){
			$searchForm.submit();
			return;
		}

		if ($currentWrap.hasClass('form-opened')){
			closeSearchForm($searchFormContainer,$('.header-options'));
			return;
		}

		$currentWrap.addClass('form-opened');
		$searchFormContainer.find('input[type="search"], input[type="text"]').trigger('focus');
	});

	$body.on('click', '.js-btn-search-close', function(){
		var $searchFormContainer = $(this).closest('.search-form__header');
		$searchFormContainer.find('input:not(:submit)').val('');

		closeSearchForm($searchFormContainer,$('.header-options'));
	});

	function closeSearchForm(form, wrapper){
		form.closest(wrapper).removeClass('form-opened')
	}
}
/*show form search end*/

/*phones drop*/
function phonesDrop(){
	var $phonesContainer = $('.phones');
	if(!$phonesContainer.length){return;}

	var animateSpeed = 200;
	$phonesContainer.on('click', '.phones__opener', function (e) {
		e.preventDefault();

		var $phonesOpener = $(this),
			$phonesDrop = $phonesOpener.closest($phonesContainer).find('.phones-drop');

		if($phonesContainer.hasClass('show-drop')){
			closeDropPhones();
			return;
		}
		$phonesContainer.addClass('show-drop');
		$phonesDrop.css('width',$phonesContainer.outerWidth())
			.fadeIn(animateSpeed);

		e.stopPropagation();
	});

	$('.phones-drop').on('click', function (e) {
		e.stopPropagation();
	});

	$(document).on('click', function () {
		closeDropPhones();
	});

	function closeDropPhones(){
		$phonesContainer.removeClass('show-drop');
		$('.phones-drop').fadeOut(animateSpeed);
	}
}
/*phones drop end*/

/*multi accordion*/
(function () {
	var MultiAccordion = function (settings) {
		var options = $.extend({
			collapsibleAll: false,
			animateSpeed: 300,
			resizeCollapsible: false
		}, settings || {});

		this.options = options;
		var container = $(options.accordionContainer);
		this.$accordionContainer = container; //блок с аккордеоном
		this.$accordionItem = $(options.accordionItem, container); //непосредственный родитель сворачиваемого элемента
		this.$accordionEvent = $(options.accordionEvent, container); //элемент, по которому производим клик
		this.$collapsibleElement = $(options.collapsibleElement); //элемент, который сворачивается/разворачивается
		this._collapsibleAll = options.collapsibleAll;
		this._animateSpeed = options.animateSpeed;
		this.$totalCollapsible = $(options.totalCollapsible);//элемент, по клику на который сворачиваются все аккордены в наборе
		this._resizeCollapsible = options.resizeCollapsible;//флаг, сворачивание всех открытых аккордеонов при ресайзе

		this.modifiers = {
			active: 'active',
			current: 'current'
		};

		this.bindEvents();
		this.totalCollapsible();
		this.totalCollapsibleOnResize();

	};

	MultiAccordion.prototype.totalCollapsible = function () {
		var self = this;
		self.$totalCollapsible.on('click', function () {
			self.$collapsibleElement.slideUp(self._animateSpeed);
			self.$accordionItem.removeClass(self.modifiers.active);
			self.$accordionItem.removeClass(self.modifiers.current);
		})
	};

	MultiAccordion.prototype.totalCollapsibleOnResize = function () {
		var self = this;
		$(window).on('resize', function () {
			if(self._resizeCollapsible){
				self.$collapsibleElement.slideUp(self._animateSpeed);
				self.$accordionItem.removeClass(self.modifiers.active);
			}
		});
	};

	MultiAccordion.prototype.bindEvents = function () {
		var self = this,
				modifiers = this.modifiers,
				animateSpeed = this._animateSpeed,
				accordionContainer = this.$accordionContainer,
				anyAccordionItem = this.$accordionItem,
				collapsibleElement = this.$collapsibleElement;

		self.$accordionEvent.on('click', function (e) {
			var current = $(this);
			var currentAccordionItem = current.closest(anyAccordionItem);

			if (!currentAccordionItem.has(collapsibleElement).length){
				return;
			}

			e.preventDefault();

			if (current.parent().prop("tagName") != currentAccordionItem.prop("tagName")) {
				current = current.parent();
			}

			if (current.siblings(collapsibleElement).is(':visible')){
				currentAccordionItem.removeClass(modifiers.active).find(collapsibleElement).slideUp(animateSpeed);
				currentAccordionItem.removeClass(modifiers.current);
				currentAccordionItem.find(anyAccordionItem).removeClass(modifiers.active).removeClass(modifiers.current);
				return;
			}


			if (self._collapsibleAll){
				var siblingContainers = $(accordionContainer).not(current.closest(accordionContainer));
				siblingContainers.find(collapsibleElement).slideUp(animateSpeed);
				siblingContainers.find(anyAccordionItem).removeClass(modifiers.active).removeClass(modifiers.current);
			}

			currentAccordionItem.siblings().removeClass(modifiers.active).find(collapsibleElement).slideUp(animateSpeed);
			currentAccordionItem.siblings().removeClass(modifiers.current);
			currentAccordionItem.siblings().find(anyAccordionItem).removeClass(modifiers.active).removeClass(modifiers.current);

			currentAccordionItem.addClass(modifiers.active);
			current.siblings(collapsibleElement).slideDown(animateSpeed);
		})
	};

	window.MultiAccordion = MultiAccordion;
}());

function multiAccordionInit() {
	if($('.nav__list').length){
		new MultiAccordion({
			accordionContainer: '.nav__list',
			accordionItem: 'li',
			accordionEvent: 'a',
			collapsibleElement: '.nav-drop, .nav-sub-drop',
			animateSpeed: 200
		});
	}
}
/*multi accordion end*/

/*site map*/
function siteMapInit(){
	var siteMap = $('.site-map');
	if (!siteMap.length){ return; }
	$('.map-site-switcher').on('click', function () {
		var switcher = $(this);
		var siteMapCurrent = switcher.closest('.footer').find('.site-map');
		if(siteMapCurrent.is(':visible')){
			siteMapCurrent.slideUp(400, function () {
				footerBottom();
			}).removeClass('active');
			switcher.removeClass('active');
			return;
		}
		siteMapCurrent.slideDown(400, function () {
			footerBottom();
		}).addClass('active');
		switcher.addClass('active');
	})
}
/*site map end*/

/*road popup*/
function roadPopupInit(){
	var $roadBox = $('.road');
	if(!$roadBox.length){return;}
	$('.road-view').on('click', function (e) {
		e.preventDefault();
		var $roadBoxCurrent = $(this).closest('.road');
		if($roadBoxCurrent.find('.road-popup').is(':visible')){
			closeRoadPopup($roadBoxCurrent);
			return;
		}
		$roadBoxCurrent.addClass('show-popup');
		e.stopPropagation();
	});

	$('.road-popup').on('click', function (e) {
		e.stopPropagation();
	});

	$(document).on('click', function () {
		closeRoadPopup($roadBox);
	});

	function closeRoadPopup(wrapper){
		wrapper.removeClass('show-popup');
	}
}
/*road popup end*/

/*card switch*/
function cardSwitch(){
	var $caseList = $('.case__list');
	if(!$caseList.length){return;}

	$('.card-switcher-js').on('click', function () {
		var $switcher = $(this);
		var $itemCard = $switcher.closest('.case__item').siblings();
		$itemCard.removeClass('contacts-opened');

		var $itemCardCurrent = $switcher.closest('.case__item');
		if($itemCardCurrent.hasClass('contacts-opened')){
			$itemCardCurrent.removeClass('contacts-opened');
			return;
		}

		$itemCardCurrent.addClass('contacts-opened');
	})
}
/*card switch end*/

/*contacts switcher*/
function contactsSwitcher(){
	var $contacts = $('.main-contacts');
	if(!$contacts.length){return;}

	$('.contacts-switcher').on('click', function () {
		var $switcher = $(this);
		var $itemCardCurrent = $switcher.closest($contacts);
		if($itemCardCurrent.hasClass('contacts-opened')){
			$itemCardCurrent.removeClass('contacts-opened');
			return;
		}

		$itemCardCurrent.addClass('contacts-opened');
	})
}
/*contacts switcher end*/

/*equal height initial*/
function equalHeightInit(){
	var parentsList = $('.case__list');
	if(parentsList.length){
		/*parentsList.find('.case__item').equalHeight({
			amount: 4,
			//useParent: true,
			//parent: parentsList,
			resize: true
		});
		parentsList.find('.case__photo-card, .case__contacts-card').equalHeight({
			amount: 8,
			//useParent: true,
			//parent: parentsList,
			resize: true
		});*/
		parentsList.find('.photo-card__img, .contacts-card__caption').equalHeight({
			amount: 8,
			//useParent: true,
			//parent: parentsList,
			resize: true
		});
		parentsList.find('.photo-card__name, .contacts-card__share, .contacts-card__name').equalHeight({
			amount: 12,
			//useParent: true,
			//parent: parentsList,
			resize: true
		});
		parentsList.find('.photo-card__post, .contacts-card__post, .contacts-card__works').equalHeight({
			amount: 12,
			//useParent: true,
			//parent: parentsList,
			resize: true
		});
	}
}
/*equal height initial end*/

/*slick sliders init*/
function slickSlidersInit(){
	/*glance slider*/
	var sliderDepartments = $('.glance__slider');
	if(sliderDepartments.length){
		sliderDepartments.on('init', function () {
			$(this).css({'visibility':'visible'});
		});
		sliderDepartments.slick({
			slidesToShow: 4,
			slidesToScroll: 1,
			speed: 200,
			infinite: false,
			dots: false,
			arrows: true,
			responsive: [{
				breakpoint: 1279,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 1
				}
			},{
				breakpoint: 1039,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1
				}
			}]
		});
	}
	/*glance slider end*/

	/*questions slider*/
	var sliderQuestions = $('.questions-slider');
	if(sliderQuestions.length){
		sliderQuestions.on('init', function () {
			$(this).css({'visibility':'visible'});
		});
		sliderQuestions.slick({
			slidesToShow: 4,
			slidesToScroll: 1,
			speed: 200,
			infinite: true,
			dots: false,
			arrows: true,
			responsive: [{
				breakpoint: 960,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 1
				}
			},{
				breakpoint: 640,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1
				}
			}]
		});
	}
	/*questions slider end*/

	/*promo slider*/
	var sliderPromo = $('.promo-slider');
	if(sliderPromo.length){
		sliderPromo.on('init', function () {
			$(this).css({'visibility':'visible'});
		});
		sliderPromo.slick({
			fade: true,
			slidesToShow: 1,
			slidesToScroll: 1,
			speed: 500,
			infinite: true,
			dots: true,
			arrows: true
		});
	}
	/*promo slider end*/

	/*uncos slider*/
	var $uncosSlider = $('.uncos-slider');
	if($uncosSlider.length){
		$uncosSlider.on('init', function (event, slick) {
			if (slick.currentSlide == 0) {
				$(this).css({'visibility':'visible'});
				slick.$prevArrow.addClass('made-arrow-disabled');
			}
		});
		$uncosSlider.slick({
			slidesToShow: 3,
			slidesToScroll: 1,
			infinite: true,
			speed: 200,
			dots: true,
			arrows: true,
			responsive: [{
				breakpoint: 960,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1
				}
			},{
				breakpoint: 640,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				}
			}]
		}).on('afterChange', function (event, slick, currentSlide) {
			var slidesLength = slick.$slides.length;
			var $prevArrow = slick.$prevArrow;
			var $nextArrow = slick.$nextArrow;
			if(currentSlide > 0 && currentSlide < slidesLength - 1){
				$prevArrow.removeClass('made-arrow-disabled');
				$nextArrow.removeClass('made-arrow-disabled');
				return;
			}
			if(currentSlide == 0){
				$prevArrow.addClass('made-arrow-disabled');
				return;
			}
			if(currentSlide == slidesLength - 1){
				$nextArrow.addClass('made-arrow-disabled');
			}
		});
	}
	/*uncos slider end*/
}
/*slick sliders init end*/

/*map init*/
var styleMap = [
	{
		"featureType": "water",
		"elementType": "geometry.fill",
		"stylers": [
			{ "color": "#46bcec" },
			//{ saturation: 0 },
			//{ lightness: 0 },
			//{ gamma: 1.51 }
		]
	},{
		"featureType": "transit",
		"stylers": [
			{ "color": "#808080" },
			{ "visibility": "off" }
		]
	},{
		"featureType": "road.highway",
		"elementType": "geometry.stroke",
		"stylers": [
			{ "visibility": "on" },
			{ "color": "#b4c2d3" }
		]
	},{
		"featureType": "road.highway",
		"elementType": "geometry.fill",
		"stylers": [
			{ "color": "#ffffff" }
		]
	},{
		"featureType": "road.local",
		"elementType": "geometry.fill",
		"stylers": [
			{ "visibility": "on" },
			{ "color": "#ffffff" },
			{ "weight": 1.8 }
		]
	},{
		"featureType": "poi",
		"elementType": "geometry.fill",
		"stylers": [
			{ "visibility": "on" },
			{ "color": "#ebebeb" }
		]
	},{
		"featureType": "administrative",
		"elementType": "geometry",
		"stylers": [
			{ "color": "#0059A5" }
		]
	},{
		"featureType": "road.arterial",
		"elementType": "geometry.fill",
		"stylers": [
			{ "color": "#ffffff" }
		]
	},{
		"featureType": "landscape",
		"elementType": "geometry.fill",
		"stylers": [
			{ "visibility": "on" },
			{ "color": "#f5f5f5" }
		]
	},{
		"featureType": "road",
		"elementType": "labels.text.fill",
		"stylers": [
			{ "color": "#696969" }
		]
	},{
		"featureType": "administrative",
		"elementType": "labels.text.fill",
		"stylers": [
			{ "visibility": "on" },
			{ "color": "#414141" }
		]
	},{
		"featureType": "poi",
		"elementType": "labels.icon",
		"stylers": [
			{ "visibility": "off" }
		]
	},{
		"featureType": "poi",
		"elementType": "labels",
		"stylers": [
			{ "visibility": "off" }
		]
	},{
		"featureType": "road.arterial",
		"elementType": "geometry.stroke",
		"stylers": [
			{ "color": "#d6d6d6" }
		]
	},{
		"featureType": "road",
		"elementType": "labels.icon",
		"stylers": [
			{ "visibility": "off" }
		]
	},{
	},{
		"featureType": "poi",
		"elementType": "geometry.fill",
		"stylers": [
			{ "color": "#f2f2f2" }
		]
	}
];

function mapMainInit(){
	if (!$('#main-map').length) {return;}

	google.maps.event.addDomListener(window, 'load', init);
	var map,
			centerMapL = "53.9004",
			centerMapR = "27.5788";

	if($(window).width() < 640) {
		centerMapL = "53.9004";
		centerMapR = "27.5788";
	}

	function init() {
		var mapOptions = {
			center: new google.maps.LatLng(centerMapL, centerMapR),
			zoom: 15,
			zoomControl: true,
			zoomControlOptions: {
				style: google.maps.ZoomControlStyle.DEFAULT
			},
			disableDoubleClickZoom: true,
			mapTypeControl: false,
			scaleControl: false,
			scrollwheel: false,
			panControl: true,
			streetViewControl: false,
			draggable : true,
			overviewMapControl: true,
			overviewMapControlOptions: {
				opened: false
			},
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			styles: styleMap
		};
		var mapElement = document.getElementById('main-map');
		var map = new google.maps.Map(mapElement, mapOptions);
		var locations = [
			['ул. Пулихова д.15', '220088 Беларусь, Минск', 'undefined', 'undefined', 'undefined', 53.8984, 27.5788, 'img/map-pin.png']
		];
		for (i = 0; i < locations.length; i++) {
			if (locations[i][1] =='undefined'){ description ='';} else { description = locations[i][1];}
			if (locations[i][2] =='undefined'){ telephone ='';} else { telephone = locations[i][2];}
			if (locations[i][3] =='undefined'){ email ='';} else { email = locations[i][3];}
			if (locations[i][4] =='undefined'){ web ='';} else { web = locations[i][4];}
			if (locations[i][7] =='undefined'){ markericon ='';} else { markericon = locations[i][7];}
			marker = new google.maps.Marker({
				icon: markericon,
				position: new google.maps.LatLng(locations[i][5], locations[i][6]),
				map: map,
				title: locations[i][0],
				desc: description,
				tel: telephone,
				email: email,
				web: web
			});
			link = '';            bindInfoWindow(marker, map, locations[i][0], description, telephone, email, web, link);
		}
		function bindInfoWindow(marker, map, title, desc, telephone, email, web, link) {
			var infoWindowVisible = (function () {
				var currentlyVisible = false;
				return function (visible) {
					if (visible !== undefined) {
						currentlyVisible = visible;
					}
					return currentlyVisible;
				};
			}());
			iw = new google.maps.InfoWindow();
			google.maps.event.addListener(marker, 'click', function() {
				if (infoWindowVisible()) {
					iw.close();
					infoWindowVisible(false);
				} else {
					var html= "<div style='color:#000;background-color:#fff;padding:5px;width:150px;'><h4>"+title+"</h4><p>"+desc+"<p></div>";
					iw = new google.maps.InfoWindow({content:html});
					iw.open(map,marker);
					infoWindowVisible(true);
				}
			});
			google.maps.event.addListener(iw, 'closeclick', function () {
				infoWindowVisible(false);
			});
		}
	}
}
/*map init end*/

/*ui tabs initial*/
function tabsInit(){
	var $tabs = $('.tabs-js');
	if(!$tabs.length){return;}

	$tabs.tabs({
		//animate: 'easeInOutQuint'
	});
}
/*ui tabs initial end*/

/* footer at bottom */
function footerBottom(){
	var footer = $('.footer');
	var footerOuterHeight = footer.outerHeight();
	footer.css({
		'margin-top': -footerOuterHeight
	});
	$('.spacer').css({
		'height': footerOuterHeight
	});
}
/* footer at bottom end */

/**!
 * ready/load/resize document
 */

$(document).ready(function(){
	placeholderInit();
	dropLanguageInit();
	showFormSearch();
	phonesDrop();
	multiAccordionInit();
	siteMapInit();
	roadPopupInit();
	cardSwitch();
	contactsSwitcher();
	slickSlidersInit();
	mapMainInit();
	tabsInit();
});

$(window).load(function () {
	equalHeightInit();
	footerBottom();
	tabsInit();
});

$(window).resize(function(){
	footerBottom();
});