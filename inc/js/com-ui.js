/* 실행함수 */
// $(document).on("pageshow", function () {
$(document).ready(function () {
  NbrandUI.toggleBtn(".toggle-btn");
  // NbrandUI.accordion(".nb-accordion-wrap");
  // NbrandUI.chkAccordion(".nb-chk-accordion-wrap");
  // NbrandUI.tab(".tab-01", ".tab-conts-01");
  // NbrandUI.tab(".tab-02", ".tab-conts-02");
  // NbrandUI.tab(".tab-03", ".tab-conts-03");
  // NbrandUI.tab(".tab-04", ".tab-conts-04");
  // NbrandUI.btomSheet(".sheet-wrap");
  // NbrandUI.modalOpen(".open-modal");
  // NbrandUI.modalClose(".close-js");
  // NbrandUI.bottomOpen(".open-bottom");
  // NbrandUI.bottomClose(".close-bottom");
  // NbrandUI.bottomPopOpen(".open-bottomlist");
  // NbrandUI.bottomPopClose(".close-bottomlist");
  // NbrandUI.rollUpFix(
  //   ".ui-page-active .rollup-fix-data",
  //   ".ui-page-active .content, .ui-page-active .pop-content"
  // );
  // NbrandUI.dateStat(".date-stat-wrap .btn");
  // NbrandUI.tableFix(".table-fix-wrap");
  // NbrandUI.fileSelect(".nb-file-wrap");
  // NbrandUI.switchLabel(".nb-switch-wrap");
  // NbrandUI.chkboxCheck(".nb-chk-wrap");
  // NbrandUI.addrDetail(".addr-list-wrap");
  // NbrandUI.bookMarkToggle(".btn-book-mark");
  // NbrandUI.dateToggle(".date-deta-btn");
  // NbrandUI.accordionSelf(".acco-btn-item");
  // NbrandUI.starrev(".star-item");
  // NbrandUI.moreList(".nb-btn-more");
  // NbrandUI.headerFix(".header-fixed");
  // NbrandUI.accoFix(".acco-top-fixed");
  // NbrandUI.allMenuOpen(".btn-menu-open");
  // NbrandUI.addDatePicker(".nb-datepicker");
  // NbrandUI.dataPickerInput();
  // //NbrandUI.mainMoreList('.nb-main-more');
  // //NbrandUI.addFrom('.btn-add-from');
  // NbrandUI.datelistSort(".sort-btn-wrap");
});
let $win_W = $(window).width();
$(window).resize(function () {
  $win_W = $(window).width();
});

var NbrandUI = {
  checkObj: function (obj) {
    return $(obj).length == 0 ? false : true;
  },

  windowSize: function () {
    console.log($win_W);
    return $win_W >= 1024 ? false : true;
  },

  /* ToggleBtn */
  headerNav: function (obj) {},

  /* ToggleBtn */
  toggleBtn: function (obj) {
    if (!NbrandUI.checkObj(obj)) {
      return;
    }
    var toggleBtn = null;
    var dataTxt = "";
    var dataLabel = "";
    var htmTxt = "";
    var ariaLabel = "";

    function init(obj) {
      toggleBtn = $(obj);
    }

    function event() {
      toggleBtn.off("click").on("click", function () {
        eventItem = $(this);
        dataTxt = eventItem.attr("data-txt");
        dataLabel = eventItem.attr("data-label");

        if (eventItem.hasClass("on")) {
          eventItem.attr("aria-label", ariaLabel).find("span").html(htmTxt);
        } else {
          htmTxt = eventItem.find("span").html();
          ariaLabel = eventItem.attr("aria-label");
          eventItem.attr("aria-label", dataLabel).find("span").html(dataTxt);
        }
        eventItem.toggleClass("on");
      });
    }

    init(obj);
    event();
  },
  // 모달팝업 실행
  modalOpen: function (obj) {
    if (!KedUI.checkObj(obj)) {
      return;
    }

    var openmodal = null;
    var openmodalData = null;
    var openWrap = null;

    function init(obj) {
      openmodal = $(obj);
      openmodalData = openmodal.data("pop");
    }

    function event() {
      openmodal.on("click", function () {
        openmodalData = $(this).data("pop");
        openWrap = $('.popup[data-pop="' + openmodalData + '"]');
        var popClass = openWrap.attr("class");
        switch (popClass) {
          case "popup model-popup":
            openWrap.addClass("on").fadeIn(200);
            break;
          case "popup bottom-popup":
            openWrap.addClass("on").slideDown(200);
            break;
          default:
            openWrap.addClass("on").fadeIn(200);
            break;
        }
        KedUI.dimdOn();
        $(".dimmed").stop().fadeIn(300).addClass(openmodalData);
        openWrap.find(".pop-close").addClass(openmodalData);
      });
    }

    init(obj);
    event();
  },
  // 모달팝업 종료
  modalClose: function (obj) {
    if (!KedUI.checkObj(obj)) {
      return;
    }

    var closemodal = null;
    var closeWrap = null;
    var closemodalData = null;

    function init(obj) {
      closemodal = $(obj);
    }

    function event() {
      closemodal.on("click", function (e) {
        closeWrap = $(this).parents("article");
        closemodalData = closeWrap.data("pop");
        closeWrap.siblings().each(function () {
          if ($(this).attr("data-ariahide") == "on") {
            $(this).removeAttr("data-ariahide");
          } else {
            $(this).removeAttr("aria-hidden");
          }
        });
        closeWrap.removeClass("on").stop().hide();

        $(".dimmed").stop().fadeOut(300);
        setTimeout(function () {
          KedUI.dimdOff();
        }, 300);
      });
    }

    init(obj);
    event();
  },

  /* Dimmed */
  dimdOn: function () {
    if (!$("body").children(".dimmed").length) {
      $("body").append("<div class='dimmed' aria-hidden='true'></div>");
    }
  },
  dimdOff: function () {
    $("body").find(".dimmed").remove();
  },
};
