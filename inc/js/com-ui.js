if ($.isFunction("checkCommonJs")) {
  checkCommonJs("com.ui.js");
}

/* 퍼블리셔 JS 셋팅 */
$(document).ready(function () {
  $("body").data("lastTag", "true");
  NbrandUI.headerNav(".nav-btn", ".nav-wrap", ".header-wrap");
});

let $win_W = $(window).width();
$(window).resize(function () {
  $win_W = $(window).width();
  location.reload(true);
});

var NbrandUI = {
  checkObj: function (obj) {
    return $(obj).length == 0 ? false : true;
  },

  windowSize: function () {
    return $win_W >= 1024 ? false : true;
  },

  /* headerNav */
  headerNav: function (obj, com, par) {
    if (!NbrandUI.checkObj(obj)) {
      return;
    }

    eventCont = $(com);
    eventParent = $(par);
    tparent = eventParent.find(".sitemap-wrap");
    Nbrand.uiFocusTab({
      selector: tparent,
      type: "hold",
    });

    function event() {
      $(obj)
        .off("click")
        .on("click", function () {
          eventItem = $(this);
          eventParent.toggleClass("menu-on");
          NbrandUI.toggleBtn();
          if (eventItem.hasClass("on")) {
            eventCont.attr("aria-hidden", "false");
            if (NbrandUI.windowSize()) {
              NbrandUI.dimdOn();
            }
          } else {
            eventCont.attr("aria-hidden", "true");
            if (NbrandUI.windowSize()) {
              NbrandUI.dimdOff();
            }
          }
        });
    }
    event();
  },

  /* ToggleBtn */
  toggleBtn: function () {
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
  },

  // 모달팝업 실행
  modalOpen: function (obj) {
    if (!NbrandUI.checkObj(obj)) {
      return;
    }

    var openmodal = null,
      openmodalData = null,
      openWrap = null;

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
        NbrandUI.dimdOn();
        $(".dimmed").stop().fadeIn(300).addClass(openmodalData);
        openWrap.find(".pop-close").addClass(openmodalData);
      });
    }

    init(obj);
    event();
  },
  // 모달팝업 종료
  modalClose: function (obj) {
    if (!NbrandUI.checkObj(obj)) {
      return;
    }

    var closemodal = null,
      closeWrap = null,
      closemodalData = null;

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
          NbrandUI.dimdOff();
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
