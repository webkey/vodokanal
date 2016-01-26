/* placeholder */
function placeholderInit(){
	$('[placeholder]').placeholder();
}
/* placeholder end */

//function addClass(){
//	var $tbl = $('.tbl');
//	if($tbl.length){
//		$tbl.find('tr:even').addClass('nth-child-even');
//		$tbl.find('tr:odd').addClass('nth-child-odd');
//		$tbl.find('tbody tr:even').addClass('tbody-nth-child-even');
//		$tbl.find('tbody tr:odd').addClass('tbody-nth-child-odd');
//	}
//}

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

/** ready/load/resize document **/

$(document).ready(function(){
	placeholderInit();
	dropLanguageInit();
	showFormSearch();
	phonesDrop();
	//addClass();
});