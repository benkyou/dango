function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var theInput = document.getElementById('search');
var search_query = getParameterByName('search');

document.getElementById("search").value = search_query;
search_page(search_query)

theInput.onchange = theInput.onkeyup = function () {
    var text_input = document.getElementById('search');
    if (theInput.value == "") {
        history.pushState(null, null, "/");
        reset_page();
    } else {
        history.pushState(null, null, "/?search=" + encodeURIComponent(theInput.value));
        search_page(text_input);
    }
    return false;
}

function reset_page() {
    var content = "";

    content += "<p>";
    content += "<center>In order to start searching, type something in the box above!</center>";
    content += "</p>";

    content += "<p>";
    content += "<center>Website content provided by <a href=\"https://jisho.org\">Jisho</a>!</center>";
    content += "</p>";

    document.getElementById("content").innerHTML = content;
}

function search_page(query) {
    var api = "https://jisho.org/api/v1/search/words?keyword=" + query;
    var json = $.getJSON(api, function (json) {
        var content = "";

        var test = json.data

        content += "<div class=\"results\">"

        $.each(test, function (key, data) {
            content += "<div class=\"result\">"
            content += "<div class=\"title\">"
            if (data.japanese[0]['word'] == null) {
                content += "<h1><span>" + data.japanese[0]['reading'] + "</span>" + data.japanese[0]['reading'] + "</h1>"
            } else {
                content += "<h1><span>" + data.japanese[0]['reading'] + "</span>" + data.japanese[0]['word'] + "</h1>"   
            }
            content += "<h2>" + data.senses[0]['parts_of_speech'][0] + "</h2>"
            content += "</div>"
            content += "<div class=\"description\">"
            content += "<ul>"
            $.each(data.senses[0]['english_definitions'], function (key, data) {
                content += "<li>" + data + "</li>"
            });
            content += "</ul>"
            content += "</div>"
            content += "</div>"
        });

        content += "</div>"

        document.getElementById("content").innerHTML = content;

    });
}