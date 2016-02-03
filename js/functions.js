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
		$phonesDrop.css('width',$phonesContainer.outerWidth()/3)
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
(function ($) {
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
}(jQuery));

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
(function ($) {
	var Disperse = function (settings) {
		var options = $.extend({
			wrapperContainer: 'body',
			footer: '.footer',
			animateSpeed: 300
		}, settings || {});

		this.options = options;
		var container = $(options.wrapperContainer);
		this.$wrapperContainer = container;
		this.$switcher = $(options.switcher, container);
		this.$footer = $(options.footer);
		this.$disperseWrapper = $(options.disperseWrapper, container);
		this.$disperseDrop = $(options.disperseDrop, container);
		this._disperseHeight = this.$disperseDrop.outerHeight();

		this._animateSpeed = options.animateSpeed;

		this.modifiers = {
			active: 'active',
			drop: 'disperseDropJs'
		};

		this.bindAnimate();
	};

	Disperse.prototype.bindAnimate = function () {
		var self = this,
				_modifiersActive = this.modifiers.active,
				_modifiersDrop = this.modifiers.drop,
				_animateSpeed = this._animateSpeed,
				$disperseWrapper = self.$disperseWrapper;

		self.$switcher.on('click', function (e) {
			e.preventDefault();
			var $switcher = $(this);

			var _height = self._disperseHeight;

			if($switcher.hasClass(_modifiersActive)){
				$disperseWrapper.animate({'height':0},_animateSpeed).removeClass(''+_modifiersActive+' '+_modifiersDrop+'');
				self.footerAtBottom(-(_height));

				$switcher.removeClass(_modifiersActive);
				return;
			}

			$disperseWrapper.animate({'height':_height},_animateSpeed).addClass(''+_modifiersActive+' '+_modifiersDrop+'');
			self.footerAtBottom(_height);

			$switcher.addClass(_modifiersActive);
			$('html, body').animate({ scrollTop: $disperseWrapper.offset().top }, _animateSpeed);
		})
	};

	Disperse.prototype.footerAtBottom = function (height) {
		var self = this;

		self.$footer.animate({
			'margin-top': '-='+height+''
		}, self._animateSpeed);

		$('.spacer').animate({
			'height': '+='+height+''
		}, self._animateSpeed);
	};

	window.Disperse = Disperse;
}(jQuery));

function footerDropInit() {
	if($('.footer-site-map').length){
		new Disperse({
			switcher: '.map-site-switcher',
			wrapperContainer: '.footer',
			disperseWrapper: '.footer-site-map',
			disperseDrop: '.site-map',
			animateSpeed: 400
		});
	}
	if($('.footer-map-row').length){
		new Disperse({
			switcher: '.road-view',
			wrapperContainer: '.footer',
			disperseWrapper: '.footer-map-row',
			disperseDrop: '.footer-local-map',
			animateSpeed: 400
		});
	}
}

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

	$('.contacts-panel__switcher').on('click', function () {
		var $switcher = $(this);
		var $itemCardCurrent = $switcher.closest($contacts);
		if($itemCardCurrent.hasClass('contacts-panel_opened')){
			$itemCardCurrent.removeClass('contacts-panel_opened');
			return;
		}

		$itemCardCurrent.addClass('contacts-panel_opened');
	})
}
/*contacts switcher end*/

/*equal height initial*/
function equalHeightInit(){
	/*case list*/
	var caseList = $('.case__list');
	if(caseList.length){
		/*caseList.find('.case__item').equalHeight({
			amount: 4,
			//useParent: true,
			//parent: caseList,
			resize: true
		});
		caseList.find('.case__photo-card, .case__contacts-card').equalHeight({
			amount: 8,
			//useParent: true,
			//parent: caseList,
			resize: true
		});*/
		caseList.find('.photo-card__img, .contacts-card__caption').equalHeight({
			amount: 8,
			//useParent: true,
			//parent: caseList,
			resize: true
		});
		caseList.find('.photo-card__name, .contacts-card__share, .contacts-card__name').equalHeight({
			amount: 12,
			//useParent: true,
			//parent: caseList,
			resize: true
		});
		caseList.find('.photo-card__post, .contacts-card__post, .contacts-card__works').equalHeight({
			amount: 12,
			//useParent: true,
			//parent: caseList,
			resize: true
		});
	}
	/*case list end*/
}
/*equal height initial end*/

/*equal height initial*/
function equelHeightInTabs(){
	/*previews list*/
	var previewsList = $('.previews__list');
	if(previewsList.length){
		previewsList.find('.previews__title').equalHeight({
			//amount: 12,
			useParent: true,
			parent: previewsList,
			resize: true
		});
		previewsList.find('.previews__text').equalHeight({
			//amount: 12,
			useParent: true,
			parent: previewsList,
			resize: true
		});
	}
	/*previews list end*/
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
var smallPinMap = 'img/map-pin-sm.png',
	largePinMap = 'img/map-pin.png';

var localObjects = [
	[
		{lat: 53.8984, lng: 27.5788}, //coordinates of marker
		{latBias: 0.0020, lngBias: 0}, //bias coordinates for center map
		largePinMap, //image pin
		7,
		{
			title: 'Минскводоканал',
			address: '<b>Адрес:</b> 220088 Беларусь, Минск, ул. Пулихова д.15',
			phone: '<b>Приёмная:</b> <div>+375 17 327 37 04</div> <div>+375 17 327 37 04</div>',
			works: '<b>Эл. почта:</b> <div><span>Пн-Пт:</span> 10<sup>00</sup> – 20<sup>00</sup></div> <div><span>Сб-Вс:</span> 10<sup>00</sup> – 18<sup>00</sup></div>'
		}
	],[
		{lat: 52.799394, lng: 27.558581},
		{latBias: 0.1, lngBias: -2.5},
		smallPinMap,
		7,
		{
			title: 'Филиал "Завод горно-шахтного оборудования"',
			address: '<b>Адрес:</b> Республика Беларусь, Метявичское шоссе 5/3, 223710 Солигорский р-н, Минская обл.',
			phone: '<b>Главный технолог:</b> +375 174 21 20 59',
			works: '<b>Эл. почта:</b> <a href="mailto:zgsho@niva.by">zgsho@niva.by</a>'
		}
	]
];

var styleMap = [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]}];

function mapMainInit(){
	if (!$('[id*="-map"]').length) {return;}

	function mapCenter(index){
		var localObject = localObjects[index];

		return{
			lat: localObject[0].lat + localObject[1].latBias,
			lng: localObject[0].lng + localObject[1].lngBias
		};
	}

	var mapOptions = {
		zoom: 15,
		center: mapCenter(0),
		styles: styleMap,
		mapTypeControl: false,
		scaleControl: false,
		scrollwheel: false
	};

	var markers = [],
		elementById = [
		document.getElementById('main-map'),
		document.getElementById('footer-main-map'),
		document.getElementById('contacts-map')
	];
	if($(elementById[0]).length){
		var map = new google.maps.Map(elementById[0], mapOptions);
		addMarker(0,map);
	}
	if($(elementById[1]).length){
		var map2 = new google.maps.Map(elementById[1], mapOptions);
		addMarker(0,map2);
	}
	if($(elementById[2]).length){
		var map3 = new google.maps.Map(elementById[2], mapOptions);
		addMarker(0,map3);
	}

	$('.location-link>a').click( function(e) {
		var index = $(this).data('location');
		deleteMarkers();
		moveToLocation(index,map);
		addMarker(index);
		e.preventDefault();
	});

	function moveToLocation(index, map){
		var object = localObjects[index];
		var center = new google.maps.LatLng(mapCenter(index));
		map.panTo(center);
		map.setZoom(object[3]);
	}

	function addMarker(index,map) {
		var object = localObjects[index];
		var marker = new google.maps.Marker({
			position: object[0],
			//animation: google.maps.Animation.DROP,
			map: map,
			icon: object[2],
			title: object[4].title
		});
		markers.push(marker);

		var infoWindow = new google.maps.InfoWindow({
			content: '<div class="map-popup">' +
			'<h4>'+object[4].title+'</h4>' +
			'<div class="map-popup__list">' +
				'<div class="map-popup__row">'+object[4].address+'</div>' +
				'<div class="map-popup__row">'+object[4].phone+'</div>' +
				'<div class="map-popup__row">'+object[4].works+'</div>' +
			'</div>' +
			'</div>',
			maxWidth: 220
		});

		marker.addListener('click', function() {
			infoWindow.open(map, marker);
		});
	}

	function setMapOnAll(map) {
		for (var i = 0; i < markers.length; i++) {
			markers[i].setMap(map);
		}
	}

	function deleteMarkers() {
		setMapOnAll(null);
		//markers = [];
	}
}
/*map init end*/

/*ui tabs initial*/
function uiTabsInit(){
	var $tabs = $('.tabs-js');
	if($tabs.length){
		$tabs.tabs({
			//animate: 'easeInOutQuint',
			activate: function() {
				/*previews list*/
				if($('.previews__list').length){
					equelHeightInTabs();
				}
				/*previews list end*/
			}
		});
	}
}
/*ui tabs initial end*/

/*simple tabs*/
function tabsInit() {
	var tabWrap = $('.tabs-wrap');
	if (!tabWrap) { return; }

	/*скрыть неактивные табы*/
	tabWrap.each(function () {
		var thisTabWrap = $(this);
		var activeControlIndex = thisTabWrap.first('.tab-controls-list').find('li.active').index();
		var tab = thisTabWrap.children('.tabs').children('.tab');
		tab.fadeOut(0).eq(activeControlIndex).fadeIn(0).addClass('tab-active');
	});

	/*по клику скрываем все табы и показываем активный*/
	$('.tab-controls-list').on('click', 'a', function (e) {
		var current = $(this);
		/*если таб активный, функиця клика отменяется*/
		if (current.parent('li').hasClass('active')) {
			e.preventDefault();
			return;
		}

		var index = current.parent().index();
		current.closest('li').addClass('active').siblings().removeClass('active');
		var tab = current.closest('.tabs-wrap').children('.tabs').children('.tab');
		tab.fadeOut(0).removeClass('tab-active');
		var currentTab = tab.eq(index);
		currentTab.fadeIn(0).addClass('tab-active');

		e.preventDefault();
	});
}
/*simple tabs end*/

/*simple accordion*/
(function () {
	var SimpleAccordion = function (settings) {
		var options = $.extend({
			accordionHeader: 'h3',
			active: '0',
			animateSpeed: 300
		}, settings || {});

		this.options = options;
		var container = $(options.accordionContainer);
		this.$accordionContainer = container;
		this.$accordionHeader = $(options.accordionHeader, container);
		this.$accordionBody = $(this.$accordionHeader.next('div'));
		this._active = options.active;
		this._animateSpeed = options.animateSpeed;

		this.modifiers = {
			active: 'active',
			current: 'current'
		};

		this.bindEvents();
		this.beforeStart();
	};

	SimpleAccordion.prototype.beforeStart = function () {
		var self = this,
				_modifiersActive = 	self.modifiers.active,
				_indexActive = self._active;
		self.$accordionBody.eq(_indexActive).slideDown(0).addClass(_modifiersActive);
		self.$accordionHeader.eq(_indexActive).addClass(_modifiersActive);
	};

	SimpleAccordion.prototype.bindEvents = function () {
		var self = this,
				_modifiersActive = this.modifiers.active,
				animateSpeed = this._animateSpeed,
				accordionBody = this.$accordionBody;

		self.$accordionHeader.on('click', function (e) {
			e.preventDefault();
			var current = $(this);
			if(current.hasClass(_modifiersActive)){
				current.next('div').slideUp(animateSpeed).removeClass(_modifiersActive);
				current.removeClass(_modifiersActive);
				return;
			}
			accordionBody.slideUp(animateSpeed).removeClass(_modifiersActive);
			self.$accordionHeader.removeClass(_modifiersActive);
			current.next('div').slideDown(animateSpeed).addClass(_modifiersActive);
			current.addClass(_modifiersActive);
		})
	};

	window.SimpleAccordion = SimpleAccordion;
}());

function accordionInit() {
	if($('.faq-list').length){
		new SimpleAccordion({
			accordionContainer: '.faq-list',
			animateSpeed: 200
		});
	}
}
/*simple accordion end*/

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
	footerDropInit();
	//siteMapInit();
	//roadPopupInit();
	cardSwitch();
	contactsSwitcher();
	slickSlidersInit();
	mapMainInit();
	tabsInit();
	accordionInit();
});

$(window).load(function () {
	equalHeightInit();
	equelHeightInTabs();
	footerBottom();
	uiTabsInit();
});

$(window).resize(function(){
	footerBottom();
});