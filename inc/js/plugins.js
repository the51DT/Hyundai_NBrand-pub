//공통 js import 방지
if ($.isFunction("checkCommonJs")) {
  checkCommonJs("plugins.js");
}
(function ($, win, doc, undefined) {
  var global = "Nbrand",
    namespace = "UI.Nbrand";

  //global namespace
  win[global] = createNameSpace(namespace, {
    uiFocusTab: function (w) {
      return FocusTab(w);
    },
  });

  //components option
  win[global].option = {
    partsAdd0: function (x, y, z) {
      //숫자 한자리수 일때 0 앞에 붙이기
      var y = y === undefined ? 10 : y,
        z = z === undefined ? "0" : z;

      return x < 10 ? z + x : x;
    },
  };

  function createNameSpace(identifier, module) {
    var w = win,
      name = identifier.split("."),
      p,
      i = 0;

    if (!!identifier) {
      for (i = 0; i < name.length; i += 1) {
        !w[name[i]] ? (i === 0 ? (w[name[i]] = {}) : (w[name[i]] = {})) : "";
        w = w[name[i]];
      }
    }

    if (!!module) {
      for (p in module) {
        if (!w[p]) {
          w[p] = module[p];
        } else {
          throw new Error("module already exists! >> " + p);
        }
      }
    }
    return w;
  }

  /* ------------------------------------------------------------------------

		Focus Tab

	------------------------------------------------------------------------ */
  function FocusTab(aP) {
    var aP = $.extend(true, {}, win[global].uiFocusTab.option, aP),
      aR = $(aP.selector),
      aT,
      aN = aR.children(".pi-select-tit, select:not(:disabled)"),
      aS = aP.callback,
      module = aP.focusnot,
      aQ = aP.type;
    if (!!aN.length) {
      aN.eq(0).addClass("ui-fctab-s").attr("tabindex", 0).attr("holds", true);
      aN.parent()
        .find(".btn-close")
        .addClass("ui-fctab-e")
        .attr("tabindex", 0)
        .attr("holde", true);
    } else {
      aR.prepend('<div class="ui-fctab-s" tabindex="0" holds="true"></div>');
      aR.find(">div:not(.ui-fctab-s, .ui-fctab-e)").attr("tabindex", 0);
      aR.append('<div class="ui-fctab-e" tabindex="0" holde="true"></div>');
      aN = aR.find("> div");
    }
    clearTimeout(aT);
    aT = setTimeout(function () {
      !module ? aN.eq(0).focus() : "";
    }, 100);
    aT = "";
    aR.find(".ui-fctab-s")
      .off("keydown.holds")
      .on("keydown.holds", function (aU) {
        if (aQ === "hold") {
          if (aU.shiftKey && aU.keyCode == 9) {
            aU.preventDefault();
            aR.find(".ui-fctab-e").focus();
          }
        } else {
          if (aQ === "sense") {
            aR.off("keydown.modal");
            aU.shiftKey && aU.keyCode == 9 ? aS("before") : "";
          }
        }
      });
    aR.find(".ui-fctab-e")
      .off("keydown.holde")
      .on("keydown.holde", function (aU) {
        if (aQ === "hold") {
          if (!aU.shiftKey && aU.keyCode == 9) {
            aU.preventDefault();
            aR.find(".ui-fctab-s").focus();
          }
        } else {
          if (aQ === "sense") {
            aR.off("keydown.modal");
            !aU.shiftKey && aU.keyCode == 9 ? aS("after") : "";
          }
        }
      });
  }
})(jQuery, window, document);
