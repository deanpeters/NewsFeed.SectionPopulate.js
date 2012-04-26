NewsFeed.SectionPopulate.js - a jQuery plugin that renders RSS items from jSON created via YQL
===============================================================================================

NewsFeed.SectionPopulate.js is a jQuery plugin used to consume and render RSS news items via jSON files created via YQL.

While the jSON files demonstreated here come by means of YQL courtesly of the Yahoo! Developer Network, this plugin can be expanded to consume any jSON feed providing similarly structured data.

## Implementation ##

	<head>
		...
		<script type='text/javascript' src='https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js'></script>
		<script type='text/javascript' src='https://YOURDOMAIN.COM/YOURJSPATH/NewsFeed.SectionPopulate.js'></script>
		...
		<script type='text/javascript'>
			$(window).load(function() {
				$(function(){
					/* this will render the first 5 stories in Yahoo!'s Top Stories News RS feed via YQL */
					$('#topStories').newsfeed_SectionPopulate('My Top Stories', 'topstories', 5, 'h4', 'ul', 'on');
					});
				});
		</script>
		...
	</head>
	<body>
		...
		<div id="topStories">
    		<h4></h4>
    		<ul id="thelist"></ul>
		</div>
		...
	</body>


## To Do ##
 
* add (more robust) error handling for ajax
* add google analytics, w/push for outbound clicks
* perhaps use data- item attributes instead of parameters
* use session storage for json captures so only 1 trip required per session
* how about feeds from sources other than Yahoo! News
* error handling, more of it for both AJAX calls and instatiating settings
* would it killya to add a few more comments in the demo & plugin?
* roll into phonegap project

## Technologies Employed ##

Here's a list of the technologies that make this plugin work:

* jQuery - peferably v 1.5 or higher, though this might work on 1.3.2 (not tested)
* HTML - though HTML5 is a good way to go, and CSS3 if you're dealing with media queries
* Yahoo! Query Language - though you can use any service that renders similar jSON structures 
* CORS - that stands for cross-origin resource sharing, which YQL has enabled (thanks!-)

