// textarea auto resize
$(function () {
    var ta = $('textarea');
    $(ta)
        .focus()
        .on('cut paste drop keydown', function (e) {
            if (e.keyCode == 8 || ta.val() == '') {
                ta.css('height', '30px');
            }
            setTimeout(function () {
                ta.height(ta[0].scrollHeight - 13);
                if (ta.val() == '')
                    ta.css('height', '30px');
            }, 0);
        });

    ta.css('height', '25px');
    ta.height(ta[0].scrollHeight - 13);
    //alert(ta.height(ta[0].scrollHeight - 13));

    // textarea auto resize
    $('ul').on('cut paste drop keydown', 'textarea', function (e) {
        var tA = $(this);
        if (e.keyCode == 8 || tA.val() == '') {
            //tA.css('height', '27px');
        }
        setTimeout(function () {
            tA.height(tA[0].scrollHeight - 13);
            if (tA.val() == '')
                tA.css('height', '30px');
        }, 0);
    })

    $(document).on('click', function (e) {
        var ulTag = $("#divTasks").find("ul");
        if ($(e.target).is('.action')) {
            var popUp = $(e.target).parents("li").find("div.popup");
            //to detect the current popup out of collection and show it and hide it
            $("div.popup").each(function () {
                if ($(this).is(":visible") && !$(this).is(popUp))
                    $(this).hide();
                else if ($(this).is(popUp)) {
                    if (!$(this).is(":visible")) {
                        var curLI = $(this).parents("li");
                        $(this).show();
                        if (ulTag.find("li").length < 5 && ulTag.height() + ulTag.prop("scrollHeight") > $("div.actions").position().top) {
                            ulTag.css('height', '');
                            ulTag.height(ulTag.height() + 60);
                        }
                        if ((curLI.position().top + $(this).height() + 20) > $("div.actions").position().top) {
                            ulTag.animate({
                                scrollTop: $("div.actions").position().top
                            });
                        }
                    }
                    else {
                        if(ulTag.find("li").length<5)
                            ulTag.css('height', '');
                        $(this).hide();
                    }
                }
            })
        } else if (!$(e.target).parents("li").is('.field') ||
            ($(e.originalEvent.target).attr("for") &&
                $(e.originalEvent.target).attr("for").indexOf("chk") != -1)) {
            $("li").find("span").show();
            $("li").find("div.divOpt").show();
            $("li").find("div.txtarea").hide();

            var scope = angular.element(document.getElementById("body")).scope();
            scope.$apply(function () {
                scope.add();
            });
        }

        if (!$(e.target).is('.action')) {
                ulTag.css('height', '');
            $("div.popup").hide();
        }
    });

    $("#options2").on("click", function () {
        $(this).css("background-image", "url(/images/settings01.png)");
        $("#options").css("background-image", "url(/images/main02.png)");
    });

    $("#options").on("click", function () {
        $(this).css("background-image", "url(/images/main01.png)");
        $("#options2").css("background-image", "url(/images/settings02.png)");
    });

    $("#opt").on("click", function () {
        $(this).css("background-image", "url(/images/option2.png)");
        $("#impExp").css("background-image", "url(/images/export&import1.png)");
        $("#ver").css("background-image", "url(/images/history1.png)");
    });

    $("#impExp").on("click", function () {
        $(this).css("background-image", "url(/images/export&import2.png)");
        $("#opt").css("background-image", "url(/images/option1.png)");
        $("#ver").css("background-image", "url(/images/history1.png)");
    });

    $("#ver").on("click", function () {
        $(this).css("background-image", "url(/images/history2.png)");
        $("#opt").css("background-image", "url(/images/option1.png)");
        $("#impExp").css("background-image", "url(/images/export&import1.png)");
    });

    $("#ver").on("click", function () {
        $(this).css("background-image", "url(/images/history2.png)");
        $("#opt").css("background-image", "url(/images/option1.png)");
        $("#impExp").css("background-image", "url(/images/export&import1.png)");
    });

});