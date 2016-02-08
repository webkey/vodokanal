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

/*main navigation*/
(function ($) {
	var MainNavigation = function (settings) {
		var options = $.extend({
			navMenuItem: 'li',
			overlayClass: '.overlay-page',
			overlayBoolean: false,
			animationSpeed: 300
		},settings || {});

		this.options = options;
		var container = $(options.navContainer);
		this.$navContainer = container;
		this.$buttonMenu = $(options.btnMenu);                     // Кнопка открытия/закрытия меню для моб. верси.
		this.$navMenu = $(options.navMenu, container);             // Список с пунктами навигации.
		this.$navMenuItem = $(options.navMenuItem, this.$navMenu); // Пункты навигации.
		this.$navDropMenu = $(options.navDropMenu);                // Дроп-меню всех уровней. Перечислять через запятую.
		this._animateSpeed = options.animationSpeed;

		this._overlayClass = options.overlayClass;                // Класс оверлея.
		this._overlayBoolean = options.overlayBoolean;            // Добавить оверлей (по-умолчанию == false). Если не true, то не будет работать по клику вне навигации.

		this.$getCustomScroll = $(options.getCustomScroll);

		this.modifiers = {
			active: 'active',
			opened: 'nav-opened',
			current: 'made-current'
		};

		this.addOverlayPage();
		this.dropNavigation();
		this.mainNavigationCustomScrollBehavior();
		this.mainNavigation();

		// очистка классов-модификаторов при ресайзе
		var self = this;
		$(window).on('debouncedresize', function () {
			self.clearDropNavigation();
		});
	};

	//добавить <div class="overlay-page"></div>
	MainNavigation.prototype.addOverlayPage = function () {
		var self = this,
				_overlayClass = self._overlayClass;

		if (self._overlayBoolean) {
			var overlayClassSubstring = _overlayClass.substring(1);
			$('.header').after('<div class="' + overlayClassSubstring + '"></div>');
		}
	};

	MainNavigation.prototype.dropNavigation = function () {
		var self = this,
				$buttonMenu = self.$buttonMenu,
				modifiers = self.modifiers,
				_active = modifiers.active,
				_opened = modifiers.opened;

		var $body = $('body');

		$buttonMenu.on('click', function (e) {
			// Если открыта форма поиска, закрываем ее
			var $searchForm = $('.search-form');
			if($searchForm.is(':visible')){
				$searchForm.find('.btn-search-close').trigger('click');
			}

			var currentBtnMenu = $(this);

			// Очищаем аттрибут "style" у всех развернутых дропов.
			// Нельзя использовать .hide или подобные методы,
			// т.к. необходимо, чтоб не было записи инлайновой style="display: none;"
			if (!currentBtnMenu.hasClass(_active)) {
				self.$navDropMenu.attr('style','');
			}

			// Удаляем с пунктов меню всех уровней активный класс
			self.$navMenuItem.removeClass(_active);

			// Переключаем на боди класс открывающий меню. Открытие через CSS3 translate
			$body.toggleClass(_opened);

			// Переключаем на кнопке меню активный класс
			currentBtnMenu.toggleClass(_active);

			e.preventDefault();
		});

		// По клику на область вне меню, закрываем меню
		// .overlay-page
		$body.on('click', self._overlayClass, function () {
			$body.toggleClass(_opened);
			$buttonMenu.toggleClass(_active);
		});
	};

	$.fn.closest_child = function(filter) {
		var $found = $(),
				$currentSet = this; // Current place
		while ($currentSet.length) {
			$found = $currentSet.filter(filter);
			if ($found.length) break;  // At least one match: break loop
			// Get all children of the current set
			$currentSet = $currentSet.children();
		}
		return $found.first(); // Return first match of the collection
	};

	MainNavigation.prototype.mainNavigationCustomScroll = function() {
		this.$getCustomScroll.mCustomScrollbar({
			theme:"minimal-dark",
			scrollbarPosition: "inside",
			autoExpandScrollbar:true,
			scrollInertia: 20
		});
	};

	MainNavigation.prototype.mainNavigationCustomScrollBehavior = function() {
		var self = this,
				$buttonMenu = self.$buttonMenu;

		var $body = $('body'),
				_classInit = 'nav-custom-scroll-initialized',
				_classDestroy = 'nav-custom-scroll-destroy';

		if($buttonMenu.is(':hidden')){
			self.mainNavigationCustomScroll();

			$body.addClass(_classInit);
		} else {
			$body.addClass(_classDestroy);
		}

		if(md.mobile()){
			self.$getCustomScroll.mCustomScrollbar("destroy");
		}

		$(window).on('debouncedresize', function () {
			if($buttonMenu.is(':hidden') && $body.hasClass(_classDestroy)){
				$body.removeClass(_classDestroy);
				$body.addClass(_classInit);

				self.mainNavigationCustomScroll();
				return;
			}

			if($buttonMenu.is(':visible') && $body.hasClass(_classInit)){
				$body.removeClass(_classInit);
				$body.addClass(_classDestroy);

				self.$getCustomScroll.mCustomScrollbar("destroy");
			}
		});
	};

	MainNavigation.prototype.mainNavigation = function() {
		var self = this,
				$btnMenu = self.$buttonMenu,
				$navigationList = self.$navMenu,
				dropDownMenu = self.$navDropMenu,
				modifiers = self.modifiers,
				_active = modifiers.active,
				_current = modifiers.current,
				dur = self._animateSpeed;

		// открываем дроп текущего пункта
		// не цсс, а скриптом, чтобы можно было плавно закрыть дроп
		$('.made-current>.nav-sub-drop').slideDown(0);

		$($navigationList).on('click', 'a', function (e) {
			var $currentLink = $(this);
			var $currentItem = $currentLink.closest(self.$navMenuItem);

			if($btnMenu.is(':visible') && $currentItem.has('ul').length){
				e.preventDefault();
				$currentItem.addClass(_active);

				//добавить кноку "< назад"
				var _templateBackTo = '<div class="nav-back"><i class="depict-angle fa fa-chevron-left"></i><span>Назад</span></div>';
				if($btnMenu.is(':visible')){
					if(!$currentLink.siblings('div').has('.nav-back').length){
						$currentLink.siblings('div').closest_child('ul').before(_templateBackTo);
					}
				}
				return;
			}

			if(!$currentItem.has('ul').length || $currentItem.has('.drop-side').length) { return; }

			var $siblingDrop = $currentItem.siblings('li:not(.has-drop-side)').find(dropDownMenu);
			var $currentItemDrop = $currentItem.find(dropDownMenu);

			e.preventDefault();

			if($currentItem.hasClass(_active) || $currentItem.hasClass(_current)){
				closeDrops($siblingDrop);
				closeDrops($currentItemDrop);
				return;
			}
			closeDrops($siblingDrop);
			closeDrops($currentItemDrop);

			$currentItem.toggleClass(_active);

			$currentItem.children(dropDownMenu).stop().slideDown(dur);
		});

		$($navigationList).on('click', '.nav-back', function () {
			$(this).closest('li').removeClass(_active);
		});

		/*close all drops*/
		function closeDrops(drop) {
			drop.closest('li').removeClass(_active);
			drop.closest('li').removeClass(_current);
			if ($btnMenu.is(':hidden')) {
				drop.slideUp(dur);
			}
		}
	};

	MainNavigation.prototype.clearDropNavigation = function() {
		var self = this,
				$buttonMenu = self.$buttonMenu,
				$navMenuItem = self.$navMenuItem,
				modifiers = self.modifiers,
				_active = modifiers.active,
				_opened = modifiers.opened;

		var $body = $('body');

		if ($buttonMenu.is(':hidden') && $buttonMenu.hasClass(_active)) {
			$body.removeClass(_opened);
			$buttonMenu.removeClass(_active);
			$navMenuItem.removeClass(_active);
		}

		var currentNavSubDrop = $('.made-current>.nav-sub-drop');
		if ($buttonMenu.is(':hidden') && currentNavSubDrop.is(':hidden')) {
			currentNavSubDrop.slideDown(300);
		}

		if (!md.mobile() && $buttonMenu.is(':visible') && $buttonMenu.hasClass(_active)) {
			$body.removeClass(_opened);
			$buttonMenu.removeClass(_active);
			$navMenuItem.removeClass(_active);
		}
	};

	window.MainNavigation = MainNavigation;

}(jQuery));

function mainNavigationInit(){
	var navigationContainer = $('.nav');
	if(!navigationContainer.length){ return; }
	new MainNavigation({
		navContainer: navigationContainer,
		btnMenu: '.btn-menu',
		navMenu: '.nav-list',
		navMenuItem: 'li',
		navDropMenu: '.nav-drop, .nav-sub-drop',
		getCustomScroll: '.panel-frame, .drop-side__holder',
		animationSpeed: 300,

		overlayBoolean: true
	});
}
/*main navigation end*/

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

/*phones popup*/
function phonesPopupInit(){
	var $container = $('.cph__row');
	if(!$container.length){return;}
	$('.cph__number_opener').on('click', function (e) {
		e.preventDefault();
		var $currentOpener = $(this);
		var $currentContainer = $currentOpener.closest('.cph__row');
		if($currentOpener.hasClass('active')){
			closePopup($currentOpener,$currentContainer);
			return;
		}
		closePopup($('.cph__number_opener'),$container);
		$currentOpener.addClass('active');
		$currentContainer.addClass('opened');
		e.stopPropagation();
	});

	$('.cph__numbers').on('click', function (e) {
		e.stopPropagation();
	});

	$(document).on('click', function () {
		closePopup($('.cph__number_opener'), $container);
	});

	function closePopup(opener, container){
		opener.removeClass('active');
		container.removeClass('opened');
	}
}
/*phones popup end*/

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

	/*parents*/
	var parents = $('.parents');
	if(parents.length){
		parents.find('.parents__item a').equalHeight({
			//amount: 12,
			useParent: true,
			parent: parents,
			resize: true
		});
	}
	/*parents end*/
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

(function ($) {
	var SimpleTabs = function (settings) {
		var options = $.extend({
			tabContainer: '.tabs-wrap',
			tabControls: '.tab-controls-list',
			tabControlsItem: 'a',
			tabControlsAnchor: 'a',
			tabs: '.tabs',
			tab: '.tab',
			activeTabIndex: '0',
			animateSpeed: 300
		}, settings || {});

		this.options = options;
		var container = $(options.tabContainer);
		this.$tabContainer = container;
		this.$tabControls = $(options.tabControls, container);
		this.$tabControlsItem = $(options.tabControlsItem, container);
		this.$tabControlsAnchor = $(options.tabControlsAnchor, container);
		this.$tabs = options.tabs;
		this.$tab = options.tab;
		//this.$tab = $(options.tab, container);
		this._activeTabIndex = options.activeTabIndex;
		this._animateSpeed = options.animateSpeed;

		this.modifiers = {
			active: 'tab-active',
			opened: 'tab-opened',
			current: 'tab-current'
		};

		this.wrappers = {
			tabs: 'tab-item-wrap',
			tab: 'tab-item'
		};

		this.bindEvents();
		this.beforeStart();
	};

	SimpleTabs.prototype.beforeStart = function () {
		var self = this;
		var _activeTabIndex = self._activeTabIndex;
		var _modifiersActive = self.modifiers.active;

		$(document).ready(function () {
			self.$tabControlsItem.eq(_activeTabIndex).addClass(_modifiersActive);

			for (var i = 0; i < self.$tabs.length; i++) {
				var $tabs = $(self.$tabs[i]);
				$tabs.wrapInner('<div class="'+self.wrappers.tabs+'" />');
				$tabs.find('.tab-item-wrap').css({
					'height': $(self.$tab[i]).eq(_activeTabIndex).outerHeight(),
					'position': 'relative'
				});

				var $tab = $(self.$tab[i]);
				//var maxHeight = Math.max.apply(Math,$tab.map(function(){return $(this).outerHeight();}).get());

				$tab.wrap('<div class="'+self.wrappers.tab+'" />');
				var $tabWrap = $tab.closest('.tab-item');
				$tabWrap.css({
					'position': 'absolute',
					'width': '100%',
					'left': 0,
					'top': 0,
					'opacity': 0,
					'z-index': 998,
					'transform': 'translateZ(0px)'
				});

				$tabWrap.eq(_activeTabIndex).css({
					'opacity': 1,
					'z-index': 999
				}).addClass(_modifiersActive);
			}
		});
	};

	SimpleTabs.prototype.bindEvents = function () {
		var self = this,
				_modifiersActive = this.modifiers.active;

		self.$tabControlsAnchor.on('click', function (e) {
			e.preventDefault();
			var currentTabControlsItem = $(this).closest(self.$tabControlsItem);
			if (currentTabControlsItem.hasClass(_modifiersActive)) {
				e.preventDefault();
				return;
			}

			self.$tabControlsItem.removeClass(_modifiersActive);
			currentTabControlsItem.addClass(_modifiersActive);

			var _currentTabItem = currentTabControlsItem.index();


			for(var i = 0; i < self.$tabs.length; i++) {
				var $tabs = $(self.$tabs[i]).find('.'+self.wrappers.tabs+'');
				var $tab = $(self.$tab[i]).closest('.'+self.wrappers.tab+'');

				$tab.removeClass(_modifiersActive);
				$tab.eq(_currentTabItem).addClass(_modifiersActive);


				$tab.css({
					'z-index': 998, 'opacity': 0
				});
				$tab.eq(_currentTabItem).css({
					'z-index': 999, 'opacity': 1
				});

				$tabs.animate({
					'height': $tab.eq(_currentTabItem).outerHeight()
				}, self._animateSpeed);
			}
		})
	};

	window.SimpleTabs = SimpleTabs;
}(jQuery));

function simpleTabInit() {
	if($('.contacts').length){
		new SimpleTabs({
			tabContainer: '.contacts',
			tabControlsItem: '.contacts__biz li',
			tabs: [
				'.contacts__address',
				'.contacts-share-container',
				'.contacts-phones-container'
			],
			tab: [
				'.contacts-adr',
				'.contacts-share',
				'.contacts-phones'
			],
			animateSpeed: 300
		});
	}
}
/*simple tabs end*/

/*simple accordion*/
(function ($) {
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
}(jQuery));

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

(function ($) {
	var HistorySlider = function (settings) {
		var options = $.extend({
			mainWrapper: '.history',
			sliderContainer: '.history-slider',
			sliderInner: '.history-sldr__holder',
			slide: '.history-sldr__item',
			info: null,
			infoBox: '.history-info',

			arrowPrev: '.history-sldr__prev-btn',
			arrowNext: '.history-sldr__next-btn',

			asNavFor: null,

			padding: 40,
			normWidth: 80,
			zoomWidth: 250,
			activeSlide: 0,
			animateSpeed: 200
		}, settings || {});

		var _ = this;

		_.options = options;
		var mainWrapper = $(options.mainWrapper)
		_.$mainWrapper = mainWrapper;
		var container = $(options.sliderContainer);
		_.$sliderContainer = container;
		_.$sliderInner = $(options.sliderInner, container);
		_.$slide = $(options.slide, container);
		_.$info = $(options.info, container);
		_.$infoBox = $(options.infoBox, mainWrapper);

		_.$arrowPrev = $(options.arrowPrev, container);
		_.$arrowNext = $(options.arrowNext, container);

		_.$asNavFor = $(options.asNavFor);

		//console.log(this.$asNavFor);
		_._padding = options.padding;
		_._normWidth = options.normWidth;
		_._zoomWidth = options.zoomWidth;
		_._activeSlide = options.activeSlide;
		_._animateSpeed = options.animateSpeed;

		_.slideClases = {
			slideClass: 'history-slide',
			track: 'slider-track'
		};

		_.modifiers = {
			current: 'slide-current',
			btnHidden: 'btn-hidden'
		};

		_.beforeStart();
		_.disabledArrows(_.$slide.eq(_._activeSlide));
		_.bindEvents();

		$('body').prepend('<div id="console"></div>');
	};

	HistorySlider.prototype.beforeStart = function () {
		var self = this,
			$slide = self.$slide;

		$slide.addClass(self.slideClases.slideClass);

		var $activeSlide = $slide.eq(self._activeSlide);

		$activeSlide.css('width',self._zoomWidth);

		var sumWidth = 0;
		for(var i = 0; i < $slide.length; i++){
			sumWidth += $slide.eq(i).outerWidth();
		}
		self.$sliderInner.addClass(self.slideClases.track).css({
			'width': sumWidth
		});

		$activeSlide.addClass(self.modifiers.current);
		self.indexSlide($activeSlide);
		self.setInfo($activeSlide);
	};

	HistorySlider.prototype.disabledArrows = function (slide) {
		var self = this;
		if(self.$sliderInner.outerWidth() <= self.$sliderContainer.outerWidth()){
			var modifiersBtnHidden = self.modifiers.btnHidden;
			self.$arrowPrev.addClass(modifiersBtnHidden);
			self.$arrowNext.addClass(modifiersBtnHidden);
		}

		self.$sliderContainer.removeClass('left-stop');
		self.$sliderContainer.removeClass('right-stop');

		var slidePrevWidth = slide.prev(),
			slideNextWidth = slide.next();
		if(slidePrevWidth.length == 0){
			self.$sliderContainer.addClass('left-stop');
		}
		if(slideNextWidth.length == 0){
			self.$sliderContainer.addClass('right-stop');
		}
	};

	HistorySlider.prototype.currentSlide = function ($currentSlide) {
		var self = this,
			_modifiersCurrent = this.modifiers.current;

		if($currentSlide.hasClass(_modifiersCurrent)){ return; }

		self.$slide.removeClass(_modifiersCurrent).css({
			'width': self._normWidth
		});

		$currentSlide.addClass(_modifiersCurrent).css({
			'width': self._zoomWidth
		});

		self.scrollToCurrentSlide($currentSlide.index());
		self.disabledArrows($currentSlide);

		self.indexSlide($currentSlide);
		self.setInfo($currentSlide);
		self.asNavForSlide($currentSlide);
	};

	HistorySlider.prototype.scrollToCurrentSlide = function (index) {
		var self = this;
		var slideWidth = self.$slide.eq(index).outerWidth(),
			slideNextWidth = self.$slide.eq(index).next().outerWidth(),
			slidePrevWidth = self.$slide.eq(index).prev().outerWidth(),
			slideLeftOffset = self.$slide.eq(index).offset().left,
			containerWidth = self.$sliderContainer.outerWidth(),
			containerLeftOffset = self.$sliderContainer.offset().left,
			slideLeftPosition = slideLeftOffset - containerLeftOffset,

			minPaddingLeft = self._padding,
			minPaddingRight = slideWidth + self._padding,

			rightEdge = containerWidth - minPaddingRight,
			innerWidth = self.$sliderInner.outerWidth(),
			innerLeftOffset = self.$sliderInner.offset().left,
			innerLeftPosition = innerLeftOffset - containerLeftOffset,
			innerLeftModule = Math.sqrt(Math.pow(innerLeftPosition,2)),
			innerMaxLeftOffset = innerWidth - containerWidth,
			scrollOffset = 0;


		//self.getLog('scrollOffset',scrollOffset);
		//self.getLog('--slide','***');
		//self.getLog('index',index);
		//self.getLog('slideWidth',slideWidth);
		//self.getLog('slideLeftOffset',slideLeftOffset);
		//self.getLog('slideLeftPosition',slideLeftPosition);
		//self.getLog('slideNextWidth',slideNextWidth,'#808080');
		//self.getLog('slidePrevWidth',slidePrevWidth,'#808080');
		//self.getLog('--container','***');
		//self.getLog('containerWidth',containerWidth);
		//self.getLog('containerLeftOffset',containerLeftOffset);
		//self.getLog('a','------');
		//self.getLog('rightEdge',rightEdge,'#333');
		//self.getLog('innerWidth',innerWidth,'#333');
		//self.getLog('innerLeftOffset',innerLeftOffset,'#333');
		//self.getLog('innerLeftPosition',innerLeftPosition,'#333');
		//self.getLog('innerLeftModule',innerLeftModule,'#333');
		//self.getLog('innerMaxLeftOffset',innerMaxLeftOffset,'#333');
		//self.getLog('b','------');
		//self.getLog('minPaddingLeft',minPaddingLeft);
		//self.getLog('minPaddingRight',minPaddingRight);
		//self.getLog('c','------');

		if(slideLeftPosition < minPaddingLeft && innerLeftModule !== 0){
			//console.log(0);
			slidePrevWidth = slidePrevWidth == null ? 0 : slidePrevWidth;
			if(innerLeftModule > slidePrevWidth && slidePrevWidth > 0){
				//console.log(2);
				scrollOffset = innerLeftModule - slidePrevWidth;
			} else {
				//console.log(3);
				scrollOffset = 0;
			}

			//self.getLog('scrollOffset',scrollOffset, 'lightblue');
			self.$sliderInner.css('left', -scrollOffset);
			return;
		}

		if(slideLeftPosition < rightEdge || innerLeftModule == innerMaxLeftOffset){
			//console.log(1);
			//self.getLog('scrollOffset',scrollOffset, 'green');

			return;
		}

		slideNextWidth = slideNextWidth == null ? 0 : slideNextWidth;
		if(
				slideNextWidth > innerMaxLeftOffset - innerLeftModule
				|| slideNextWidth == 0
		){
			//console.log(4);
			scrollOffset = innerMaxLeftOffset;

			//self.getLog('scrollOffset',scrollOffset,'lightred');
		} else {
			//console.log(5);
			scrollOffset = innerLeftModule + slideNextWidth;

			//self.getLog('scrollOffset',scrollOffset,'red');
		}

		self.$sliderInner.css('left', -scrollOffset);
	};

	HistorySlider.prototype.bindEvents = function () {
		var self = this,
			_modifiersCurrent = this.modifiers.current;

		self.$slide.on('click', function () {
			self.currentSlide($(this));
		});

		self.$arrowPrev.on('click', function(){
			var currentSlide = self.$sliderContainer.find('.'+_modifiersCurrent+'').prev();

			if(!currentSlide.length){ return; }

			self.currentSlide(currentSlide);
		});

		self.$arrowNext.on('click', function(){
			var currentSlide = self.$sliderContainer.find('.'+_modifiersCurrent+'').next();

			if(!currentSlide.length){ return; }

			self.currentSlide(currentSlide);
		})
	};

	HistorySlider.prototype.indexSlide = function (currentSlide) {
		var self = this;
		var $slide = self.$slide;

		$slide.removeClass('after-position').css({
			'z-index':0,
			'opacity':1
		});

		var lastCount = 0;
		for(var i = currentSlide.index()+1; i < $slide.length; i++){
			lastCount = $slide.length - currentSlide.index();

			currentSlide.css('z-index', $slide.length);
			$slide.eq(i).addClass('after-position').css('z-index', $slide.length - i);

			var opacityStep = 1/lastCount;
			console.log(opacityStep);
			$slide.eq(i).css('opacity',opacityStep - i * opacityStep);
		}
	};

	HistorySlider.prototype.asNavForSlide = function (currentSlide) {
		var self = this;
		if (self.$asNavFor.length) {
			var triggerSlide = self.$asNavFor.find('.' + self.slideClases.slideClass + '').eq(currentSlide.index());

			if (triggerSlide.hasClass(self.modifiers.current)) {
				return;
			}

			triggerSlide.trigger('click');
		}
	};

	HistorySlider.prototype.setInfo = function (currentSlide) {
		var self = this;
		if (self.$info.length){
			var cloneInfo = currentSlide.find(self.$info).contents().clone();

			self.$infoBox.find('.info-new:not(.info-old)').addClass('info-old');
			self.$infoBox.children().append('<div class="info-new"></div>');
			cloneInfo.appendTo(self.$infoBox.find('.info-new:not(.info-old)')).parent().css('opacity',0);

			setTimeout(function () {
				cloneInfo.parent().animate({'opacity':1});
				self.$infoBox.children().animate({'height': self.$infoBox.find('.info-new:not(.info-old)').outerHeight()});
			}, self._animateSpeed);

			self.$infoBox.find('.info-old').animate({'opacity':0}, 200, function () {
				$(this).remove();
			});
		}
	};

	/*for view date log*/
	HistorySlider.prototype.getLog = function (_class,log,color) {
		var tpl = '<div />';
		var $console = $('#console');
		var tplLog = '<b>' + _class + ': ' + '</b>' + log;
		if($console.has('.'+_class).length){
			$console.find('.'+_class).html(tplLog).css('color',color);
			return;
		}
		$(tpl).appendTo('#console').addClass(_class).html(tplLog).css('color',color);
	};
	/*for view date log end*/

	window.HistorySlider = HistorySlider;
}(jQuery));

function historySliderInit() {
	if($('.history-slider').length){
		new HistorySlider({
			sliderContainer: '.history-slider',
			info: '.history-sldr__info',
			asNavFor: '.years-slider',
			activeSlide: 5
		});
		new HistorySlider({
			sliderContainer: '.years-slider',
			sliderInner: '.years-sldr__holder',
			slide: '.years-sldr__item',
			asNavFor: '.history-slider'
		});
	}
}

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
	phonesPopupInit();
	cardSwitch();
	contactsSwitcher();
	slickSlidersInit();
	mapMainInit();
	tabsInit();
	simpleTabInit();
	accordionInit();
	historySliderInit();
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