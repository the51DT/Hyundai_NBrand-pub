if ($.isFunction("checkCommonJs")) {
  checkCommonJs("com.ui.js");
}

/* 퍼블리셔 JS 셋팅 */
$(document).ready(function () {
  NbrandUI.headerNav(".nav-btn", ".nav-wrap", ".header-wrap");
  NbrandUI.headerNav(".nav-btn", ".nav-wrap", ".header-wrap");
  NbrandUI.modalOpen(".pop-open");
  NbrandUI.modalClose(".pop-close");
  // NbrandUI.inputClear(".input-del");
});

let $win_W = $(window).width();
$(window).resize(function () {
  $win_W = $(window).width();
  // location.reload(true);
  // if (NbrandUI.windowSize() && $(".dimmed").length) {
  //   $("body").find(".dimmed").remove();
  // }
});

var NbrandUI = {
  checkObj: function (obj) {
    return $(obj).length == 0 ? false : true;
  },

  windowSize: function () {
    return $win_W >= 1024 ? false : true;
  },
  expandedAria: function (obj) {
    if (obj.attr("aria-expanded") == "false") {
      obj.attr("aria-expanded", "true");
    } else {
      obj.attr("aria-expanded", "false");
    }
  },
  /* headerNav */
  headerNav: function (obj, com, par) {
    if (!NbrandUI.checkObj(obj)) {
      return;
    }

    eventCont = $(com);
    eventParent = $(par);
    tparent = eventParent.find(".sitemap-wrap");

    function event() {
      $(obj)
        .off("click")
        .on("click", function () {
          eventItem = $(this);
          eventParent.toggleClass("menu-on");
          NbrandUI.toggleBtn();
          if (eventItem.hasClass("on")) {
            Nbrand.uiFocusTab({
              selector: tparent,
              type: "hold",
            });
          } else {
            eventCont.attr("aria-hidden", "true");
            tparent.children(".ui-fctab-s").remove();
            tparent.children(".ui-fctab-e").remove();
          }
        });
    }
    event();
  },
  headerNav2Dep: function (obj, com, par) {
    if (!NbrandUI.checkObj(obj)) {
      return;
    }

    eventCont = $(com);
    eventParent = $(par);
    tparent = eventParent.find(".sitemap-wrap");

    function event() {
      $(obj)
        .off("click")
        .on("click", function () {});
      // depth2
      $(".gnb__tab-btn-wrap button").click(function () {
        gnbButton = $(this);
        gnbButtonData = $(this).attr("aria-controls");
        gnbPanel = $(".gnb__tab-cont-wrap");
        gnbPanelTarget = gnbPanel.find(
          '[class*="gnb__tab-cont"]#' + gnbButtonData + '"]'
        );
        gnbEventArea = $(".header__event-wrap");
        gnbButton.parent().siblings().find("button").removeClass("on");
        gnbButton.toggleClass("on");
        gnbPanelTarget.toggleClass("on").siblings().removeClass("on");
        if (!gnbButton.hasClass("on")) {
          gnbEventArea.removeClass("hide");
        } else {
          gnbEventArea.addClass("hide");
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
        openmodalBtn = $(this);
        openmodalData = openmodalBtn.attr("aria-controls");
        openWrap = $(".popup#" + openmodalData);
        var popClass = openWrap.attr("class");
        NbrandUI.expandedAria(openmodalBtn);
        if (NbrandUI.windowSize()) {
          switch (popClass) {
            case "popup model-popup":
              openWrap.addClass("on").fadeIn(200);
              break;
            case "popup bottom-popup":
              openWrap.addClass("on").slideDown(200);
              NbrandUI.dimdOn();
              $(".dimmed").addClass(openmodalData).css("z-index", 1002);
              break;
            case "popup side-popup":
              openWrap.addClass("on").fadeIn(200);
              break;
            default:
              openWrap.addClass("on").fadeIn(200);
              break;
          }
        } else {
          switch (popClass) {
            case "popup model-popup":
              openWrap.addClass("on").fadeIn(200);
              NbrandUI.dimdOn();
              $(".dimmed").addClass(openmodalData);
              break;
            case "popup bottom-popup":
              openWrap.addClass("on").fadeIn(200);
              NbrandUI.dimdOn();
              $(".dimmed").addClass(openmodalData).css("z-index", 1002);
              break;
            case "popup side-popup":
              NbrandUI.anidimdOn();
              $(".ani-dimmed").addClass(openmodalData + " on");
              setTimeout(function () {
                openWrap.addClass("on"); //.animate({ right: "0px" }, 100);
              }, 200);

              break;
            default:
              openWrap.addClass("on").fadeIn(200);
              break;
          }
        }
        openWrap.find(".pop-close").addClass(openmodalData);
        tparent = openWrap;
        Nbrand.uiFocusTab({
          selector: tparent,
          type: "hold",
        });
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
        closeWrap = $(this).parents(".popup");
        closemodalData = closeWrap.attr("id");
        openmodalBtn = $(".pop-open[aria-controls = " + closemodalData + "]");
        closeWrap.find(".ui-fctab-s").remove();
        closeWrap.find(".ui-fctab-e").remove();
        NbrandUI.expandedAria(openmodalBtn);
        openmodalBtn.focus();

        if (NbrandUI.windowSize()) {
          switch (closeWrap.attr("class")) {
            case "popup bottom-popup on":
              closeWrap.removeClass("on").slideUp(200);
              $(".dimmed").css("z-index", 1000);
              break;
            default:
              closeWrap.removeClass("on").stop().fadeOut(300);
              $(".dimmed").stop().fadeOut(300);
              setTimeout(function () {
                NbrandUI.dimdOff();
              }, 300);
              break;
          }
        } else {
          switch (closeWrap.attr("class")) {
            case "popup bottom-popup on":
              closeWrap.removeClass("on").stop().hide();
              $(".dimmed").css("z-index", 1000);
              break;
            case "popup side-popup on":
              closeWrap.removeClass("on").stop().fadeOut(300);
              $(".ani-dimmed").stop().fadeOut(300);
              setTimeout(function () {
                NbrandUI.anidimdOff();
              }, 300);
              break;
            default:
              closeWrap.removeClass("on").stop().fadeOut(300);
              $(".dimmed").stop().fadeOut(300);
              setTimeout(function () {
                NbrandUI.dimdOff();
              }, 300);
              break;
          }
        }
      });
    }

    init(obj);
    event();
  },
  /* Input data clear */
  // inputClear: function (obj) {
  //   if (!NbrandUI.checkObj(obj)) {
  //     return;
  //   }

  //   var input = null;
  //   var clearBtn = null;

  //   function init(obj) {
  //     input = $(obj);
  //     inputLength = input.length;
  //     clearBtn =
  //       '<button type="button" class="del"><span>입력필드 삭제</span></button>';
  //     input.find(".del").remove();
  //     for (var i = 0; i < inputLength; i++) {
  //       input.eq(i).find("input").after(clearBtn);
  //       if (
  //         input.eq(i).find("input").val() == "" ||
  //         input.eq(i).find("input").prop("disabled") == true
  //       ) {
  //         input.eq(i).find("input").parent().find(".del").hide();
  //       } else {
  //         input.eq(i).find("input").parent(".input-del").addClass("on-del");
  //         input.eq(i).find("input").show();
  //       }
  //     }
  //   }

  //   function event(obj) {
  //     input.on("input", "input", function () {
  //       $(this).parent().find(".del").hide();
  //       $(this).parent().addClass("on-del");
  //       $(this).parent().find(".del").show();
  //       if ($(this).parent().hasClass("error")) {
  //         $(this).parent().removeClass("error");
  //       }
  //       if ($(this).val() == "") {
  //         $(this).parent().find(".del").hide();
  //       }
  //     });
  //     clear(obj);
  //   }
  //   function clear(obj) {
  //     $(obj).on("click", ".del", function () {
  //       $(this).parent(".input-del").removeClass("on-del");
  //       $(this).parent().find("input").val("").focus();
  //       if ($(this).parent().hasClass("error")) {
  //         $(this).parent().removeClass("error");
  //       }
  //       $(this).hide();
  //     });
  //   }
  //   init(obj);
  //   event(obj);
  // },
  /* Dimmed */
  dimdOn: function () {
    if (!$("body").children(".dimmed").length) {
      $("body").append("<div class='dimmed' aria-hidden='true'></div>");
    } else {
      // $(".dimmed").css("z-index", 1002);
    }
  },
  dimdOff: function () {
    $("body").find(".dimmed").remove();
  },
  /* aniDimmed */
  anidimdOn: function () {
    if (!$("body").children(".ani-dimmed").length) {
      $("body").append("<div class='ani-dimmed' aria-hidden='true'></div>");
    }
  },
  anidimdOff: function () {
    $("body").find(".ani-dimmed").remove();
  },
};
