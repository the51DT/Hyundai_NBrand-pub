var hasPathObject = function ($elem) {
  return $elem.length > 0;
};
var pathApp = pathApp || {};

pathApp.tableRowSpan = function () {
  $(".dep1").each(function () {
    var tempString = $(this).text();
    var dep1_rows = $(".dep1").filter(function () {
      return $(this).text() == tempString;
    });
    if (dep1_rows.length > 1) {
      dep1_rows.eq(0).attr("rowspan", dep1_rows.length);
      dep1_rows.not(":eq(0)").remove();
    }
  });
};

pathApp.setUrl = function () {
  var $url = pathApp.$body.find(".url span");
  $url.each(function () {
    var link = $(this).text(),
      str = "";
    if (link != null && link != "") {
      str +=
        '<a href="../html/' +
        link +
        '" target="_blank" rel="noopener">' +
        link +
        "</a>";
      $(this).empty().html(str);
    }
  });
};

pathApp.setDate = function () {
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var $date = pathApp.$body.find(".date");
  if (month < 10) {
    month = "0" + month;
  }
  var date = now.getDate();
  if (date < 10) {
    date = "0" + date;
  }
  $date.each(function () {
    var $date = $("> span", this),
      str = "";
    str += "<p>" + $date.filter(":last").text() + "</p>";
    $date.filter(":not(:last)").each(function () {
      str += '<a data-date="' + $(this).text() + '">○</a>';
    });
    $date.filter(":last").each(function () {
      str += '<a data-date="' + $(this).text() + '">●</a>';
    });
    if ($date.filter(":first").text() != "") {
      $(this).empty().html(str);
    }
    var chkDay = $date.filter(":last").text().split(" ");
    var chkDay2 = chkDay[0].split("-");
    if (chkDay2[0] == year && chkDay2[1] == month && chkDay2[2] == date) {
      $(this).parent().addClass("today");
    }
  });
};

pathApp.setNaviMenu = function () {
  var $naviMenu = pathApp.$body.find(".naviMenu");
  var html = "";

  html += "<ul>";
  html += "<li><a href='#' class='allMenu on'>전체보기</a></li>";
  pathApp.$dep1.each(function (idx) {
    var thatTit = $(this).find(".tit").text();
    $(this).attr("id", "menu" + idx);
    html +=
      "<li><a href='#' class='menu' data-key=" +
      idx +
      ">0" +
      parseInt(idx + 1) +
      "." +
      thatTit +
      "<span class='countWrap'>(<em class='count'></em>/<em class='allCount'></em>) <em class='progress'></em></span></a></li>";
  });
  html += "</ul>";
  $naviMenu.html(html);
};

pathApp.initNaviMenuEvent = function () {
  pathApp.$allMenu = pathApp.$body.find(".allMenu");
  pathApp.$menu = pathApp.$body.find(".menu");
  pathApp.$allMenu.on("click", pathApp.handleAllMenuClick);
  pathApp.$menu.on("click", pathApp.handleNaviMenuClick);
};

pathApp.handleAllMenuClick = function () {
  pathApp.$pathTbl.find("tbody tr").show();
  $(".naviMenu li a").removeClass("on");
  $(this).addClass("on").sibling().removeClass("on");
};

pathApp.handleNaviMenuClick = function () {
  $(".naviMenu li a").removeClass("on");
  $(this).addClass("on");
  var key = parseInt($(this).attr("data-key"));
  var dep1Check = parseInt(pathApp.$dep1.eq(key).attr("rowspan"));
  if (!dep1Check) {
    dep1Check = 1;
  }
  var listKey = pathApp.$dep1.eq(key).parent("tr").index();

  pathApp.$pathTbl.find("tbody tr").hide();

  for (var i = 0; i < dep1Check; i++) {
    pathApp.$pathTbl
      .find("tbody tr")
      .eq(listKey + i)
      .show();
  }
};

pathApp.initLineEvent = function () {
  var $urlLink = pathApp.$body.find(".url a");
  var $date = pathApp.$body.find(".date a");
  var $hoverElem = $(".pathTbl tbody th, .pathTbl tbody td");

  $urlLink.click(function () {
    var $active = $(this).parent().parent().parent().children();
    $hoverElem.removeAttr("style");
    $active.css({ "background-color": "#f2f2f2" });
    $urlLink.removeAttr("style");
  });

  $hoverElem.hover(
    function () {
      $(this).parent().addClass("on");
    },
    function () {
      $(this).parent().removeClass("on");
    }
  );

  $date
    .on("mouseenter", function () {
      $(this).parent().find("p").text($(this).attr("data-date"));
    })
    .on("mouseleave", function () {
      $(this)
        .parent()
        .find("p")
        .text($(this).parent().find("a:last").attr("data-date"));
    });
};

pathApp.initTotalCount = function () {
  var $total = pathApp.$body.find(".total");
  var $guideUrl = pathApp.$body.find(".guide .url");
  var $url = pathApp.$body.find(".url");
  var $guideCheck = pathApp.$body.find(".guide .check span");
  var $check = pathApp.$body.find(".check span");

  $total.each(function () {
    var sum = 0;
    var sumG = 0;
    var sumMinus = 0;
    var sumMinusG = 0;
    var count = 0;
    var countG = 0;

    $url.each(function () {
      if ($(this).find("span").html() != "") sum++;
      else sumMinus++;
    });

    $guideUrl.each(function () {
      if ($(this).find("span").html() != "") sumG++;
      else sumMinusG++;
    });

    $check.each(function () {
      if ($(this).attr("class") != "comp icon-state") count++;
    });

    $guideCheck.each(function () {
      if ($(this).attr("class") != "comp icon-state") countG++;
    });

    count = sum - sumG + (sumMinus - sumMinusG) - (count - countG);
    sum = sum - sumG;
    str = "";
    str +=
      "<span>" +
      count +
      " / " +
      sum +
      " Pages" +
      "</span>" +
      "<em>" +
      " (" +
      parseInt((count / sum) * 100) +
      "%" +
      ")" +
      "</em>";
    $(this).html("<strong>Total : </strong><span> " + str + "</span>");
  });
};

pathApp.initSectionCount = function () {
  var $countWrap = pathApp.$body.find(".countWrap");
  var $count = $countWrap.find(".count");
  var $allCount = $countWrap.find(".allCount");
  var $progress = $countWrap.find(".progress");
  var setCount = 0;
  var setIndex = -1;
  $count.text(setCount);

  pathApp.$pathTbl.find("tbody tr").each(function (idx) {
    if ($(this).find(".check span").attr("class") === "comp icon-state")
      setCount += 1;
    if ($(this).find("th").hasClass("dep1")) {
      setIndex += 1;
      setCount = 0;
      if ($(this).find(".check span").attr("class") === "comp icon-state")
        setCount += 1;
    }
    $count.eq(setIndex).text(setCount);
  });

  pathApp.$dep1.each(function (idx) {
    var thatRowspan = $(this).attr("rowspan");
    if (thatRowspan === undefined) thatRowspan = 1;
    $allCount.eq(idx).text(thatRowspan);

    var countText = parseInt($count.eq(idx).text());
    var allCountText = parseInt($allCount.eq(idx).text());
    $progress
      .eq(idx)
      .text("진행율:" + parseInt((countText / allCountText) * 100) + "%");
  });
};

pathApp.initSyntaxHighlighter = function () {
  SyntaxHighlighter.all();
};

pathApp.initPath = function () {
  pathApp.setUrl();
  pathApp.setDate();
  pathApp.setNaviMenu();
  pathApp.initNaviMenuEvent();
  pathApp.initLineEvent();
  pathApp.initTotalCount();
  pathApp.initSectionCount();
  hasPathObject(pathApp.$body.find(".code")) && pathApp.initSyntaxHighlighter();
};

pathApp.tableRowSpan();

$(function () {
  pathApp.$body = $("body");
  pathApp.$pathTbl = pathApp.$body.find(".pathTbl");
  pathApp.$dep1 = pathApp.$pathTbl.find(".dep1");
  pathApp.initPath();
  // $(".mark-wrap li").click(function () {
  //   dataClickClass = $(this).find("span").attr("class");
  //   $(".pathTbl tbody tr").hide();
  //   $(".check span").each(function () {
  //     dataClass = $(this).attr("class");
  //     if (dataClass == dataClickClass) {
  //       $(this).parents("tr").show();
  //     }
  //   });
  // });
});
