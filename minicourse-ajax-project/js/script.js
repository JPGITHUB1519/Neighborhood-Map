// street : 160 pensilvania ave
//city : washington dc

function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    // YOUR CODE GOES HERE!
    var street = $("#street").val();
    var city = $("#city").val();
    var imgurl_str= "http://maps.googleapis.com/maps/api/streetview?size=600x300&location=";
    var api_key = "&key=AIzaSyBZEG7dhCGFgYOBbL0ZGSYcTyty9PGIbz4";
    var img_html = '<img src="DATA_IMAGE" class="bgimg">';

    imgurl_str = imgurl_str + street + "," + city + api_key;

    img_html =  img_html.replace("DATA_IMAGE", imgurl_str);
    $("body").append(img_html);

    // ny api stuff

    var nytime_url = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + city + '&sort=newest&api-key=177776b81598427580b2f5b4ec555c'
    var items = []

    $.getJSON(nytime_url, function(data)
    {

        // obteniendo el objeto principal del json returnado
        articles = data["response"]["docs"];
        // guardando en arrays los datos del json
        for(art in articles)
        {
            items.push([articles[art]["web_url"], articles[art]["headline"]["main"], articles[art]["snippet"]]);
        }
        // añadir elementos a url
        $.each(items, function(url, desc)
        {
           
            art_html = "<li class='article'><a href='" 
            + $(this)[0] + "'>" + $(this)[1] + "</a>"
            + "<p>" + $(this)[2] + "</p></li>";
            // console.log(items[url], items[desc])
            $('#nytimes-articles').append(art_html);
            $('#greeting').text("So you want to live in " + city + ", Nice Place!");
        });

    })
    // put the error handler to the final and i do not close with ;
    .error(function()
    {
        $("#nytimes-header").text("New York Times Articles Could not be Loaded");
        $("#nytimes-header").addClass("text-error");
    });

    // jsonp has not implementation for error, by that we use this
    // this when pass 8 seconds and we have not response, set error, else clear the timer
    var wikiRequestTimeOut = setTimeout(function()
    {
        $wikiElem.text("Failed to Get Wikipedia Resources")
        $wikiElem.addClass("text-error");
    }, 8000);
    // Wikipedia Reponse
    // jsonp request
    $.ajax(
    {
        url : "https://en.wikipedia.org/w/api.php?action=opensearch&search="  + city + "&format=json&callback=wikiCallback",
        dataType : "jsonp",
        // it by default make a function called callback, it the page has other function name change it!
        //jsonp : "callback",

        // sucesss is deprecated
        // success : function(response)
        // {
        //     // response 1 = title, response 3 = links
        //     for(var cont = 0; cont < response[1].length; cont++)
        //     {
        //         $("#wikipedia-links").append("<li><a href='" + response[3][cont] + "'</a>" + response[1][cont] + "</li>");
        //     }
        // }
    }).done(function(response)
    {
        for(var cont = 0; cont < response[1].length; cont++)
        {
            $("#wikipedia-links").append("<li><a href='" + response[3][cont] + "'</a>" + response[1][cont] + "</li>");
        }
        // if success, clear the timer
        clearTimeout(wikiRequestTimeOut);
    })
    .fail(function()
    {
        $(".wikipedia-container").append("<h1 class='text-error'>WikiPedia Links Could not be Loaded</h1>")
    });



    // añadiente ul
   
    return false;
};

$('#form-container').submit(loadData);
