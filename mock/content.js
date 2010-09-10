google.load("search", "1");

// image search
google.setOnLoadCallback(function() {
    $(function() {
        function setupImageSearch() {
            var search = new google.search.SearchControl();
            search.setResultSetSize(google.search.Search.LARGE_RESULTSET);
            search.addSearcher(new google.search.ImageSearch());
            search.draw();
            return search;
        };

        var search = setupImageSearch();

        $("#image-search form").bind("submit", function() {
            $("body").trigger("image-search-query", $(this).find("input[name='keyword']").val());
            return false;
        });

        $("body").bind("image-search-query", function(event, query) {
            $("#image-search form input[name='keyword']").val(query);
            search.execute(query);
        });

        $("body").bind("image-search-complete", function(event, data) {
            var results = data.results;
            $("#search-result").empty();

            $.each(results, function(index, result) {
                var a = $("<a>").attr({
                    href: result.originalContextUrl,
                    target: "_blank",
                    className: "image-item",
                    "data-original-url": result.url,
                    "data-small-url": result.tbUrl,
                });
                var img = $("<img>").attr({src: result.tbUrl, title: result.titleNoFormatting});
                a.append(img);
                $("#search-result").append(a);
                if ($("#collage-container").attr("data-topping-loaded") === "no") {
                    a.click();
                    $("#collage-container").attr({ "data-topping-loaded": "yes" });
                }
            });
        });

        search.setSearchCompleteCallback(this, function(sc, searcher) {
            $("body").trigger("image-search-complete", ({ results: searcher.results}));
        });

        $("body").trigger("image-search-query", "寿司");
    });
});



$(function() {
    var imageCache = { };
    var user_image_url;
    var topping_image_url;
    var topping_position = { left:110, top: 20, height: 130 };

    var getDataUrlFromUrl = function(url, callback) {
        if (imageCache[url]) {
            callback(imageCache[url]);
            return;
        }

        $.ajax({
            url:"http://to-data-uri.appspot.com/",
            dataType: "jsonp",
            data:{url: url},
            success:function(data) {
                imageCache[url] = data;
                callback(data);
            }
        });
    };

    $("body").bind("post-collage", function(event) {
        $.post(
            "http://hitode909.appspot.com/png/",
            { data: $("#collage-canvas")[0].toDataURL()},
            function(tiny) {
                console.log(tiny);
            }
        );
    });

    // XXX: chaos...
    $("body").bind("collage-image", function(event, updateCanvas) {
        $("#topping-image").css(topping_position);

        if (user_image_url != $("#user-image").attr("src")) {
            $("#user-image").attr({
                src: user_image_url
            });
        }
        if (topping_image_url != $("#topping-image").attr("src")) {
            $("#topping-image").attr({
                src: topping_image_url
            });
        }

        // canvas?
        if (!updateCanvas) return;
        var canvas = $("#collage-canvas");
        var ctx = canvas[0].getContext("2d");

        getDataUrlFromUrl(user_image_url, function(user_image_data) {
            var user_image_img = new Image();
            user_image_img.src = user_image_data.result;
            user_image_img.addEventListener("load", function() {
                ctx.drawImage(user_image_img, 0, 0, canvas.attr("width"), canvas.attr("height"));

                if (!topping_image_url) return;
                getDataUrlFromUrl(topping_image_url, function(topping_image_data) {
                    var topping_image_img = new Image();
                    topping_image_img.src = topping_image_data.result;

                    topping_image_img.addEventListener("load", function() {
                        var width = topping_position.height * topping_image_img.width / topping_image_img.height;
                        ctx.drawImage(topping_image_img, topping_position.left, topping_position.top, width, topping_position.height);
                        $("body").trigger("post-collage");
                    }, false);
                });
            }, false);

        });

    });

    // user icon
    $("body").bind("user-changed", function(event, username) {
        user_image_url = "http://api.dan.co.jp/twicon/" + username + "/bigger";
        $("body").trigger("collage-image");
        $("#user-find form input[name='username']").val(username);
    });

    $("#user-find form").bind("submit", function() {
        try {
            var username = $(this).find("input[name='username']").val();
            $("body").trigger("user-changed", username);
        } catch(e) {
            console.log(e);
        }
        return false;
    });

    $("body").trigger("user-changed", "tsuda");

    // image select
    $("body").bind("topping-url-changed", function(event, url) {
        topping_image_url = url;
        $("body").trigger("collage-image");

    });

    $("#search-result a").live("click", function() {
        $("body").trigger("topping-url-changed", $(this).attr("data-small-url"));
        $("#search-result a.selected").removeClass("selected");
        $(this).addClass("selected");
        return false;
    });

    // controller(temp)
    var diff = 10;

    $("#button-up").click(function() {
        topping_position.top -= diff;
        $("body").trigger("collage-image");
    });
    $("#button-down").click(function() {
        topping_position.top += diff;
        $("body").trigger("collage-image");
    });
    $("#button-left").click(function() {
        topping_position.left -= diff;
        $("body").trigger("collage-image");
    });
    $("#button-right").click(function() {
        topping_position.left += diff;
        $("body").trigger("collage-image");
    });
    $("#button-small").click(function() {
        topping_position.height -= diff;
        topping_position.left += diff / 2;
        topping_position.top += diff / 2;
        $("body").trigger("collage-image");
    });
    $("#button-large").click(function() {
        topping_position.height += diff;
        topping_position.left -= diff / 2;
        topping_position.top -= diff / 2;
        $("body").trigger("collage-image");
    });
    $("#button-save").click(function() {
        $("body").trigger("collage-image", true);
    });

});
