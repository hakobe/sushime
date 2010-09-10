$(function() {
    // bind
    $("body").bind("user-changed", function(event, username) {
        $("#user-image img").attr({
            src: "http://api.dan.co.jp/twicon/" + username + "/bigger"
        });
        $("#user-find form input[name='username']").val(username);
    });

    // trigger
    $("#user-find form").bind("submit", function() {
        try {
            var username = $(this).find("input[name='username']").val();
            $("body").trigger("user-changed", username);
        } catch(e) {
            console.log(e);
        }
        return false;
    });

    // init
    $("body").trigger("user-changed", "tsuda");
});