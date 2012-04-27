/* start: plugin */
(function($) {
    
    /* 
     * formatting for this plugin was quickly generate & started with:
     *   http://starter.pixelgraphics.us/
     *
     * of course, you still gotta write the code ...
     */
    if (!$.NewsFeed) {
        $.NewsFeed = new Object();
    };

    $.NewsFeed.SectionPopulate = function(el, sectionName, rssFeedUrl, maxStories, storiesWithImagesOnly, titleSelector, listSelector, toggleClass, options) {
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;

        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;

        // Add a reverse reference to the DOM object
        base.$el.data("NewsFeed.SectionPopulate", base);

        base.init = function() {
            if (typeof(sectionName) === "undefined" || sectionName === null) sectionName = "Top Stories";
            if (typeof(rssFeedUrl) === "undefined" || rssFeedUrl === null) rssFeedUrl = "topstories";
            if (typeof(maxStories) === "undefined" || maxStories === null) maxStories = 12;
            if (typeof(storiesWithImagesOnly) === "undefined" || storiesWithImagesOnly === null) storiesWithImagesOnly = false;
            if (typeof(listSelector) === "undefined" || listSelector === null) listSelector = "ul";
            if (typeof(titleSelector) === "undefined" || titleSelector === null) titleSelector = "h4";
            if (typeof(toggleClass) === "undefined" || toggleClass === null) toggleClass = "on";

            base.sectionName = sectionName;
            base.rssFeedUrl = rssFeedUrl;
            base.maxStories = maxStories;
            base.storiesWithImagesOnly = storiesWithImagesOnly;
            base.listSelector = listSelector;
            base.titleSelector = titleSelector;
            base.toggleClass = toggleClass;

            base.options = $.extend({}, $.NewsFeed.SectionPopulate.defaultOptions, options);

            // Put your initialization code here (or "this is where it all happens")
            // base.test();
            base._getData();
        };

        // Sample Function, Uncomment to use
        // base.functionName = function(paramaters){
        //
        // };
        
        
        /* 
        * this (quasi-protected) method reaches out to the YQL and gets data from yahoo news rss feeds 
        * it needs to be modified to incorporate feeds from other sources as well
        * 
        */         
        base._getData = function() {
            
            yqlURL = base._getUrl(base.rssFeedUrl);
            console.log(yqlURL);

            var jqxhr = $.getJSON(yqlURL, function(data, status) {
                console.log("success1:", status, data);
                base._publishStories(data.query.results);
            }).success(function(data, status) {
                console.log("2:", status);
            }).error(function(data, status) {
                console.log("error:", status, data);
            }).complete(function(data, status) {
                console.log("complete:", status, data);
            });

        };


        /* 
         * this method creates the YQL call
         *
         * it takes an rssFeed arg instead of base.rssFeedUrl so it can be used on other contexts
         * 
         */        
        base._getUrl = function(rssFeed) {
            
            yqlLimit = (base.maxStories && base.maxStories > 0) ? '%20limit%20' + base.maxStories : '';
            yqlImageOnly = (base.storiesWithImagesOnly) ? "%20and%20content.type%20%3D%20'image%2Fjpeg'%20" : '';

            return "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20rss%20where%20url%20in%20(%0A%20%20%20%20'" + encodeURI(rssFeed) + "'%0A)%20" + yqlImageOnly + yqlLimit + "%20%7C%20sort(field%3D%22date%22%2C%20descending%3D%22true%22)%20%20%7C%20unique(field%3D%22guid%22)%20&format=json&diagnostics=true&callback=?";

        };
      
        
        /* 
         * this module takes what was retreived from _getData() and renders it
         *
         * it needs to be expaned a bit for those RSS instances where the
         * yahoo media rss extension is NOT used for images
         *
         */
        base._publishStories = function(items) {

            $(base.$el.children(base.titleSelector + ":first")).text(base.sectionName);

            _origUl = $(base.$el.children(base.listSelector + ":first"));
            _ul = _origUl.clone();
            $.each(items.item, function(ii, item) {

                /* this line here will limit stories for non YQL queries */
                if(ii >= base.maxStories) return false;
                

                /* create the text link first for use & for cloning */
                _href = $('<div />').append(
                $('<a/>', {
                    href: item.link,
                    text: item.title,
                    title: item.title
                }));

                /* if an image exists, clone the text link, replacing text w/image */
                _img = $('<div />');
                if (item.content && item.content.url) {
                    _imgObj =
                    _img = _href.clone();
                    _img.children('a').html(
                    $('<img/>', {
                        src: item.content.url,
                        // height: (item.content.height * 1.5),
                        // width: (item.content.url * 1.5),
                        alt: item.title
                    }));
                }

                /* add the new link to the cloned <ul> */                
                _li = $('<li />').append(_img).append(_href);
                _ul.append(_li);
                
            });
            
            /*
             * now take what's in memory (the cloned <ul>) & replace what's on screen
             *
             * you may want to consider a transition here
             *
             * fyi, what this does in terms of the plugin is:
             * $(base.$el.children("ul:first")).replaceWith(_ul);
             */
            _origUl.replaceWith(_ul);    

        };


        base.test = function() {

            $(base.$el.children("h4:first")).text(base.sectionName);

            // let's de-ref the UL in case we want to do some fancy .html() appends    
            _ul = $(base.$el.children("ul:first"));
            _ul.append("<li>foo</li>");

        };

        // Run initializer
        base.init();
    };

    /* set the defaults */
    $.NewsFeed.SectionPopulate.defaultOptions = {
        sectionName: "Top Stories",
        rssFeedUrl: "topstories",
        maxStories: 12,
        storiesWithImagesOnly: false,
        titleSelector: "h4",
        listSelector: "ul",
        toggleClass: "on"
    };

    /* 
    * here is your interface, here is an exmple syntax:
    *  $(function(){
    *    $('#sports').newsfeed_SectionPopulate('Sports Stories', 'sports', 12, 'h4', 'ul', 'on');
    *    $('#living').newsfeed_SectionPopulate('Living', 'living', 5, 'h3');
    *  });
    */
    $.fn.newsfeed_SectionPopulate = function(sectionName, rssFeedUrl, maxStories, storiesWithImagesOnly, titleSelector, listSelector, toggleClass, options) {
        return this.each(function() {
            (new $.NewsFeed.SectionPopulate(this, sectionName, rssFeedUrl, maxStories, storiesWithImagesOnly, titleSelector, listSelector, toggleClass, options));
        });
    };

    // This function breaks the chain, but returns
    // the NewsFeed.SectionPopulate if it has been attached to the object.
    $.fn.getNewsFeed_SectionPopulate = function() {
        this.data("NewsFeed.SectionPopulate");
    };

})(jQuery); /* end: plugin */
​