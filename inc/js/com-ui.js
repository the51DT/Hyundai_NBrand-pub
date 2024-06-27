if ($.isFunction("checkCommonJs")) {
  checkCommonJs("com.ui.js");
}
/* 퍼블리셔 JS 셋팅 */
$(document).ready(function () {
  NbrandUI.headerNav(".nav-btn", ".nav-wrap", ".header-wrap");
  NbrandUI.headerNavdep(
    "button[class^='gnb__tab-btn']",
    ".gnb__tab-cont-wrap",
    "button[class^='gnb__tab02-btn']",
    ".gnb__panel02"
  );
  NbrandUI.modalOpen(".pop-open");
  NbrandUI.modalClose(".pop-close");
  NbrandUI.naviClick(".navi_event-btn");
  NbrandUI.rendingClick(".rending-btn");
  resizeDone();
  // NbrandUI.inputClear(".input-del");
});

let $win_W = $(window).width();
var delta = 100;
var timer = null;
function resizeDone() {
  if (NbrandUI.windowSize()) {
    $("[class^=panel2_2]").removeClass("on");
  } else {
  }
}
$(window).resize(function () {
  $win_W = $(window).width();
  clearTimeout(timer);
  timer = setTimeout(resizeDone, delta);
});

function bodyControll(state) {
  if (!state) {
    $("body").removeClass("fix");
  } else {
    $("body").addClass("fix");
  }
}

var NbrandUI = {
  checkObj: function (obj) {
    return $(obj).length == 0 ? false : true;
  },

  windowSize: function () {
    return $win_W >= 1024 ? false : true;
  },
  expandedAria: function (obj) {
    if ($(obj).attr("aria-expanded") == "false") {
      $(obj).attr("aria-expanded", "true");
    } else {
      $(obj).attr("aria-expanded", "false");
    }
  },
  selectedAria: function (obj) {
    if ($(obj).attr("aria-selected") == "false") {
      $(obj).attr("aria-selected", "true");
    } else {
      $(obj).attr("aria-selected", "false");
    }
  },

  navigationBar: function (obj) {
    navigationBtn = $(obj);
    navigationBtn.toggleClass("on");
    NbrandUI.expandedAria();
    navigationBtn.siblings(".navigation-menu").stop().slideToggle(300);
  },

  rendingEvent: function (obj) {
    rendingBtn = $(obj);
    rendingBtn.addClass("on").parent().siblings().children().removeClass("on");
    NbrandUI.expandedAria();
    // navigationBtn.siblings(".navigation-menu").stop().slideToggle(300);
  },

  popOpen: function (obj) {
    openmodalBtn = $(obj);
    openmodalBtn.addClass("open-btn").data("open");
    openmodalData = openmodalBtn.attr("aria-controls");
    openWrap = $(".popup" + openmodalData);
    var popClass = openWrap.attr("class");
    NbrandUI.expandedAria(openmodalBtn);
    if (NbrandUI.windowSize()) {
      switch (popClass) {
        case "popup model-popup":
          openWrap.addClass("on").fadeIn(200);
          break;
        case "popup model-popup forModel":
          openWrap.addClass("on").fadeIn(200);
          break;
        case "popup model-popup fullwidth":
          openWrap.addClass("on").fadeIn(200);
          break;
        case "popup bottom-popup":
          openWrap.addClass("on").slideDown(200);
          NbrandUI.dimdOn();
          $(".dimmed").addClass(openmodalData).css("z-index", 1002);
          break;
        case "popup bottom-popup2":
          openWrap.addClass("on").slideDown(200);
          NbrandUI.dimdOn();
          $(".dimmed").addClass(openmodalData);
          break;
        case "popup side-popup":
          openWrap.addClass("on").fadeIn(200);
          break;
        case "popup club-popup":
          openWrap.addClass("on").slideDown(200);
          NbrandUI.mdimdOn();
          break;
        case "popup club-info-popup bottom-popup":
          openWrap.addClass("on").slideDown(200);
          NbrandUI.dimdOn();
          $(".dimmed").addClass(openmodalData).css("z-index", 1002);
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
        case "popup model-popup forModel":
          openWrap.addClass("on").fadeIn(200);
          NbrandUI.dimdOn();
          $(".dimmed").addClass(openmodalData);
          break;
        case "popup model-popup fullWidth":
          openWrap.addClass("on").fadeIn(200);
          NbrandUI.dimdOn();
          $(".dimmed").addClass(openmodalData);
          break;
        case "popup bottom-popup":
          openWrap.addClass("on").fadeIn(200);
          NbrandUI.dimdOn();
          $(".dimmed").addClass(openmodalData).css("z-index", 1002);
          break;
        case "popup bottom-popup2":
          openWrap.addClass("on").fadeIn(200);
          NbrandUI.dimdOn();
          $(".dimmed").addClass(openmodalData);
          break;
        case "popup side-popup":
          NbrandUI.anidimdOn();
          $(".ani-dimmed").addClass(openmodalData + " on");
          setTimeout(function () {
            openWrap.addClass("on"); //.animate({ right: "0px" }, 100);
          }, 200);
          break;
        case "popup club-popup":
          openWrap.addClass("on").fadeIn(200);
          break;
        default:
          openWrap.addClass("on").fadeIn(200);
          break;
      }
    }
    // openWrap.find(".pop-close").addClass(openmodalData);
    tparent = openWrap;
    Nbrand.uiFocusTab({
      selector: tparent,
      type: "hold",
    });
  },
  /* headerNav */
  headerNav: function (obj, com, par) {
    if (!NbrandUI.checkObj(obj)) {
      return;
    }

    eventCont = $(com);
    eventParent = $(par);
    if (NbrandUI.windowSize()) {
      eventContH = $(window).height() - 70;
    } else {
      eventContH = eventCont.prop("scrollHeight");
    }

    eventCont.hide();
    tparent = eventParent.find(".sitemap-wrap");

    function event() {
      $(obj)
        .off("click")
        .on("click", function () {
          eventItem = $(this);
          NbrandUI.toggleBtn();
          eventParent.toggleClass("menu-on");
          NbrandUI.expandedAria();
          if (eventItem.hasClass("on")) {
            Nbrand.uiFocusTab({
              selector: tparent,
              type: "hold",
            });
            eventCont.show().stop().animate(
              {
                height: eventContH,
              },
              300
            );
            if (NbrandUI.windowSize()) {
              bodyControll(true);
            }
          } else {
            eventCont.attr("aria-hidden", "true");
            tparent.children(".ui-fctab-s").remove();
            tparent.children(".ui-fctab-e").remove();
            eventCont.stop().animate(
              {
                height: 0,
              },
              300
            );
            tparent.find(".on").removeClass("on");
            $(".panel2_2_1, .gnb__tab-cont02 .gnb__tab02-btn01").addClass("on");
            $(".header__event-wrap").show();
            setTimeout(function () {
              if (!eventItem.hasClass("on")) {
                eventCont.hide();
              }
            }, 300);
            if (NbrandUI.windowSize()) {
              bodyControll(false);
            }
          }
        });
    }
    event();
  },
  headerNavdep: function (dep2, dep2com, dep3, dep3com) {
    function init(dep2, dep2com, dep3, dep3com) {
      eventBtn = $(dep2);
      gnbPanel = $(dep2com);
      eventBtn02 = $(dep3);
      gnbPanel02 = $(dep3com);
    }

    function event() {
      // depth2
      eventBtn.off("click").on("click", function () {
        gnb2depBtn = $(this);
        gnb2depData = $(this).attr("aria-controls");
        gnb2depTarget = gnbPanel.find("#" + gnb2depData);
        NbrandUI.selectedAria(gnb2depBtn);
        gnb2depBtn
          .toggleClass("on")
          .parent()
          .siblings()
          .find("button")
          .removeClass("on");
        gnb2depBtn;
        gnb2depTarget.toggleClass("on").siblings().removeClass("on");
        if (gnb2depBtn.hasClass("on")) {
          $(".header__event-wrap").hide();
          if (NbrandUI.windowSize()) {
            Nbrand.uiFocusTab({
              selector: gnb2depTarget,
              type: "hold",
            });
          } else {
            // $(".nav-wrap")
            //   .stop()
            //   .animate(
            //     {
            //       height: gnb2depTarget.prop("scrollHeight") + 50,
            //     },
            //     100
            //   );

            setTimeout(function () {
              $(".nav-wrap")
                .stop()
                .animate({
                  height: gnb2depTarget.prop("scrollHeight") + 50,
                });
            }, 100);
          }
        } else {
          $(".header__event-wrap").show();
        }
      });
      // depth3
      eventBtn02.off("click").on("click", function () {
        gnb3depBtn = $(this);
        gnb3depData = $(this).attr("aria-controls");
        gnb3depTarget = gnbPanel02.find("#" + gnb3depData);
        // gnb2depArea = $(".header__event-wrap");

        // alert(gnb3depTarget.attr("class"));
        gnb3depBtn
          .addClass("on")
          .attr("aria-selected", "true")
          .parent()
          .siblings()
          .find("button")
          .removeClass("on")
          .attr("aria-selected", "false");
        gnb3depBtn;
        gnb3depTarget.addClass("on").siblings().removeClass("on");
        if (gnb3depBtn.hasClass("on")) {
          if (NbrandUI.windowSize()) {
            gnb3depTarget.parent().show();
            Nbrand.uiFocusTab({
              selector: gnb3depTarget,
              type: "hold",
            });
          } else {
            $(".nav-wrap").animate({
              height: gnb3depTarget.prop("scrollHeight") + 160,
            });
          }
        }
      });

      $(".gnb__panel02 .mo-gnb__back-btn")
        .off("click")
        .on("click", function () {
          tparent = $(this).parent();
          tparent.removeClass("on");
          tparent.children(".ui-fctab-s").remove();
          tparent.children(".ui-fctab-e").remove();
          tparent.parent().hide();
        });
      $(".gnb__tab02-wrap > .mo-gnb__back-btn")
        .off("click")
        .on("click", function () {
          tparent = $(this).parent().parent();
          tparent.removeClass("on");
          tparent.children(".ui-fctab-s").remove();
          tparent.children(".ui-fctab-e").remove();
          $(".gnb__tab-btn-wrap button.on")
            .removeClass("on")
            .attr("aria-selected", false);
          $(".header__event-wrap").show();
        });
    }
    init(dep2, dep2com, dep3, dep3com);
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
  naviClick: function (obj) {
    if (!NbrandUI.checkObj(obj)) {
      return;
    }
    var naviBtn = $(obj);
    function event() {
      naviBtn.on("click", function () {
        eventBtn = $(this);
        NbrandUI.navigationBar(eventBtn);
      });
    }

    event();
  },
  rendingClick: function (obj) {
    if (!NbrandUI.checkObj(obj)) {
      return;
    }
    var rendingBtn = $(obj);
    function event() {
      rendingBtn.on("click", function () {
        eventBtn = $(this);
        NbrandUI.rendingEvent(eventBtn);
      });
    }

    event();
  },
  // 모달팝업 실행
  modalOpen: function (obj) {
    if (!NbrandUI.checkObj(obj)) {
      return;
    }
    var openmodal = $(obj);
    function event() {
      openmodal.on("click", function () {
        eventBtn = $(this);
        NbrandUI.popOpen(eventBtn);
      });
    }

    event();
  },
  // 모달팝업 종료
  modalClose: function (obj) {
    if (!NbrandUI.checkObj(obj)) {
      return;
    }

    var closemodal = null,
      closeWrap = null;

    function init(obj) {
      closemodal = $(obj);
    }

    function event() {
      closemodal.on("click", function () {
        closeWrap = $(this).parents(".popup");
        openmodalBtn = $(".open-btn[aria-expanded = true]");
        closeWrap.find(".ui-fctab-s").remove();
        closeWrap.find(".ui-fctab-e").remove();
        NbrandUI.expandedAria(openmodalBtn);
        openmodalBtn.focus().removeClass("open-btn");

        if (NbrandUI.windowSize()) {
          switch (closeWrap.attr("class")) {
            case "popup bottom-popup on":
              closeWrap.removeClass("on").slideUp(200);
              NbrandUI.dimdZindexOff();
              break;
            default:
              closeWrap.removeClass("on").stop().fadeOut(300);
              $(".dimmed").stop().fadeOut(300);
              setTimeout(function () {
                NbrandUI.dimdOff();
                NbrandUI.mdimdOff();
                NbrandUI.anidimdOff();
              }, 300);
              break;
          }
        } else {
          switch (closeWrap.attr("class")) {
            case "popup bottom-popup on":
              closeWrap.removeClass("on").stop().hide();
              $(".dimmed").css("z-index", 1000);
              break;
            case "popup bottom-popup2 on":
              closeWrap.removeClass("on").stop().hide();
              NbrandUI.dimdOff();
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
                NbrandUI.mdimdOff();
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
  dimdZindexOff: function () {
    $("body").find(".dimmed").css("z-index", 1000);
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
  mdimdOn: function () {
    if (!$("body").children(".dimmed").length) {
      $("body").append("<div class='m-dimmed' aria-hidden='true'></div>");
    } else {
      // $(".dimmed").css("z-index", 1002);
    }
  },
  mdimdOff: function () {
    $("body").find(".m-dimmed").remove();
  },
};
