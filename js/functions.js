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
			active: 'active'
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
				currentAccordionItem.find(anyAccordionItem).removeClass(modifiers.active);
				return;
			}


			if (self._collapsibleAll){
				var siblingContainers = $(accordionContainer).not(current.closest(accordionContainer));
				siblingContainers.find(collapsibleElement).slideUp(animateSpeed);
				siblingContainers.find(anyAccordionItem).removeClass(modifiers.active);
			}

			currentAccordionItem.siblings().removeClass(modifiers.active).find(collapsibleElement).slideUp(animateSpeed);
			currentAccordionItem.siblings().find(anyAccordionItem).removeClass(modifiers.active);

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
			siteMapCurrent.slideUp().removeClass('active');
			switcher.removeClass('active');
			return;
		}
		siteMapCurrent.slideDown().addClass('active');
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

/** ready/load/resize document **/

$(document).ready(function(){
	placeholderInit();
	dropLanguageInit();
	showFormSearch();
	phonesDrop();
	multiAccordionInit();
	siteMapInit();
	roadPopupInit();
});