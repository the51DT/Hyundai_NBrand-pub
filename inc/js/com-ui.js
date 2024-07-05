if ($.isFunction("checkCommonJs")) {
  checkCommonJs("com.ui.js");
}
/* 퍼블리셔 JS 셋팅 */
$(document).ready(function () {
  // NbrandUI.startSet();
  NbrandUI.headerNav(".nav-btn", ".nav-wrap", ".header-wrap");
  NbrandUI.headerNavdep(
    "button[class^='gnb__tab-btn']",
    ".gnb__tab-cont-wrap",
    "button[class^='gnb__tab02-btn']",
    ".gnb__panel02"
  );
  NbrandUI.modalOpen(".pop-open");
  NbrandUI.profileOpenClose(".profile-open");
  NbrandUI.modalClose(".pop-close");
  NbrandUI.naviClick(".navi_event-btn");
  NbrandUI.rendingClick(".rending-btn");
  resizeDone();
  // NbrandUI.inputClear(".input-del");
});

let $win_W = $(window).width();
var delta = 100;
var timer = null;

$(window).resize(function () {
  $win_W = $(window).width();
  clearTimeout(timer);
  timer = setTimeout(resizeDone, delta);
});

function resizeDone() {
  if (NbrandUI.windowSize()) {
    $("[class^=panel2_2]").removeClass("on");
    $(".gnb__panel02").hide();
    $(".panel2_2_1, .gnb__tab-cont02 .gnb__tab02-btn01").removeClass("on");
    NbrandUI.headerReset(".nav-btn", ".nav-wrap", ".header-wrap");
  } else {
    $(".gnb__panel02").show();
    $(".panel2_2_1, .gnb__tab-cont02 .gnb__tab02-btn01").addClass("on");
    NbrandUI.headerReset(".nav-btn", ".nav-wrap", ".header-wrap");
  }
}

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

  // startSet: function () {
  //   if (NbrandUI.windowSize()) {
  //     $(".panel2_2_1, .gnb__tab-cont02 .gnb__tab02-btn01").removeClass("on");
  //     alert($(".gnb__tab-cont02 .gnb__tab02-btn01").html());
  //   } else {
  //     $(".panel2_2_1, .gnb__tab-cont02 .gnb__tab02-btn01").addClass("on");
  //   }
  // },

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
    if (NbrandUI.windowSize()) {
      NbrandUI.navigationBar(".navi_event-btn");
    }

    // navigationBtn.siblings(".navigation-menu").stop().slideToggle(300);
  },
  popContOpen: function (obj, btn) {
    var openWrap = $(obj);
    var popClass = openWrap.attr("class");
    var popCheck = btn.parents(".popup");
    // zData = 1001;
    if (!popCheck.length) {
      zData = 1001;
      btnAddName = "open-btn1";
      openWrap.css("z-index", zData).attr("data-zindex", zData);
    } else {
      // zData + 2;
      if (zData == 1001) {
        btnAddName = "open-btn2";
        zData = 1003;
      } else if (zData == 1003) {
        btnAddName = "open-btn3";
        zData = 1005;
      } else if (zData == 1005) {
        btnAddName = "open-btn4";
        zData = 1007;
      }
      openWrap.css("z-index", zData).attr("data-zindex", zData);
    }
    // openWrap.css("z-index", zindex);
    $(btn).addClass(btnAddName).data("open");
    if (NbrandUI.windowSize()) {
      switch (popClass) {
        case "popup model-popup":
          openWrap.addClass("on").fadeIn(200);
          break;
        case "popup model-popup forModel":
          openWrap.addClass("on").fadeIn(200);
          break;
        case "popup model-popup forBrand":
          openWrap.addClass("on").fadeIn(200);
          break;
        case "popup model-popup fullwidth":
          openWrap.addClass("on").fadeIn(200);
          break;
        case "popup bottom-popup share-popup":
          openWrap.addClass("on").slideDown(200);
          NbrandUI.dimdOn();
          break;
        case "popup bottom-popup":
          openWrap.addClass("on").slideDown(200);
          NbrandUI.dimdOn();
          // $(".dimmed").css("z-index", 1002);
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
        // $(".dimmed").css("z-index", 1002);
        default:
          openWrap.addClass("on").fadeIn(200);
          break;
      }
    } else {
      switch (popClass) {
        case "popup model-popup":
          openWrap.addClass("on").fadeIn(200);
          NbrandUI.dimdOn();
          break;
        case "popup model-popup forModel":
          openWrap.addClass("on").fadeIn(200);
          NbrandUI.dimdOn();
          break;
        case "popup model-popup forBrand":
          openWrap.addClass("on").fadeIn(200);
          NbrandUI.dimdOn();
          break;
        case "popup model-popup fullWidth":
          openWrap.addClass("on").fadeIn(200);
          NbrandUI.dimdOn();
          break;
        case "popup bottom-popup share-popup":
          openWrap.addClass("on").fadeIn(200);
          NbrandUI.dimdOn();
          // $(".dimmed").css("z-index", 1002);
          break;
        case "popup bottom-popup":
          openWrap.addClass("on").fadeIn(200);
          NbrandUI.dimdOn();
          // $(".dimmed").css("z-index", 1002);
          break;
        case "popup bottom-popup2":
          openWrap.addClass("on").fadeIn(200);
          NbrandUI.dimdOn();
          break;
        case "popup side-popup":
          NbrandUI.anidimdOn();
          $(".ani-dimmed").addClass("on");
          setTimeout(function () {
            openWrap.addClass("on"); //.animate({ right: "0px" }, 100);
          }, 200);
          break;
        case "popup club-popup":
          openWrap.addClass("on").fadeIn(200);
          break;
        case "popup toast-popup":
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
  popOpen: function (obj) {
    openmodalBtn = $(obj);
    // openmodalBtn.addClass("open-btn").data("open");
    openmodalData = openmodalBtn.attr("aria-controls");
    NbrandUI.popContOpen(".popup#" + openmodalData, openmodalBtn);
    NbrandUI.expandedAria(openmodalBtn);
  },
  toastPopup: function (obj) {
    $(obj).fadeIn(200).delay(3000).fadeOut(200);
  },
  popContClose: function (obj) {
    closeWrap = $(obj);
    closeWrap.find(".ui-fctab-s").remove();
    closeWrap.find(".ui-fctab-e").remove();
    openmodalClass = "open-btn1";
    openmodalBtn = $("." + openmodalClass + "[aria-expanded = true]");
    wrapZindexData = closeWrap.attr("data-zindex");

    if (wrapZindexData == 1007) {
      wrapZindexData = 1005;
      // alert($(".popup[data-zindex=" + wrapZindexData + "]").html());
      $(".popup[data-zindex=" + wrapZindexData + "]").css(
        "z-index",
        wrapZindexData
      );
      openmodalBtn = $(".open-btn4[aria-expanded = true]");
      openmodalClass = "open-btn4";
    } else if (wrapZindexData == 1005) {
      wrapZindexData = 1003;
      $(".popup[data-zindex=" + wrapZindexData + "]").css(
        "z-index",
        wrapZindexData
      );
      openmodalBtn = $(".open-btn3[aria-expanded = true]");
    } else {
      wrapZindexData = 1001;
      $(".popup[data-zindex=" + wrapZindexData + "]").css(
        "z-index",
        wrapZindexData
      );
      openmodalBtn = $(".open-btn2[aria-expanded = true]");
    }
    NbrandUI.expandedAria(openmodalBtn);
    openmodalBtn.focus().removeClass("open-btn");
    if (NbrandUI.windowSize()) {
      switch (closeWrap.attr("class")) {
        case "popup bottom-popup on":
          closeWrap.removeClass("on").slideUp(200);
          NbrandUI.dimdOff();
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
          NbrandUI.dimdOff();
          // $(".dimmed").css("z-index", 1000);
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
  },
  popClose: function (obj) {
    closeWrap = $(obj).parents(".popup");
    NbrandUI.popContClose(closeWrap);
  },
  /* headerNav */
  headerReset: function (obj, com, par) {
    resetCont = $(com);
    resetParent = $(par);
    $(obj).removeClass("on");
    resetTparent = resetParent.find(".sitemap-wrap");
    resetCont.attr("aria-hidden", "true");
    resetTparent.children(".ui-fctab-s").remove();
    resetTparent.children(".ui-fctab-e").remove();
    resetCont.css("height", 0);
    resetTparent.find(".on").removeClass("on");
    $(".header__event-wrap").show();
    // setTimeout(function () {
    //   if (!eventItem.hasClass("on")) {
    //     eventCont.hide();
    //   }
    // }, 300);
    if (NbrandUI.windowSize()) {
      bodyControll(false);
    }
  },

  headerNav: function (obj, com, par) {
    if (!NbrandUI.checkObj(obj)) {
      return;
    }

    eventCont = $(com);
    eventParent = $(par);

    if (NbrandUI.windowSize()) {
      eventContH = $(window).height() - 70;
    } else {
      eventContH_Pc = eventCont.prop("scrollHeight");
    }
    eventCont.hide();
    tparent = eventParent.find(".sitemap-wrap");

    function event() {
      $(obj)
        .off("click")
        .on("click", function () {
          bodyControll(true);
          eventItem = $(this);
          if (NbrandUI.windowSize()) {
            eventContH = $(window).height() - 70;
            heightDate = eventContH;
          } else {
            heightDate = eventContH_Pc;
          }
          NbrandUI.toggleBtn();
          eventParent.toggleClass("menu-on");
          NbrandUI.expandedAria();

          if (eventItem.hasClass("on")) {
            //열때
            Nbrand.uiFocusTab({
              selector: tparent,
              type: "hold",
            });
            eventCont.show().stop().animate(
              {
                height: heightDate,
              },
              100
            );

            $(".panel2_2_1, .gnb__tab-cont02 .gnb__tab02-btn01").addClass("on");
          } else {
            //닫을때
            eventCont.attr("aria-hidden", "true");
            tparent.children(".ui-fctab-s").remove();
            tparent.children(".ui-fctab-e").remove();

            bodyControll(false);
            eventCont.stop().animate(
              {
                height: 0,
              },
              100
            );
            tparent.find(".on").removeClass("on");
            $(".panel2_2_1, .gnb__tab-cont02 .gnb__tab02-btn01").addClass("on");
            $(".header__event-wrap").show();
            setTimeout(function () {
              if (!eventItem.hasClass("on")) {
                eventCont.hide();
              }
            }, 100);
            if (NbrandUI.windowSize()) {
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
            $(".nav-wrap").animate(
              {
                height: gnb3depTarget.prop("scrollHeight") + 160,
              },
              100
            );
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
        NbrandUI.profileOffset(".box-profile-img", ".popup-body");
      });
    }

    event();
  },
  // 모달팝업 종료
  modalClose: function (obj) {
    if (!NbrandUI.checkObj(obj)) {
      return;
    }

    var closemodal = null;

    function init(obj) {
      closemodal = $(obj);
    }

    function event() {
      closemodal.on("click", function () {
        button = $(this);
        NbrandUI.popClose(button);
      });
    }

    init(obj);
    event();
  },

  profileOffset: function (obj, com) {
    if (!NbrandUI.checkObj(obj)) {
      return;
    }
    winHeight = $(com).prop("scrollHeight");
    $(obj).each(function () {
      contentPoint = $(this).position().top;
      alert(winHeight - contentPoint - 500);
    });
  },
  profileOpenClose: function (obj) {
    if (!NbrandUI.checkObj(obj)) {
      return;
    }
    // alert(openprofileBtn.offset().top);
    openprofileData = openprofileBtn.attr("aria-controls");
    NbrandUI.expandedAria(openprofileBtn);
    var openprofile = $(obj);
    function event() {
      openprofile.on("click", function () {
        eventBtn = $(this);
        openWrap = eventBtn.siblings(".club-popup");
        // alert(openWrap.attr("class"));
        if (NbrandUI.windowSize()) {
          openWrap.addClass("on").slideDown(200);
          NbrandUI.mdimdOn();
        } else {
          openWrap.addClass("on").fadeIn(200);
        }
        tparent = openWrap;
        Nbrand.uiFocusTab({
          selector: tparent,
          type: "hold",
        });

        openWrap.find(".profile-close").on("click", function () {
          closeWrap = $(this).parents(".club-popup");
          openProfileBtn = closeWrap
            .siblings(".card_profile")
            .find(".profile-open");
          closeWrap.find(".ui-fctab-s").remove();
          closeWrap.find(".ui-fctab-e").remove();
          NbrandUI.expandedAria(openProfileBtn);
          openProfileBtn.focus().removeClass("open-btn");
          if (NbrandUI.windowSize()) {
            closeWrap.removeClass("on").slideUp(200);
            NbrandUI.mdimdOff();
          } else {
            closeWrap.removeClass("on").stop().fadeOut(300);
            $(".dimmed").stop().fadeOut(300);
            setTimeout(function () {
              NbrandUI.dimdOff();
              NbrandUI.mdimdOff();
            }, 300);
          }
        });
      });
    }

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
    let zindexDate = 1000;
    if (!$("body").children(".dimmed").length) {
      $("body").append("<div class='dimmed' aria-hidden='true'></div>");
    } else if ($(".dimmed").css("z-index") == 1000) {
      zindexDate = 1002;
    } else if ($(".dimmed").css("z-index") == 1002) {
      zindexDate = 1004;
    } else if ($(".dimmed").css("z-index") == 1004) {
      zindexDate = 1006;
    }
    $(".dimmed").css("z-index", zindexDate);
  },
  dimdOff: function () {
    let zindexDateChk = $(".dimmed").css("z-index");
    let zindexDate = 0;
    if (zindexDateChk == 1006) {
      zindexDate = 1004;
    } else if (zindexDateChk == 1004) {
      zindexDate = 1002;
    } else if (zindexDateChk == 1002) {
      zindexDate = 1000;
    } else {
      $("body").find(".dimmed").remove();
    }
    $(".dimmed").css("z-index", zindexDate);
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
    $("body").append("<div class='m-dimmed' aria-hidden='true'></div>");
  },
  mdimdOff: function () {
    $("body").find(".m-dimmed").remove();
  },
};
