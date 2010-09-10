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
                var a = $("<a>").attr({href: result.originalContextUrl, target: "_blank", className: "image-item", "data-original-url": result.url});
                var img = $("<img>").attr({src: result.tbUrl, title: result.titleNoFormatting});
                a.append(img);
                $("#search-result").append(a);
            });
        });

        search.setSearchCompleteCallback(this, function(sc, searcher) {
            $("body").trigger("image-search-complete", ({ results: searcher.results}));
        });

        $("body").trigger("image-search-query", "寿司");
    });
});


$(function() {
    // user icon
    $("body").bind("user-changed", function(event, username) {
        $("#user-image img").attr({
            src: "http://api.dan.co.jp/twicon/" + username + "/bigger"
        });
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


});