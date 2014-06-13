/*	
Created by Abe Yang 5/14/2014

	Legend:
	+ mid = MOC id
	+ tid = tag id
*/

// =========================================================================================================
//
// ANGULAR MAGIC
//
// =========================================================================================================

'use strict';

var app = angular.module('app', ['ngSanitize']);

// CONTROLLERS

/* MOC controller */

app.controller('MocController', function($scope, $location, ui, mocResource, tagResource, statusResource, metaResource) {

	$scope.mocs = mocResource.list();
	$scope.statii = statusResource.list();
	
	var id = getIdFromUrl($location);
	$scope.single = ui.findById(mocResource, id);

	$scope.showTags = true;

	$scope.ui = ui;

	$scope.getRatings = function(id) {
		return mocResource.ratingsById(id);
	};

	$scope.getTagNames = function(tags) {
		// tags is an array of tag id's

		if (!tags.length) return;	// if tag is empty, return nothing

		var html = '<ul>Tag';
		if (tags.length > 1) html += 's';	// pluralize 'tag'

		_.each(tags, function(id) {
			var count = ui.findAttrById(tagResource, 'count', id);
			html += '<li><a href="tag.html#/' + id + '"><span class="right">' + count + '</span>' + tagResource.findNameById(id) + '</a></li>';
		});

		html += '</ul>'
		return html;
	};

	$scope.getStatus = function(status) {
		return ui.findAttrById(statusResource, 'name', status);
	};

	$scope.getTitle = function(id) {
		return ui.findAttrById(metaResource, 'title', id);
	};

	$scope.getLink = function(id) {
		return "moc.html#/" + id;
	};

	$scope.filterCards = {
		status: 0
	};
	$scope.entryOrder = '-submitTime';

});

/* Tag controllers */

app.controller('TagsController', function($scope, $location, tagResource) {

	$scope.tags = tagResource.list();

	$scope.tagOrder = '-count';		// default tag order: sort by popularity

	$scope.max = tagResource.maxCount();

});

app.controller('TagController', function($scope, $location, ui, mocResource, tagResource, statusResource, metaResource) {

	$scope.ui = ui;

	var id = getIdFromUrl($location);
	$scope.tag = ui.findById(tagResource, id);

	$scope.mocs = mocResource.filterByTagId(id);

	$scope.showTags = false;

	$scope.getTitle = function(id) {
		return ui.findAttrById(metaResource, 'title', id);
	};
	$scope.getRatings = function(id) {
		return mocResource.ratingsById(id);
	};
	$scope.getStatus = function(status) {
		return ui.findAttrById(statusResource, 'name', status);
	};

});

/* Contest controllers */

app.controller('ContestController', function($scope, ui, mocResource, contestResource, metaResource) {

	$scope.ui = ui;
	
	$scope.entries = contestResource.list();

	$scope.getTitle = function(id) {
		return ui.findAttrById(metaResource, 'contest', id);
	};
	
	$scope.getPopular = function(id) {
		var moc = mocResource.mostPopular(id);
		return (moc) ? moc.id : id;		// default to regular id
	};

	$scope.filterCards = {
		status: 1
	};
});

app.controller('ContestEntryController', function($scope, $location, ui, mocResource, contestResource, metaResource) {

	$scope.ui = ui;

	var id = getIdFromUrl($location);
	$scope.entry = ui.findById(contestResource, id);
	$scope.title = ui.findAttrById(metaResource, 'contest', id);
	$scope.status = ui.findAttrById(contestResource, 'status', id);

	$scope.mocs = mocResource.filterByContestId(id);

	$scope.getTitle = function(id) {
		return ui.findAttrById(metaResource, 'title', id);
	};
	$scope.getLink = function(id) {
		return "contest_item.html#/" + id;
	};
});

app.controller('ContestItemController', function($scope, $location, ui, mocResource, tagResource, statusResource, contestResource, metaResource) {

	$scope.ui = ui;

	var id = getIdFromUrl($location);
	$scope.single = ui.findById(mocResource, id);
	$scope.title = ui.findAttrById(metaResource, 'title', id);

	var contest_id = $scope.single.contest;
	$scope.entry = ui.findById(contestResource, contest_id);
	$scope.entry_title = ui.findAttrById(metaResource, 'contest', contest_id);
	$scope.entry_link = "contest_entry.html#/" + contest_id;

	// based on status of entry and status of moc item, button will be different..
	var status = ui.findAttrById(statusResource, 'name', $scope.single.status);		// moc status
	$scope.entry_status = ui.findAttrById(contestResource, 'status', contest_id);
	var popular_moc = mocResource.mostPopular(contest_id);
	$scope.isThisPopular = (popular_moc.id == id);
	
	$scope.button = buttonize(status, '#');		// default button
	if ($scope.entry_status==3) { // if contest is expired
		if (popular_moc.id == id) { // if this moc is most popular
			$scope.button = buttonize('Winner!', '#', 'btn-success')
		}
		else $scope.button = buttonize(status, '#', 'btn-disabled');
	}
	else if ($scope.entry_status==2) { // if contest is over, but awaiting approval
		if ($scope.single.status != 3) { // if this moc is not already "rejected"
			$scope.button = buttonize('Make this the Winner', '#', 'btn-primary')	
		}
	}

	$scope.statii = statusResource.list();

	$scope.getRatings = function(id) {
		return mocResource.ratingsById(id);
	};
	
	$scope.getTagNames = function(tags) {
		// tags is an array of tag id's

		if (!tags.length) return;	// if tag is empty, return nothing

		var html = '<ul>Tag';
		if (tags.length > 1) html += 's';	// pluralize 'tag'

		_.each(tags, function(id) {
			var count = ui.findAttrById(tagResource, 'count', id);
			html += '<li><a href="tag.html#/' + id + '"><span class="right">' + count + '</span>' + tagResource.findNameById(id) + '</a></li>';
		});

		html += '</ul>'
		return html;
	};

});

/* Help Center Controllers */

app.controller('HelpQAController', function($scope, ui, helpQuestionsResource) {

	$scope.ui = ui;
	
	$scope.entries = helpQuestionsResource.list();

	$scope.filterEntries = {
		isAnswered: false
	};

	$scope.entryOrder = '-activeTime';
});

app.controller('HelpCatController', function($scope, ui, helpCategoriesResource) {

	$scope.ui = ui;
	
	$scope.categories = helpCategoriesResource.list();
});


// HELPERS

function getIdFromUrl(location) {
	var id = 0;
	if (location.path()) id = location.path().substr(1);		// remove the first character, '/'
	return id;
}

function buttonize(content, link, classes) {
	if (!link) link = '#';
	return '<a class="btn ' + classes + '" href="' + link + '">' + content + '</a>';
}


// FACTORIES

app.factory('ui', function() {
	// var isProduction = true;
	var context = 'dashboard';
	var contact = '';

	return {
        findById: function(resource, id) {
        	return _.find(resource.list(), function(obj) {
                return obj.id == id;
            });
        },
        findAttrById: function(resource, attr, id) {
        	var obj = this.findById(resource, id);
        	return obj[attr];
        },
        imageLink: function(id) {
        	return 'assets/images/cover_' + id + '.jpg';
        },
        avatarLink: function(id) {
        	return 'assets/images/face_' + id + '.jpg';	
        }
	}
});

app.factory('mocResource', function () {

	// http://www.json-generator.com/
	/*
		[
		    '{{repeat(20)}}',
		    {
		        id: '{{index()}}',
		        name: '{{firstName()}} {{surname()}}',
		        ratings: '{{integer(0, 5)}}',
		        raters: '{{integer(1, 200)}}',
		        mocability: '{{integer(30, 100)}}',
                comments: '{{integer(0, 10)}}',
		        fee: '{{integer(0, 5)}}',
		        parts: '{{integer(1, 100)}}',
		        submitTime: '{{date(new Date(2014, 0, 1), new Date(), "YYYY-MM-ddThh:mm:ss")}}',
		        status: '{{integer(0, 4)}}',
		        tags: [
		            '{{repeat(1,5)}}',
		            '{{integer(0, 20)}}'
		        ],
		        contest: '{{integer(0, 9)}}',
		        votes: '{{integer(0, 30)}}'
		    }
		]
	*/

	var data = [
	  {
	    "id": 0,
	    "name": "Gamble Keller",
	    "ratings": 4,
	    "raters": 47,
	    "mocability": 85,
	    "comments": 1,
	    "fee": 3,
	    "parts": 65,
	    "submitTime": "2014-04-09T10:37:24",
	    "status": 3,
	    "tags": [
	      18,
	      19,
	      0
	    ],
	    "contest": 0,
	    "votes": 5
	  },
	  {
	    "id": 1,
	    "name": "Luisa Petty",
	    "ratings": 3,
	    "raters": 106,
	    "mocability": 78,
	    "comments": 9,
	    "fee": 4,
	    "parts": 95,
	    "submitTime": "2014-05-01T21:57:32",
	    "status": 2,
	    "tags": [
	      19,
	      2,
	      10,
	      1,
	      11
	    ],
	    "contest": 6,
	    "votes": 15
	  },
	  {
	    "id": 2,
	    "name": "Maureen Stout",
	    "ratings": 0,
	    "raters": 117,
	    "mocability": 85,
	    "comments": 4,
	    "fee": 5,
	    "parts": 4,
	    "submitTime": "2014-01-01T01:04:27",
	    "status": 3,
	    "tags": [
	      3,
	      12
	    ],
	    "contest": 2,
	    "votes": 9
	  },
	  {
	    "id": 3,
	    "name": "Thornton Mack",
	    "ratings": 1,
	    "raters": 193,
	    "mocability": 70,
	    "comments": 10,
	    "fee": 2,
	    "parts": 45,
	    "submitTime": "2014-04-08T17:00:01",
	    "status": 2,
	    "tags": [
	      3,
	      19,
	      9
	    ],
	    "contest": 7,
	    "votes": 16
	  },
	  {
	    "id": 4,
	    "name": "Isabella Mason",
	    "ratings": 3,
	    "raters": 23,
	    "mocability": 97,
	    "comments": 8,
	    "fee": 0,
	    "parts": 98,
	    "submitTime": "2014-03-28T20:24:12",
	    "status": 4,
	    "tags": [
	      19
	    ],
	    "contest": 1,
	    "votes": 17
	  },
	  {
	    "id": 5,
	    "name": "Holman Gould",
	    "ratings": 0,
	    "raters": 37,
	    "mocability": 37,
	    "comments": 9,
	    "fee": 0,
	    "parts": 81,
	    "submitTime": "2014-03-10T17:39:50",
	    "status": 0,
	    "tags": [
	      5,
	      17,
	      13,
	      20,
	      0
	    ],
	    "contest": 3,
	    "votes": 23
	  },
	  {
	    "id": 6,
	    "name": "Kemp Barnes",
	    "ratings": 2,
	    "raters": 194,
	    "mocability": 70,
	    "comments": 4,
	    "fee": 5,
	    "parts": 95,
	    "submitTime": "2014-06-09T19:36:16",
	    "status": 0,
	    "tags": [
	      17,
	      5,
	      17,
	      11,
	      3
	    ],
	    "contest": 7,
	    "votes": 24
	  },
	  {
	    "id": 7,
	    "name": "Robyn Mcbride",
	    "ratings": 5,
	    "raters": 27,
	    "mocability": 75,
	    "comments": 1,
	    "fee": 5,
	    "parts": 31,
	    "submitTime": "2014-03-29T02:03:59",
	    "status": 1,
	    "tags": [
	      3,
	      1,
	      0,
	      20
	    ],
	    "contest": 2,
	    "votes": 18
	  },
	  {
	    "id": 8,
	    "name": "Ellen Cabrera",
	    "ratings": 1,
	    "raters": 179,
	    "mocability": 41,
	    "comments": 10,
	    "fee": 1,
	    "parts": 97,
	    "submitTime": "2014-05-13T00:18:58",
	    "status": 4,
	    "tags": [
	      4,
	      17,
	      17,
	      2,
	      9
	    ],
	    "contest": 8,
	    "votes": 9
	  },
	  {
	    "id": 9,
	    "name": "Claudette Clarke",
	    "ratings": 2,
	    "raters": 74,
	    "mocability": 66,
	    "comments": 5,
	    "fee": 4,
	    "parts": 34,
	    "submitTime": "2014-01-26T21:36:44",
	    "status": 3,
	    "tags": [
	      15,
	      0
	    ],
	    "contest": 1,
	    "votes": 16
	  },
	  {
	    "id": 10,
	    "name": "Garrison Nash",
	    "ratings": 2,
	    "raters": 184,
	    "mocability": 38,
	    "comments": 7,
	    "fee": 1,
	    "parts": 68,
	    "submitTime": "2014-05-14T13:50:24",
	    "status": 1,
	    "tags": [
	      18,
	      15,
	      16,
	      19,
	      10
	    ],
	    "contest": 6,
	    "votes": 7
	  },
	  {
	    "id": 11,
	    "name": "Patricia Schwartz",
	    "ratings": 1,
	    "raters": 177,
	    "mocability": 46,
	    "comments": 4,
	    "fee": 0,
	    "parts": 8,
	    "submitTime": "2014-04-10T02:43:42",
	    "status": 1,
	    "tags": [
	      0,
	      18,
	      8,
	      3,
	      8
	    ],
	    "contest": 1,
	    "votes": 10
	  },
	  {
	    "id": 12,
	    "name": "Maura Cannon",
	    "ratings": 4,
	    "raters": 146,
	    "mocability": 32,
	    "comments": 3,
	    "fee": 4,
	    "parts": 77,
	    "submitTime": "2014-05-10T07:15:02",
	    "status": 0,
	    "tags": [
	      19,
	      10,
	      9
	    ],
	    "contest": 0,
	    "votes": 17
	  },
	  {
	    "id": 13,
	    "name": "Caldwell Goodman",
	    "ratings": 4,
	    "raters": 82,
	    "mocability": 93,
	    "comments": 10,
	    "fee": 4,
	    "parts": 83,
	    "submitTime": "2014-02-26T01:58:12",
	    "status": 2,
	    "tags": [
	      19,
	      6,
	      11
	    ],
	    "contest": 6,
	    "votes": 4
	  },
	  {
	    "id": 14,
	    "name": "Diane Dominguez",
	    "ratings": 3,
	    "raters": 7,
	    "mocability": 76,
	    "comments": 9,
	    "fee": 0,
	    "parts": 28,
	    "submitTime": "2014-03-19T09:17:56",
	    "status": 0,
	    "tags": [
	      3,
	      7,
	      13,
	      7,
	      2
	    ],
	    "contest": 6,
	    "votes": 1
	  },
	  {
	    "id": 15,
	    "name": "Hannah Heath",
	    "ratings": 0,
	    "raters": 133,
	    "mocability": 78,
	    "comments": 1,
	    "fee": 4,
	    "parts": 37,
	    "submitTime": "2014-03-27T16:41:05",
	    "status": 4,
	    "tags": [
	      3,
	      9
	    ],
	    "contest": 1,
	    "votes": 11
	  },
	  {
	    "id": 16,
	    "name": "Odom Odom",
	    "ratings": 4,
	    "raters": 196,
	    "mocability": 49,
	    "comments": 2,
	    "fee": 0,
	    "parts": 41,
	    "submitTime": "2014-01-15T15:07:38",
	    "status": 0,
	    "tags": [
	      13,
	      17,
	      1,
	      2,
	      7
	    ],
	    "contest": 4,
	    "votes": 16
	  },
	  {
	    "id": 17,
	    "name": "Blanche Skinner",
	    "ratings": 2,
	    "raters": 95,
	    "mocability": 49,
	    "comments": 1,
	    "fee": 1,
	    "parts": 76,
	    "submitTime": "2014-05-06T08:16:43",
	    "status": 0,
	    "tags": [
	      17,
	      11,
	      15,
	      4,
	      8
	    ],
	    "contest": 5,
	    "votes": 13
	  },
	  {
	    "id": 18,
	    "name": "Trudy Shelton",
	    "ratings": 4,
	    "raters": 119,
	    "mocability": 61,
	    "comments": 6,
	    "fee": 2,
	    "parts": 82,
	    "submitTime": "2014-04-03T23:49:36",
	    "status": 0,
	    "tags": [
	      4
	    ],
	    "contest": 6,
	    "votes": 29
	  },
	  {
	    "id": 19,
	    "name": "Lizzie Lynch",
	    "ratings": 2,
	    "raters": 16,
	    "mocability": 91,
	    "comments": 8,
	    "fee": 1,
	    "parts": 19,
	    "submitTime": "2014-04-14T05:25:06",
	    "status": 2,
	    "tags": [
	      14,
	      17,
	      16
	    ],
	    "contest": 8,
	    "votes": 4
	  }
	];
		
	return {
		list: function() {
			return data;
		},
		findById: function(id) {
        	return _.find(data, function(obj) {
                return obj.id == id;
            });
        },
        ratingsById: function(id) {
        	var moc = this.findById(id);
        	var html = '';
            if (moc.raters) {
            	for (var i=1; i<=5; i++) {
            		if (moc.ratings >= i) html += '<i class="fa fa-star"></i>';
            		else html += '<i class="fa fa-star-o"></i>';
            	}
            	// @todo should use an actual circle graphic instead of parens ()
            	html += ' (' + moc.raters + ')';
            }
            else html = 'No ratings yet';
            
            return html;
        },
        filterByContestId: function(cid) {
			return _.filter(data, function(moc) {
        		return moc.contest == cid;
        	});
        },
        mostPopular: function(cid) {
        	// takes in contest id, returns moc object (with most votes)
        	var mocs = this.filterByContestId(cid);
        	return _.max(mocs, function(moc){ return moc.votes; });
        },
        filterByTagId: function(tid) {
			return _.filter(data, function(moc) {
        		// tid is a string; need to convert to number to compare
        		return _.contains(moc.tags, Number(tid)); 
        	});
        },
        findSelected: function() {
        	return _.filter(data, function(moc) {
        		return moc.selected == 'selected';
        	});
        }
	}
});

app.factory('tagResource', function () {

	var data = [
		{id:0,	tagname:"Ship",		count: 56},
		{id:1,	tagname:"Red",		count: 1},
		{id:2,	tagname:"Brown",	count: 3},
		{id:3,	tagname:"Black",	count: 49},
		{id:4,	tagname:"White",	count: 34},
		{id:5,	tagname:"Plane",	count: 52},
		{id:6,	tagname:"Boat",		count: 21},
		{id:7,	tagname:"House",	count: 19},
		{id:8,	tagname:"Horse",	count: 7},
		{id:9,	tagname:"Dog",		count: 41},
		{id:10,	tagname:"Cat",		count: 86},
		{id:11,	tagname:"Mouse",	count: 37},
		{id:12,	tagname:"Hamster",	count: 45},
		{id:13,	tagname:"Thing",	count: 11},
		{id:14,	tagname:"Purple",	count: 15},
		{id:15,	tagname:"Blue",		count: 17},
		{id:16,	tagname:"Sweet",	count: 2},
		{id:17,	tagname:"Console",	count: 5},
		{id:18,	tagname:"Eagle",	count: 8},
		{id:19,	tagname:"Mecha",	count: 33},
		{id:20,	tagname:"Robot",	count: 52}
	];
	
	return {
		list: function() {
			return data;
		},
		findNameById: function(id) {
            var t = _.find(data, function (tag) {
                return tag.id == id;
            });

            return t.tagname;
        },
        maxCount: function() {
        	var t = _.max(data, function(tag){ return tag.count; });
        	return t.count;
        }
	}
});

app.factory('contestResource', function() {
	// http://www.json-generator.com/
	// @todo: need status 0=draft
	// status: 1=new, 2=pending, 3=expired
	/*
	[
	    '{{repeat(10)}}',
	    {
	        id: '{{index()}}',
	        entries: '{{integer(1, 200)}}',
	        votes: '{{integer(1, 100)}}',
	        views: '{{integer(1, 500)}}',
	        content: '{{lorem(1, "paragraphs")}}',
	        startDate: '{{date(new Date(2014, 0, 1), new Date(), "YYYY-MM-dd")}}',
	        duration: '{{integer(1, 30)}}',
	        daysleft: '{{integer(1, 20)}}',
	        status: '{{integer(1, 3)}}'
	    }
	]
	*/

	var data = [
	    {
	        "id": 0,
	        "entries": 113,
	        "votes": 36,
	        "views": 352,
	        "content": "Sint proident esse esse deserunt. Deserunt aliqua ipsum minim proident voluptate sunt. Enim mollit sit occaecat occaecat. Incididunt irure magna tempor deserunt enim nostrud mollit. Aliquip ad nostrud occaecat consectetur irure. Reprehenderit sint officia eiusmod veniam pariatur est esse do ea do tempor et. Quis adipisicing ut ad consectetur occaecat nisi exercitation sint esse nulla amet excepteur elit.\r\n",
	        "startDate": "2014-01-06",
	        "duration": 19,
	        "daysleft": 18,
	        "status": 3
	    },
	    {
	        "id": 1,
	        "entries": 154,
	        "votes": 22,
	        "views": 154,
	        "content": "Quis commodo esse commodo fugiat reprehenderit est ex dolore esse cillum fugiat. Elit irure exercitation et consectetur anim. Elit dolore eu laborum enim aliquip.\r\n",
	        "startDate": "2014-04-12",
	        "duration": 28,
	        "daysleft": 14,
	        "status": 1
	    },
	    {
	        "id": 2,
	        "entries": 93,
	        "votes": 65,
	        "views": 199,
	        "content": "Amet labore pariatur aliqua occaecat in sit ad ad ex esse nulla. Aute reprehenderit aute in in veniam est enim aute. Incididunt incididunt nulla duis fugiat enim est sit ullamco elit tempor. Reprehenderit occaecat duis duis excepteur ad. Pariatur dolor id dolor ex adipisicing commodo cillum excepteur in cupidatat consequat labore id ut. Cillum velit occaecat laborum aliqua laborum cillum ullamco.\r\n",
	        "startDate": "2014-02-19",
	        "duration": 27,
	        "daysleft": 1,
	        "status": 3
	    },
	    {
	        "id": 3,
	        "entries": 27,
	        "votes": 26,
	        "views": 450,
	        "content": "Voluptate eu ad commodo duis ut commodo et in enim nostrud consectetur consectetur commodo. Occaecat cupidatat veniam cupidatat id mollit adipisicing tempor nisi laborum deserunt amet veniam commodo non. Nulla consectetur enim eu ad ex cillum sit quis cillum dolor incididunt dolor ad. Labore commodo enim elit anim occaecat elit eiusmod nulla ad excepteur enim nisi aliquip. Eiusmod laboris ut reprehenderit in eiusmod non laboris. Ipsum incididunt proident duis tempor reprehenderit et culpa do laborum dolor deserunt officia.\r\n",
	        "startDate": "2014-01-09",
	        "duration": 30,
	        "daysleft": 4,
	        "status": 3
	    },
	    {
	        "id": 4,
	        "entries": 124,
	        "votes": 83,
	        "views": 44,
	        "content": "Culpa dolor dolor minim qui. Ullamco nostrud consectetur est amet est labore commodo non sunt pariatur proident. Aliqua deserunt magna incididunt excepteur consequat aute consequat eu.\r\n",
	        "startDate": "2014-04-03",
	        "duration": 19,
	        "daysleft": 17,
	        "status": 1
	    },
	    {
	        "id": 5,
	        "entries": 6,
	        "votes": 1,
	        "views": 451,
	        "content": "Excepteur proident pariatur in aute sint aliquip elit ullamco dolor laboris elit. Anim elit officia amet qui mollit laborum reprehenderit commodo aliquip consectetur sunt. Nostrud consequat velit magna voluptate occaecat laborum esse.\r\n",
	        "startDate": "2014-03-15",
	        "duration": 3,
	        "daysleft": 9,
	        "status": 2
	    },
	    {
	        "id": 6,
	        "entries": 32,
	        "votes": 64,
	        "views": 234,
	        "content": "Labore mollit nostrud et qui irure magna laboris eu ullamco est tempor. Est culpa irure reprehenderit mollit est consectetur nulla magna in. Eiusmod id elit aliquip anim incididunt magna est in nostrud enim eu laboris. Id irure Lorem officia aliquip laborum qui anim. Enim culpa qui ad sint esse mollit labore aute dolor commodo ut pariatur laborum est. Laboris tempor culpa dolor velit qui ut cupidatat consectetur irure. Aute cillum culpa irure sunt reprehenderit tempor.\r\n",
	        "startDate": "2014-03-07",
	        "duration": 19,
	        "daysleft": 3,
	        "status": 2
	    },
	    {
	        "id": 7,
	        "entries": 6,
	        "votes": 66,
	        "views": 48,
	        "content": "Velit velit commodo elit quis culpa consectetur do reprehenderit commodo. Occaecat laborum aliquip tempor sint ad et adipisicing qui cillum. Eiusmod dolor mollit labore pariatur. Ad incididunt proident et magna non enim aliquip. Proident aliquip ea consectetur culpa incididunt adipisicing qui laboris dolor. Elit adipisicing dolor incididunt sint consequat et ex consequat.\r\n",
	        "startDate": "2014-01-06",
	        "duration": 16,
	        "daysleft": 20,
	        "status": 3
	    },
	    {
	        "id": 8,
	        "entries": 150,
	        "votes": 29,
	        "views": 152,
	        "content": "Eu aliqua voluptate esse cillum voluptate aliqua aliqua aliqua irure. Ullamco deserunt quis Lorem officia eiusmod esse laboris amet adipisicing ullamco pariatur dolor. Ex adipisicing ut amet laborum aliquip et ex pariatur aute excepteur quis non. Lorem dolor in excepteur Lorem anim et excepteur minim.\r\n",
	        "startDate": "2014-03-01",
	        "duration": 24,
	        "daysleft": 15,
	        "status": 3
	    },
	    {
	        "id": 9,
	        "entries": 58,
	        "votes": 13,
	        "views": 240,
	        "content": "Esse nulla laborum incididunt fugiat aute cillum est. Commodo laborum cupidatat ut cupidatat in culpa anim irure velit non reprehenderit. Aute minim laboris anim consequat ex amet excepteur qui.\r\n",
	        "startDate": "2014-02-08",
	        "duration": 16,
	        "daysleft": 12,
	        "status": 3
	    }
	];

	return {
		list: function() {
			return data;
		}
	}
});

app.factory('helpQuestionsResource', function() {
	// http://www.json-generator.com/
	/*
	[
	    '{{repeat(50)}}',
	    {
	        id: '{{index()}}',
	        name: '{{firstName()}} {{surname()}}',
	        title: '{{lorem(7, "words")}}',
	        category: '{{integer(0, 7)}}',
	        votes: '{{integer(0, 20)}}',
	        answers: '{{integer(1, 30)}}',
	        views: '{{integer(1, 500)}}',
	        submitTime: '{{date(new Date(2014, 0, 1), new Date(), "YYYY-MM-ddThh:mm:ss")}}',
	        lastUpdater: '{{firstName()}} {{surname()}}',
	        activeTime: '{{date(new Date(2014, 0, 1), new Date(), "YYYY-MM-ddThh:mm:ss")}}',
	        isAnswered: '{{bool()}}',
	        markedByStaff: '{{bool()}}'
	    }
	]
	*/

	var data = [
	    {
	        "id": 0,
	        "name": "Lakisha Flowers",
	        "title": "occaecat aute duis sit in eu labore",
	        "category": 6,
	        "votes": 7,
	        "answers": 17,
	        "views": 227,
	        "submitTime": "2014-01-05T21:41:48",
	        "lastUpdater": "Hartman Bowman",
	        "activeTime": "2014-02-08T04:27:06",
	        "isAnswered": true,
	        "markedByStaff": false
	    },
	    {
	        "id": 1,
	        "name": "Morales Acosta",
	        "title": "aliqua Lorem eiusmod aliquip occaecat cillum cillum",
	        "category": 1,
	        "votes": 20,
	        "answers": 4,
	        "views": 462,
	        "submitTime": "2014-05-20T06:18:40",
	        "lastUpdater": "Roach Banks",
	        "activeTime": "2014-03-12T16:22:46",
	        "isAnswered": true,
	        "markedByStaff": false
	    },
	    {
	        "id": 2,
	        "name": "Rosario Gillespie",
	        "title": "quis cillum amet esse est proident veniam",
	        "category": 0,
	        "votes": 18,
	        "answers": 17,
	        "views": 191,
	        "submitTime": "2014-01-21T01:34:21",
	        "lastUpdater": "Sheppard Mosley",
	        "activeTime": "2014-02-12T13:52:46",
	        "isAnswered": true,
	        "markedByStaff": false
	    },
	    {
	        "id": 3,
	        "name": "Jodie Brewer",
	        "title": "quis ad nisi pariatur laboris sunt fugiat",
	        "category": 0,
	        "votes": 13,
	        "answers": 16,
	        "views": 372,
	        "submitTime": "2014-05-04T15:55:37",
	        "lastUpdater": "Liliana Huffman",
	        "activeTime": "2014-01-20T12:01:52",
	        "isAnswered": false,
	        "markedByStaff": true
	    },
	    {
	        "id": 4,
	        "name": "Luella Melendez",
	        "title": "cillum voluptate officia ipsum exercitation occaecat labore",
	        "category": 7,
	        "votes": 2,
	        "answers": 1,
	        "views": 440,
	        "submitTime": "2014-05-28T11:02:35",
	        "lastUpdater": "Alyson Schroeder",
	        "activeTime": "2014-05-04T02:01:03",
	        "isAnswered": false,
	        "markedByStaff": false
	    },
	    {
	        "id": 5,
	        "name": "Robin Stark",
	        "title": "laboris laboris nulla elit eiusmod et anim",
	        "category": 6,
	        "votes": 5,
	        "answers": 16,
	        "views": 156,
	        "submitTime": "2014-04-01T03:40:02",
	        "lastUpdater": "Noemi Wise",
	        "activeTime": "2014-01-30T00:26:54",
	        "isAnswered": false,
	        "markedByStaff": true
	    },
	    {
	        "id": 6,
	        "name": "Castro Pacheco",
	        "title": "ipsum deserunt ullamco occaecat ad dolor cupidatat",
	        "category": 7,
	        "votes": 4,
	        "answers": 19,
	        "views": 22,
	        "submitTime": "2014-05-27T23:15:13",
	        "lastUpdater": "Jenny Conway",
	        "activeTime": "2014-02-06T16:15:11",
	        "isAnswered": true,
	        "markedByStaff": true
	    },
	    {
	        "id": 7,
	        "name": "Finley Davenport",
	        "title": "nisi culpa ut mollit aliqua commodo eiusmod",
	        "category": 6,
	        "votes": 19,
	        "answers": 10,
	        "views": 270,
	        "submitTime": "2014-03-25T16:08:58",
	        "lastUpdater": "West Durham",
	        "activeTime": "2014-03-19T17:27:13",
	        "isAnswered": false,
	        "markedByStaff": true
	    },
	    {
	        "id": 8,
	        "name": "Jacquelyn Cantu",
	        "title": "dolore nostrud ullamco anim est nostrud irure",
	        "category": 3,
	        "votes": 1,
	        "answers": 9,
	        "views": 154,
	        "submitTime": "2014-05-18T15:48:52",
	        "lastUpdater": "Sherman Hendricks",
	        "activeTime": "2014-01-14T02:50:19",
	        "isAnswered": true,
	        "markedByStaff": true
	    },
	    {
	        "id": 9,
	        "name": "Kathie Walters",
	        "title": "ullamco commodo laborum sint sint consectetur velit",
	        "category": 1,
	        "votes": 19,
	        "answers": 27,
	        "views": 483,
	        "submitTime": "2014-05-19T19:58:33",
	        "lastUpdater": "Bridgett Strong",
	        "activeTime": "2014-01-12T00:00:25",
	        "isAnswered": true,
	        "markedByStaff": false
	    },
	    {
	        "id": 10,
	        "name": "Elizabeth Spencer",
	        "title": "reprehenderit dolore consectetur cillum cupidatat enim do",
	        "category": 5,
	        "votes": 16,
	        "answers": 7,
	        "views": 47,
	        "submitTime": "2014-02-03T15:26:44",
	        "lastUpdater": "Alison Langley",
	        "activeTime": "2014-03-25T18:56:32",
	        "isAnswered": false,
	        "markedByStaff": false
	    },
	    {
	        "id": 11,
	        "name": "Montgomery Guerrero",
	        "title": "eu in consectetur do quis et ullamco",
	        "category": 6,
	        "votes": 5,
	        "answers": 2,
	        "views": 251,
	        "submitTime": "2014-04-27T23:35:39",
	        "lastUpdater": "Sellers Fields",
	        "activeTime": "2014-01-09T15:10:43",
	        "isAnswered": false,
	        "markedByStaff": true
	    },
	    {
	        "id": 12,
	        "name": "Fry Jacobs",
	        "title": "dolor irure nostrud qui Lorem voluptate non",
	        "category": 0,
	        "votes": 4,
	        "answers": 15,
	        "views": 253,
	        "submitTime": "2014-01-19T11:24:09",
	        "lastUpdater": "Sharpe Townsend",
	        "activeTime": "2014-03-05T08:48:46",
	        "isAnswered": true,
	        "markedByStaff": true
	    },
	    {
	        "id": 13,
	        "name": "Lee Gomez",
	        "title": "reprehenderit laboris id consectetur labore do eu",
	        "category": 2,
	        "votes": 10,
	        "answers": 27,
	        "views": 23,
	        "submitTime": "2014-02-14T19:17:58",
	        "lastUpdater": "Blair Clarke",
	        "activeTime": "2014-04-08T04:49:15",
	        "isAnswered": false,
	        "markedByStaff": true
	    },
	    {
	        "id": 14,
	        "name": "Susanna Faulkner",
	        "title": "magna aute sit ullamco dolor incididunt et",
	        "category": 3,
	        "votes": 12,
	        "answers": 11,
	        "views": 340,
	        "submitTime": "2014-05-16T12:01:51",
	        "lastUpdater": "Cox Kane",
	        "activeTime": "2014-04-30T22:56:00",
	        "isAnswered": true,
	        "markedByStaff": true
	    },
	    {
	        "id": 15,
	        "name": "Pace Nguyen",
	        "title": "anim duis irure officia consectetur Lorem nostrud",
	        "category": 2,
	        "votes": 6,
	        "answers": 26,
	        "views": 451,
	        "submitTime": "2014-01-06T05:53:22",
	        "lastUpdater": "Dee Alvarado",
	        "activeTime": "2014-03-19T07:19:52",
	        "isAnswered": false,
	        "markedByStaff": true
	    },
	    {
	        "id": 16,
	        "name": "Barber Walton",
	        "title": "irure dolor culpa eu deserunt dolor nulla",
	        "category": 0,
	        "votes": 2,
	        "answers": 24,
	        "views": 8,
	        "submitTime": "2014-04-21T03:23:47",
	        "lastUpdater": "Phyllis Miles",
	        "activeTime": "2014-05-15T09:34:39",
	        "isAnswered": false,
	        "markedByStaff": false
	    },
	    {
	        "id": 17,
	        "name": "Eloise Trevino",
	        "title": "cupidatat magna incididunt aute non qui exercitation",
	        "category": 7,
	        "votes": 6,
	        "answers": 20,
	        "views": 180,
	        "submitTime": "2014-05-16T14:12:31",
	        "lastUpdater": "Estelle Noel",
	        "activeTime": "2014-01-23T05:20:26",
	        "isAnswered": true,
	        "markedByStaff": true
	    },
	    {
	        "id": 18,
	        "name": "Mildred Bell",
	        "title": "veniam nostrud veniam culpa eiusmod duis aliquip",
	        "category": 4,
	        "votes": 14,
	        "answers": 20,
	        "views": 267,
	        "submitTime": "2014-06-01T08:45:23",
	        "lastUpdater": "Estrada Dickerson",
	        "activeTime": "2014-02-21T16:34:01",
	        "isAnswered": false,
	        "markedByStaff": false
	    },
	    {
	        "id": 19,
	        "name": "Harvey Evans",
	        "title": "occaecat ullamco reprehenderit veniam nisi aliqua Lorem",
	        "category": 5,
	        "votes": 14,
	        "answers": 24,
	        "views": 325,
	        "submitTime": "2014-01-23T02:25:29",
	        "lastUpdater": "Pope Schwartz",
	        "activeTime": "2014-02-14T12:24:00",
	        "isAnswered": false,
	        "markedByStaff": false
	    },
	    {
	        "id": 20,
	        "name": "Stanton Ratliff",
	        "title": "aute cillum qui ex dolor ut ad",
	        "category": 1,
	        "votes": 15,
	        "answers": 17,
	        "views": 370,
	        "submitTime": "2014-03-17T14:46:04",
	        "lastUpdater": "Estela Patton",
	        "activeTime": "2014-02-16T04:05:25",
	        "isAnswered": true,
	        "markedByStaff": true
	    },
	    {
	        "id": 21,
	        "name": "Dillard Keith",
	        "title": "excepteur velit cillum sint dolore ipsum pariatur",
	        "category": 4,
	        "votes": 9,
	        "answers": 10,
	        "views": 119,
	        "submitTime": "2014-03-21T15:43:20",
	        "lastUpdater": "Betsy Skinner",
	        "activeTime": "2014-05-23T19:00:37",
	        "isAnswered": false,
	        "markedByStaff": true
	    },
	    {
	        "id": 22,
	        "name": "Fuentes Winters",
	        "title": "quis nulla voluptate sit voluptate id non",
	        "category": 2,
	        "votes": 7,
	        "answers": 21,
	        "views": 281,
	        "submitTime": "2014-02-21T10:02:06",
	        "lastUpdater": "Huber Holland",
	        "activeTime": "2014-05-04T00:44:44",
	        "isAnswered": false,
	        "markedByStaff": false
	    },
	    {
	        "id": 23,
	        "name": "Church Gibson",
	        "title": "ex aute laboris duis aliquip aute commodo",
	        "category": 7,
	        "votes": 16,
	        "answers": 19,
	        "views": 5,
	        "submitTime": "2014-03-11T03:13:51",
	        "lastUpdater": "Brewer Atkins",
	        "activeTime": "2014-02-28T19:27:19",
	        "isAnswered": false,
	        "markedByStaff": false
	    },
	    {
	        "id": 24,
	        "name": "Rhodes Larsen",
	        "title": "nisi laboris reprehenderit pariatur laborum aute et",
	        "category": 5,
	        "votes": 0,
	        "answers": 9,
	        "views": 79,
	        "submitTime": "2014-03-27T06:05:44",
	        "lastUpdater": "Laverne Hendrix",
	        "activeTime": "2014-04-25T12:32:33",
	        "isAnswered": true,
	        "markedByStaff": false
	    },
	    {
	        "id": 25,
	        "name": "Lakeisha Santiago",
	        "title": "duis amet magna ex proident dolor duis",
	        "category": 5,
	        "votes": 1,
	        "answers": 22,
	        "views": 126,
	        "submitTime": "2014-05-23T01:50:24",
	        "lastUpdater": "Daugherty Hammond",
	        "activeTime": "2014-03-07T00:10:01",
	        "isAnswered": false,
	        "markedByStaff": true
	    },
	    {
	        "id": 26,
	        "name": "Virgie Marsh",
	        "title": "laborum culpa voluptate anim duis sunt Lorem",
	        "category": 7,
	        "votes": 15,
	        "answers": 29,
	        "views": 372,
	        "submitTime": "2014-02-01T04:17:28",
	        "lastUpdater": "Michele Garza",
	        "activeTime": "2014-05-10T17:28:08",
	        "isAnswered": false,
	        "markedByStaff": true
	    },
	    {
	        "id": 27,
	        "name": "Sawyer Nixon",
	        "title": "eu ipsum fugiat amet non consequat cillum",
	        "category": 6,
	        "votes": 0,
	        "answers": 2,
	        "views": 204,
	        "submitTime": "2014-03-18T04:22:28",
	        "lastUpdater": "Hayes Dorsey",
	        "activeTime": "2014-01-31T08:50:43",
	        "isAnswered": true,
	        "markedByStaff": false
	    },
	    {
	        "id": 28,
	        "name": "Diann York",
	        "title": "sunt qui velit officia deserunt esse ex",
	        "category": 5,
	        "votes": 17,
	        "answers": 17,
	        "views": 363,
	        "submitTime": "2014-05-20T00:51:27",
	        "lastUpdater": "Nichols Kirby",
	        "activeTime": "2014-01-02T18:59:40",
	        "isAnswered": false,
	        "markedByStaff": false
	    },
	    {
	        "id": 29,
	        "name": "Mcdowell French",
	        "title": "ullamco sint nostrud cupidatat ex tempor est",
	        "category": 4,
	        "votes": 9,
	        "answers": 1,
	        "views": 249,
	        "submitTime": "2014-05-15T03:18:05",
	        "lastUpdater": "Grimes Craft",
	        "activeTime": "2014-02-16T22:05:02",
	        "isAnswered": true,
	        "markedByStaff": true
	    },
	    {
	        "id": 30,
	        "name": "Molly Mckee",
	        "title": "incididunt non aliqua excepteur anim anim voluptate",
	        "category": 4,
	        "votes": 18,
	        "answers": 22,
	        "views": 472,
	        "submitTime": "2014-03-17T21:14:41",
	        "lastUpdater": "George Richards",
	        "activeTime": "2014-03-17T01:12:39",
	        "isAnswered": true,
	        "markedByStaff": true
	    },
	    {
	        "id": 31,
	        "name": "Mccoy Fox",
	        "title": "dolor nulla minim cillum Lorem sint elit",
	        "category": 2,
	        "votes": 12,
	        "answers": 27,
	        "views": 436,
	        "submitTime": "2014-04-16T01:33:39",
	        "lastUpdater": "Miriam Serrano",
	        "activeTime": "2014-02-24T19:03:06",
	        "isAnswered": false,
	        "markedByStaff": false
	    },
	    {
	        "id": 32,
	        "name": "Maryanne Wade",
	        "title": "sunt ea enim anim officia aute pariatur",
	        "category": 3,
	        "votes": 7,
	        "answers": 14,
	        "views": 445,
	        "submitTime": "2014-05-31T22:33:45",
	        "lastUpdater": "Maggie Johnston",
	        "activeTime": "2014-02-18T17:20:18",
	        "isAnswered": false,
	        "markedByStaff": true
	    },
	    {
	        "id": 33,
	        "name": "Latisha Meadows",
	        "title": "cillum sit et dolor veniam magna minim",
	        "category": 6,
	        "votes": 5,
	        "answers": 1,
	        "views": 99,
	        "submitTime": "2014-04-18T02:06:40",
	        "lastUpdater": "Joseph Castillo",
	        "activeTime": "2014-03-02T23:12:48",
	        "isAnswered": true,
	        "markedByStaff": false
	    },
	    {
	        "id": 34,
	        "name": "Mcgee Robinson",
	        "title": "enim laboris ut et mollit occaecat sunt",
	        "category": 3,
	        "votes": 3,
	        "answers": 28,
	        "views": 22,
	        "submitTime": "2014-03-30T07:24:49",
	        "lastUpdater": "Barrett Simpson",
	        "activeTime": "2014-03-31T07:35:40",
	        "isAnswered": false,
	        "markedByStaff": true
	    },
	    {
	        "id": 35,
	        "name": "Shirley Copeland",
	        "title": "et laborum fugiat magna irure nisi anim",
	        "category": 3,
	        "votes": 7,
	        "answers": 6,
	        "views": 253,
	        "submitTime": "2014-04-05T04:46:20",
	        "lastUpdater": "Langley Grant",
	        "activeTime": "2014-04-24T16:01:42",
	        "isAnswered": false,
	        "markedByStaff": false
	    },
	    {
	        "id": 36,
	        "name": "Blackwell Stanley",
	        "title": "ut deserunt anim esse occaecat culpa ex",
	        "category": 5,
	        "votes": 2,
	        "answers": 27,
	        "views": 464,
	        "submitTime": "2014-03-19T23:58:35",
	        "lastUpdater": "Augusta Lara",
	        "activeTime": "2014-02-23T05:09:27",
	        "isAnswered": true,
	        "markedByStaff": true
	    },
	    {
	        "id": 37,
	        "name": "Flynn Mcintyre",
	        "title": "velit tempor exercitation amet dolor est proident",
	        "category": 3,
	        "votes": 17,
	        "answers": 14,
	        "views": 320,
	        "submitTime": "2014-02-16T13:52:28",
	        "lastUpdater": "Petty Solomon",
	        "activeTime": "2014-04-30T16:08:50",
	        "isAnswered": true,
	        "markedByStaff": true
	    },
	    {
	        "id": 38,
	        "name": "Oneill Ewing",
	        "title": "in adipisicing qui laboris minim eiusmod ipsum",
	        "category": 0,
	        "votes": 3,
	        "answers": 10,
	        "views": 309,
	        "submitTime": "2014-05-25T11:49:56",
	        "lastUpdater": "Bell Haney",
	        "activeTime": "2014-01-20T22:10:38",
	        "isAnswered": false,
	        "markedByStaff": false
	    },
	    {
	        "id": 39,
	        "name": "Armstrong Wallace",
	        "title": "Lorem esse culpa aliquip commodo esse fugiat",
	        "category": 3,
	        "votes": 12,
	        "answers": 19,
	        "views": 383,
	        "submitTime": "2014-05-18T20:35:43",
	        "lastUpdater": "Bridget Lyons",
	        "activeTime": "2014-05-16T06:44:06",
	        "isAnswered": true,
	        "markedByStaff": false
	    },
	    {
	        "id": 40,
	        "name": "Julie Perkins",
	        "title": "sunt fugiat proident enim ipsum ullamco id",
	        "category": 6,
	        "votes": 14,
	        "answers": 29,
	        "views": 445,
	        "submitTime": "2014-04-27T23:40:02",
	        "lastUpdater": "Saundra Roman",
	        "activeTime": "2014-04-27T15:55:02",
	        "isAnswered": true,
	        "markedByStaff": true
	    },
	    {
	        "id": 41,
	        "name": "Slater Blackburn",
	        "title": "mollit reprehenderit sunt consectetur pariatur excepteur eiusmod",
	        "category": 1,
	        "votes": 0,
	        "answers": 6,
	        "views": 271,
	        "submitTime": "2014-02-07T23:50:18",
	        "lastUpdater": "Louise Christian",
	        "activeTime": "2014-04-11T21:06:22",
	        "isAnswered": false,
	        "markedByStaff": true
	    },
	    {
	        "id": 42,
	        "name": "Johns Cohen",
	        "title": "nisi reprehenderit minim qui ipsum aliquip incididunt",
	        "category": 7,
	        "votes": 14,
	        "answers": 25,
	        "views": 220,
	        "submitTime": "2014-03-27T17:10:14",
	        "lastUpdater": "Helen Fulton",
	        "activeTime": "2014-04-03T08:02:32",
	        "isAnswered": true,
	        "markedByStaff": true
	    },
	    {
	        "id": 43,
	        "name": "Lula Quinn",
	        "title": "ex exercitation deserunt nulla irure aute occaecat",
	        "category": 3,
	        "votes": 18,
	        "answers": 5,
	        "views": 300,
	        "submitTime": "2014-01-02T06:50:31",
	        "lastUpdater": "Jaime Hewitt",
	        "activeTime": "2014-03-02T19:07:48",
	        "isAnswered": false,
	        "markedByStaff": true
	    },
	    {
	        "id": 44,
	        "name": "Myrtle Sosa",
	        "title": "qui ex sit nisi laboris officia minim",
	        "category": 4,
	        "votes": 8,
	        "answers": 18,
	        "views": 400,
	        "submitTime": "2014-01-18T07:56:24",
	        "lastUpdater": "Spears Gordon",
	        "activeTime": "2014-04-04T08:48:22",
	        "isAnswered": false,
	        "markedByStaff": false
	    },
	    {
	        "id": 45,
	        "name": "Evelyn Wiggins",
	        "title": "anim duis nisi cillum pariatur ipsum nisi",
	        "category": 1,
	        "votes": 14,
	        "answers": 21,
	        "views": 198,
	        "submitTime": "2014-02-16T15:18:16",
	        "lastUpdater": "Padilla Best",
	        "activeTime": "2014-05-24T08:18:48",
	        "isAnswered": false,
	        "markedByStaff": false
	    },
	    {
	        "id": 46,
	        "name": "Rita Jackson",
	        "title": "ea nulla est irure aliqua eu nostrud",
	        "category": 5,
	        "votes": 20,
	        "answers": 28,
	        "views": 202,
	        "submitTime": "2014-04-27T04:54:19",
	        "lastUpdater": "Christy Pitts",
	        "activeTime": "2014-03-07T14:01:41",
	        "isAnswered": true,
	        "markedByStaff": false
	    },
	    {
	        "id": 47,
	        "name": "Pearson Peters",
	        "title": "nisi deserunt voluptate minim tempor deserunt ullamco",
	        "category": 1,
	        "votes": 6,
	        "answers": 23,
	        "views": 285,
	        "submitTime": "2014-03-24T12:53:49",
	        "lastUpdater": "Simone Shaw",
	        "activeTime": "2014-04-17T08:31:25",
	        "isAnswered": false,
	        "markedByStaff": true
	    },
	    {
	        "id": 48,
	        "name": "Hughes Harris",
	        "title": "dolore commodo eiusmod qui anim tempor nostrud",
	        "category": 2,
	        "votes": 11,
	        "answers": 28,
	        "views": 373,
	        "submitTime": "2014-04-05T03:14:14",
	        "lastUpdater": "Maria Snider",
	        "activeTime": "2014-01-26T12:18:05",
	        "isAnswered": false,
	        "markedByStaff": true
	    },
	    {
	        "id": 49,
	        "name": "Crane Brennan",
	        "title": "proident nulla qui culpa nisi cupidatat pariatur",
	        "category": 0,
	        "votes": 20,
	        "answers": 18,
	        "views": 83,
	        "submitTime": "2014-02-20T21:20:10",
	        "lastUpdater": "Clarke Kramer",
	        "activeTime": "2014-05-06T01:11:22",
	        "isAnswered": false,
	        "markedByStaff": true
	    }
	];

	return {
		list: function() {
			return data;
		}
	}
});

app.factory('helpCategoriesResource', function() {
	var data = [
	    {
	        "id": 0,
	        "title": "Design Process",
	        "content": "Learn the full process, from uploading your MOC to creating instruction manuals to using the Lego Designer tool.",
	        "for": "Designers",
	        "entries": 17,
	        "questions": 37
	    },
	    {
	        "id": 1,
	        "title": "Design Contest",
	        "content": "Understand how the MOC Contest works, and how to gain greater exposure.",
	        "for": "Designers",
	        "entries": 8,
	        "questions": 62
	    },
	    {
	        "id": 2,
	        "title": "Selling MOCs",
	        "content": "How to pair up with a seller or designer, and how buyers play a big part in helping them partner up.",
	        "for": "Designers, Sellers, Shoppers",
	        "entries": 12,
	        "questions": 25
	    },
	    {
	        "id": 3,
	        "title": "Shop Management",
	        "content": "How to keep track of your inventory on both the new and the old BrickLink systems.",
	        "for": "Sellers",
	        "entries": 21,
	        "questions": 46
	    },
	    {
	        "id": 4,
	        "title": "Ordering & Shipping",
	        "content": "Learn how to deal with ordering issues and understand how weight and location affects shipping costs.",
	        "for": "Sellers, Shoppers",
	        "entries": 26,
	        "questions": 94
	    },
	    {
	        "id": 5,
	        "title": "Community",
	        "content": "How to positively engage the BrickLink community, and what to do with those who don't.",
	        "for": "Designers, Sellers, Shoppers",
	        "entries": 15,
	        "questions": 20
	    },
	    {
	        "id": 6,
	        "title": "Account & Membership",
	        "content": "Learn how to manage your account, and how to become a seller and/or designer.",
	        "for": "Designers, Sellers, Shoppers",
	        "entries": 6,
	        "questions": 11
	    },
	    {
	        "id": 7,
	        "title": "Rules & Policies",
	        "content": "Guidelines to how BrickLink and MOC Shop operate.",
	        "for": "Designers, Sellers, Shoppers",
	        "entries": 7,
	        "questions": 4
	    }
	];

	return {
		list: function() {
			return data;
		}
	}
});

app.factory('statusResource', function () {

	var data = [
		{id:0,	name:"inbox"},	
		{id:1,	name:"featured"},
		{id:2,	name:"approved"},
		{id:3,	name:"pending"},
		{id:4,	name:"rejected"}
	];
	
	return {
		list: function() {
			return data;
		}
	}
});

/* Catch-all Factory (reduces need for many singular factories) */
app.factory('metaResource', function () {

	var data = [
		{id:0,	contest: "All Black Pieces", title:"The Fail Whale"},
		{id:1,	contest: "25 Piece or Under Club", title:"Hogwarts Castle"},
		{id:2,	contest: "Awesome Contest", title:"This is the Captain Speaking"},
		{id:3,	contest: "Lord of the Rings Theme", title:"The Kingdom of Super Bite-Sized Tiny Little Lego People of Hobbitton"},
		{id:4,	contest: "The Contest to End All Contests", title:"My Little Typewriter"},
		{id:5,	contest: "Designer's Paradise", title:"Tank in Snow"},
		{id:6,	contest: "50 Brick Challenge", title:"The Gray Battalion"},
		{id:7,	contest: "Sweet 16", title:"Shelob"},
		{id:8,	contest: "Europe Challenge", title:"USS Enterprise"},
		{id:9,	contest: "Space Theme", title:"The White Crane"},
		{id:10,	contest: "temp", title:"Mecha of Doom"},
		{id:11,	contest: "temp", title:"R2D2, where are you?"},
		{id:12,	contest: "temp", title:"Crows Landing"},
		{id:13,	contest: "temp", title:"Blockheads"},
		{id:14,	contest: "temp", title:"2001: Space Odyssey"},
		{id:15,	contest: "temp", title:"Bomber Plane"},
		{id:16,	contest: "temp", title:"Assimilation is Inevitable"},
		{id:17,	contest: "temp", title:"Cancer is in my DNA"},
		{id:18,	contest: "temp", title:"Polly wants a cracker!"},
		{id:19,	contest: "temp", title:"Alice in Wonderland"},
	];
	
	return {
		list: function() {
			return data;
		}
	}
});


// =========================================================================================================
//
// JQUERY
//
// =========================================================================================================

$(document).ready(function(){
  
	$('.menu').dropit();

});