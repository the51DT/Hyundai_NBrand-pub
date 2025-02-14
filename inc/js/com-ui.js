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
  NbrandUI.profileOpenClose(".profile-open", ".profile-close");
  NbrandUI.modalClose(".pop-close");
  NbrandUI.naviClick(".navi_event-btn");
  resizeDone();
  NbrandSwiper.swiper9(".configurator_swiper");
  NbrandSwiper.swiper3(".ty03Swiper:not(.rankswiper)");
});

let $win_W = $(window).width();
const delta = 100;
let timer = null;
let $popDate = 0;
let swiperConfigurator;
let swiperProfile;
let loopHidden = null;
let loopHidden02 = null;
let $tparentFocus = null;
let $tparentFocus02 = null;
let stack = 0;
$("body").data("lastTag", "true");
var lastTag = $("body").data("lastTag");

$(window).resize(function () {
  $win_W = $(window).width();
  clearTimeout(timer);
  timer = setTimeout(resizeDone, delta);
});

function resizeDone() {
  if (NbrandUI.windowSize()) {
    NbrandUI.headerReset(".nav-btn", ".nav-wrap", ".header-wrap");
  } else {
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

  windowSize: function () {
    return $win_W >= 1024 ? false : true;
  },
  expandedAria: function (obj) {
    if (
      $(obj).attr("aria-expanded") == "false" ||
      !$(obj).attr("aria-expanded")
    ) {
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
    NbrandUI.expandedAria(navigationBtn);
    navigationBtn.siblings(".navigation-menu").stop().slideToggle(300);
  },

  rendingEvent: function (obj) {
    rendingBtn = $(obj);
    rendingBtn.addClass("on").parent().siblings().children().removeClass("on");
    NbrandUI.expandedAria(rendingBtn);
    if (NbrandUI.windowSize()) {
      NbrandUI.navigationBar(".navi_event-btn");
    }

    // navigationBtn.siblings(".navigation-menu").stop().slideToggle(300);
  },
  popContOpen: function (obj, btn) {
    var openWrap = $(obj);
    var popClass = openWrap.attr("class");
    bodyControll(true);
    $popDate++;
    if ($popDate == 1) {
      zData = 1001;
      btnAddName = "open-btn1";
      openWrap.css("z-index", zData).attr("data-zindex", zData);
    } else if ($popDate == 2) {
      btnAddName = "open-btn2";
      zData = 1003;
    } else if ($popDate == 3) {
      btnAddName = "open-btn3";
      zData = 1005;
    } else if ($popDate == 4) {
      btnAddName = "open-btn4";
      zData = 1007;
    }
    openWrap.css("z-index", zData).attr("data-zindex", zData);
    // openWrap.css("z-index", zindex);
    $(btn).addClass(btnAddName).data("open");
    NbrandUI.expandedAria(btn);
    if (NbrandUI.windowSize()) {
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
        case "popup bottom-popup":
          openWrap.addClass("on").slideDown(200);
          NbrandUI.dimdOn();
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
          break;
        case "popup model-popup forModel":
          openWrap.addClass("on").fadeIn(200);
          NbrandUI.dimdOn();
          break;
        case "popup model-popup forBrand":
          openWrap.addClass("on").fadeIn(200);
          NbrandUI.dimdOn();
          break;
        case "popup bottom-popup":
          openWrap.addClass("on").fadeIn(200);
          NbrandUI.dimdOn();
          // $(".dimmed").css("z-index", 1002);
          break;
        case "popup side-popup":
          NbrandUI.anidimdOn();
          $(".ani-dimmed").addClass("on");
          setTimeout(function () {
            openWrap.addClass("on"); //.animate({ right: "0px" }, 100);
          }, 200);
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
    tparent.removeAttr("aria-hidden").siblings().attr("aria-hidden", true);
  },
  popOpen: function (obj) {
    openmodalBtn = $(obj);
    // openmodalBtn.addClass("open-btn").data("open");
    openmodalData = openmodalBtn.attr("aria-controls");
    NbrandUI.popContOpen(".popup#" + openmodalData, openmodalBtn);
    if ($(".popup#" + openmodalData).find("video").length) {
      NbrandUI.videoAutoPlay(".popup#" + openmodalData);
    }
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
    bodyControll(false);
    $popDate--;
    // alert($popDate);
    if ($popDate == 3) {
      wrapZindexData = 1005;
      // alert($(".popup[data-zindex=" + wrapZindexData + "]").html());
      $(".popup[data-zindex=" + wrapZindexData + "]").css(
        "z-index",
        wrapZindexData
      );
      $(".popup[data-zindex=" + wrapZindexData + "]").removeAttr("aria-hidden");
      openmodalBtn = $(".open-btn4[aria-expanded = true]");
      openmodalClass = "open-btn4";
    } else if ($popDate == 2) {
      wrapZindexData = 1003;
      $(".popup[data-zindex=" + wrapZindexData + "]").css(
        "z-index",
        wrapZindexData
      );
      $(".popup[data-zindex=" + wrapZindexData + "]").removeAttr("aria-hidden");
      openmodalBtn = $(".open-btn3[aria-expanded = true]");
      openmodalClass = "open-btn3";
    } else if ($popDate == 1) {
      wrapZindexData = 1001;
      $(".popup[data-zindex=" + wrapZindexData + "]").css(
        "z-index",
        wrapZindexData
      );
      $(".popup[data-zindex=" + wrapZindexData + "]").removeAttr("aria-hidden");
      openmodalBtn = $(".open-btn2[aria-expanded = true]");
      openmodalClass = "open-btn2";
    } else {
      closeWrap.siblings().removeAttr("aria-hidden");
      openmodalBtn = $(".open-btn1[aria-expanded = true]");
      openmodalClass = "open-btn1";
    }
    // alert(openmodalClass);
    openmodalBtn.focus().removeClass(openmodalClass);
    NbrandUI.expandedAria(openmodalBtn);
    if (NbrandUI.windowSize()) {
      switch (closeWrap.attr("class")) {
        case "popup bottom-popup on":
          closeWrap.removeClass("on").slideUp(200);
          NbrandUI.dimdOff();
          break;
        default:
          closeWrap.removeClass("on").stop().fadeOut(300);
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
    if (closeWrap.find("video").length) {
      NbrandUI.videoPause(closeWrap);
    }
    NbrandUI.popContClose(closeWrap);
  },

  focusNonout: function (target) {
    let tparentFocus = target;
    loopHidden = setInterval(function () {
      tparentFocus.siblings("[aria-hidden = true]").each(function () {
        if (
          $(this).attr("data-hide") &&
          $(this).attr("data-stack") === undefined
        ) {
          $(this).attr("data-stack", 1);
        } else if (
          $(this).attr("data-hide") &&
          $(this).attr("data-stack") >= 1
        ) {
          $(this).attr(
            "data-stack",
            parseFloat($(this).attr("data-stack")) + 1
          );
        }
        $(this).attr("data-hide", "true");
      });
      tparentFocus.siblings().attr("aria-hidden", true);
      tparentFocus = tparentFocus.parent();
      if (tparentFocus.data("lastTag")) {
        clearInterval(loopHidden);
      }
    }, 1);
  },
  focusNonoutReset: function (target) {
    tparentFocus02 = target;
    loopHidden02 = setInterval(function () {
      tparentFocus02.siblings("[aria-hidden = true]").each(function () {
        // alert(tparentFocus02.attr("class"));
        if ($(this).attr("data-hide") === undefined) {
          tparentFocus02.siblings().removeAttr("aria-hidden");
          // alert("d");
        } else if ($(this).attr("data-stack") == 0) {
          $(this).removeAttr("data-stack");
          $(this).removeAttr("data-hide");
          // alert("d");
        } else if ($(this).attr("data-stack") !== undefined) {
          $(this).attr("data-stack", parseInt($(this).attr("data-stack")) - 1);
        }
        // tparentFocus02.siblings().removeAttr("aria-hidden");
      });
      // tparentFocus02.siblings().attr("aria-hidden", true);

      // tparentFocus02.siblings("[data-hide = true]").each(function () {
      //   $(this).attr("aria-hidden", true);
      // });

      tparentFocus02 = tparentFocus02.parent();
      if (tparentFocus02.data("lastTag") == lastTag) {
        clearInterval(loopHidden02);
      }
    }, 1);
  },
  /* headerNav */
  headerReset: function (obj, com, par) {
    resetCont = $(com);
    resetParent = $(par);
    $(obj).removeClass("on").attr("aria-expanded", "false");
    bodyControll(false);
    resetParent.removeClass("menu-on");
    resetTparent = resetParent.find(".sitemap-wrap");
    resetCont.attr("aria-hidden", "true");
    $(".gnb__panel02").show();
    $(".gnb__tab02").show();
    if (NbrandUI.windowSize()) {
      $(".mo-gnb__back-btn").show();
    } else {
      // $(".gnb__tab02").();
      $(".mo-gnb__back-btn").hide();
    }
    $(".gnb__tab02-wrap").removeClass("thumbnail-ui");
    resetTparent.find(".ui-fctab-s").remove();
    resetTparent.find(".ui-fctab-e").remove();
    resetTparent.find("[aria-hidden = true]").removeAttr("aria-hidden");
    resetCont.hide();
    resetTparent.find(".on").removeClass("on");
    resetCont.attr("aria-hidden", true);
    $(".header__event-wrap").show();
    // setTimeout(function () {
    //   if (!eventItem.hasClass("on")) {
    //     eventCont.hide();
    //   }
    // }, 300);
    NbrandUI.headerDimdOff();
    $(".navigation_bar-wrap").show();
  },
  videoAutoPlay: function (videoWrap) {
    var eventContainer = $(videoWrap);
    var eventItemVideo = eventContainer.find(".video").length;
    for (var i = 0; i < eventItemVideo; i++) {
      eventContainer.find("video").get(i).play();
    }
    // eventItemVideo.find("video").get(0).play();
  },
  videoPause: function (videoWrap) {
    var eventContainer = $(videoWrap);
    var eventItemVideo = eventContainer.find(".video").length;
    for (var i = 0; i < eventItemVideo; i++) {
      eventContainer.find("video").get(i).pause();
    }
    // eventItemVideo.find("video").get(0).play();
  },
  headerNav: function (obj, com, par) {
    if (!NbrandUI.checkObj(obj)) {
      return;
    }

    eventCont = $(com);
    eventParent = $(par);
    dataScroll = 0;

    if (NbrandUI.windowSize()) {
      eventContH = $(window).height() - 70;
    }
    eventCont.hide();
    tparent = eventParent.find(".sitemap-wrap");

    function event() {
      $(obj)
        .off("click")
        .on("click", function () {
          bodyControll(true);
          eventItem = $(this);
          NbrandUI.toggleBtn();
          eventParent.toggleClass("menu-on");
          eventCont.attr("aria-hidden", false).attr("tabindex", 0);
          NbrandUI.expandedAria(eventItem);
          if (eventItem.hasClass("on")) {
            //열때
            dataScroll = $("body").scrollTop();
            $tparentFocus = eventParent.find(".sitemap-wrap");
            Nbrand.uiFocusTab({
              selector: tparent,
              type: "hold",
            });
            $(".header-wrap").siblings().attr("aria-hidden", true);
            $(".skip-navigation").attr("aria-hidden", true);
            NbrandUI.headerDimdOn();
            if (NbrandUI.windowSize()) {
              eventContH = $(window).height() - 70;
              eventCont.css("height", eventContH).fadeIn(100);
            } else {
              eventCont.css("height", "auto").fadeIn(100);
              eventCont.slideDown(100);
            }
            $(".navigation_bar-wrap").hide();
            setTimeout(function () {
              eventCont.focus();
            }, 110);
          } else {
            //닫을때
            $(".header-wrap").siblings().removeAttr("aria-hidden");
            $(".skip-navigation").removeAttr("aria-hidden");
            eventCont.attr("aria-hidden", "true");
            tparentFocus02 = eventParent.find(".sitemap-wrap");
            tparent.children(".ui-fctab-s").remove();
            tparent.children(".ui-fctab-e").remove();
            NbrandUI.headerDimdOff();
            NbrandUI.headerReset(".nav-btn", ".nav-wrap", ".header-wrap");
            bodyControll(false);
            eventCont.stop().slideUp(100);
            tparent.find(".on").removeClass("on");
            $("body").scrollTop(dataScroll);

            // $(".type-thumbnail, .gnb__tab-cont02 .gnb__tab02-btn01").addClass(
            //   "on"
            // );
            $(".header__event-wrap").show();
            setTimeout(function () {
              $(".header-wrap").removeClass("scroll-on");
            }, 10);
            setTimeout(function () {
              if (!eventItem.hasClass("on")) {
                eventCont.hide();
              }
            }, 100);
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
            gnb2depTarget.siblings().attr("aria-hidden", true);
            gnb2depTarget.parent().siblings().attr("aria-hidden", true);
          } else {
            $(".nav-wrap").stop().slideDown(100);
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
        if (NbrandUI.windowSize()) {
          gnb3depBtn.parents(".gnb__tab02").hide();
          gnb3depBtn
            .parents(".gnb__tab02")
            .siblings(".mo-gnb__back-btn")
            .hide();
        }

        // gnb2depArea = $(".header__event-wrap");
        if (gnb3depTarget.hasClass("type-thumbnail")) {
          $(this).parents(".gnb__tab02-wrap").addClass("thumbnail-ui");
        } else {
          $(this).parents(".gnb__tab02-wrap").removeClass("thumbnail-ui");
        }
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
            gnb3depTarget.siblings().attr("aria-hidden", true);
            gnb3depTarget.parent().siblings().attr("aria-hidden", true);
          } else {
            $(".nav-wrap").stop().slideDown(100);
          }
        }
      });

      $(".gnb__panel02 .mo-gnb__back-btn")
        .off("click")
        .on("click", function () {
          tparent = $(this).parent();
          tparent.parents(".gnb__tab02-wrap").find(".gnb__tab02").show();
          tparent
            .parents(".gnb__tab02-wrap")
            .find(".gnb__tab02")
            .siblings(".mo-gnb__back-btn")
            .show();
          tparent.removeClass("on");
          tparent.children(".ui-fctab-s").remove();
          tparent.children(".ui-fctab-e").remove();
          tparent.parent().hide();
          // bakFocus = $(this).parents("gnb__tab-cont").index();
          $(".gnb__tab02 .on")
            .removeClass("on")
            .attr("aria-selected", false)
            .focus();

          tparent.siblings().removeAttr("aria-hidden");
          tparent.parent().siblings().removeAttr("aria-hidden");
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
            .attr("aria-selected", false)
            .focus();
          $(".header__event-wrap").show();

          tparent.siblings().removeAttr("aria-hidden");
          tparent.parent().siblings().removeAttr("aria-hidden");
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
      // alert(winHeight - contentPoint - 500);
    });
  },

  profileClose: function (obj) {
    closeWrap = $(obj);
    openProfileBtn = closeWrap.siblings(".card_profile").find(".profile-open");
    // $(obj).siblings(".card_profile").find(".profile-open");
    closeWrap.removeClass("on").stop().fadeOut(300);
    closeWrap.find(".ui-fctab-s").remove();
    closeWrap.find(".ui-fctab-e").remove();
    NbrandUI.expandedAria(openProfileBtn);
    $(".open-profile-btn").focus().removeClass("open-profile-btn");
  },
  profileCloseOption: function (obj) {
    obj.removeClass("on").stop().fadeOut(300);
    obj.find(".ui-fctab-s").remove();
    obj.find(".ui-fctab-e").remove();
    $(".profile-open").removeClass("open-profile-btn");
  },
  profileOpenClose: function (obj, closeObj) {
    if (!NbrandUI.checkObj(obj)) {
      return;
    }
    // alert(openprofileBtn.offset().top);
    // openprofileData = openprofileBtn.attr("aria-controls");
    var openprofile = $(obj);
    var closeprofile = $(closeObj);
    // var winHeight = 0;
    // function init(obj) {
    //   NbrandUI.expandedAria(openprofile);
    // }

    function event() {
      openprofile.on("click", function () {
        eventBtn = $(this);
        swiperEvent = eventBtn.parents(".ty03Swiper");
        openWrap = eventBtn.siblings(".club-popup");
        NbrandUI.profileCloseOption($(".club-popup"));
        eventBtn.addClass("open-profile-btn");
        if (swiperEvent.length) {
          swiperEvent[0].swiper.autoplay.stop();
          swiperEvent.find(".btn-play").removeClass("on");
        }
        openWrap.addClass("on").stop().fadeIn(200);
        // tparent = openWrap;
        // Nbrand.uiFocusTab({
        //   selector: tparent,
        //   type: "hold",
        // });
        openWrap
          .find(closeObj)
          .off("click")
          .on("click", function () {
            closeWrap = $(this).parents(".club-popup");
            NbrandUI.profileClose(closeWrap);
            if (swiperEvent.length) {
              swiperEvent[0].swiper.autoplay.start();
              swiperEvent.find(".btn-play").addClass("on");
            }
          });
      });
    }
    // init();
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
  headerDimdOn: function (obj) {
    $("body").append("<div class='header-dimmed' aria-hidden='true'></div>");
  },
  headerDimdOff: function (obj) {
    $("body").find(".header-dimmed").remove();
  },
  mdimdOff: function () {
    $("body").find(".m-dimmed").remove();
  },
};

var NbrandSwiper = {
  swiper9: function (obj) {
    if (!NbrandUI.checkObj(obj)) {
      return;
    }
    swiperConfigurator = new Swiper(obj, {
      slidesPerView: 1,
      centeredSlides: true,
      navigation: {
        nextEl: ".configurator_swiper .swiper-button-next",
        prevEl: ".configurator_swiper .swiper-button-prev",
      },
      pagination: {
        el: ".configurator_swiper .swiper-pagination-custom",
        clickable: true,
      },
      a11y: {
        enabled: true,
        prevSlideMessage: "이전 슬라이드",
        nextSlideMessage: "다음 슬라이드",
        slideLabelMessage:
          "총 {{slidesLength}}장의 슬라이드 중 {{index}}번 슬라이드 입니다.",
        paginationBulletMessage: "{{index}}번째 슬라이드로 가기",
      },
      on: {
        afterInit: function () {
          swiperCtrlInert($(".configurator_swiper"));
        },
        slideChangeTransitionEnd: function () {
          swiperCtrlInert($(".configurator_swiper"));
        },
      },
    });
  },
  swiper3: function (obj) {
    if (!NbrandUI.checkObj(obj)) {
      return;
    }
    swiperProfile = new Swiper(obj, {
      slidesPerView: 3,
      spaceBetween: 24,
      loop: true,
      watchOverflow: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".swiper-pagination-custom",
        clickable: true,
      },
      navigation: {
        nextEl: ".ty03Swiper .swiper-button-next",
        prevEl: ".ty03Swiper .swiper-button-prev",
      },
      on: {
        slideChangeTransitionStart: function () {
          if ($(".ty03Swiper .profile-open").length) {
            NbrandUI.profileCloseOption($(".ty03Swiper .club-popup"));
          }
        },
      },
      a11y: {
        enabled: true,
        prevSlideMessage: "이전 슬라이드",
        nextSlideMessage: "다음 슬라이드",
        slideLabelMessage:
          "총 {{slidesLength}}장의 슬라이드 중 {{index}}번 슬라이드 입니다.",
        paginationBulletMessage: "{{index}}번째 슬라이드로 가기",
      },
      breakpoints: {
        360: {
          slidesPerView: 1,
          spaceBetween: 12,
        },
        400: {
          slidesPerView: 1.2,
          spaceBetween: 12,
        },
        768: {
          slidesPerView: 1.5,
          spaceBetween: 12,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 24,
        },
      },
    });
  },
};
