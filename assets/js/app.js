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

app.controller('MocController', function($scope, $location, ui, mocResource, tagResource, statusResource, metaResource, commentsResource) {

	$scope.mocs = mocResource.list();
	$scope.statii = statusResource.list();
	
	var id = getIdFromUrl($location);
	$scope.single = ui.findById(mocResource, id);
	$scope.comments = commentsResource.list();
	$scope.myComment = {
		isPublic: false,
		content: ''
	};

	$scope.showTags = true;

	$scope.ui = ui;
	$scope.cr = commentsResource;

	$scope.getRatings = function(id, includeRaters) {
		return mocResource.ratingsById(id, includeRaters);
	};

	$scope.getStatus = function(status) {
		return ui.findAttrById(statusResource, 'name', status);
	};
	$scope.getStatusClass = function(status) {
		return ui.findAttrById(statusResource, 'classname', status);
	};

	$scope.getTitle = function(id) {
		return ui.findAttrById(metaResource, 'title', id);
	};

	$scope.getLink = function(id) {
		return "moc.html#/" + id;
	};

	$scope.getTagNames = function(tags) {
		return tagResource.getTagNames(tags);
	};

	$scope.getMsg = function() {
		if (!$scope.myComment.isPublic) return 'Message will only be visible to other admins';
		else return 'Message will be visible to Designer and to other admins';
	}

	$scope.filterCards = {
		status: 1,
		isFeatured: ''
	};
	$scope.entryOrder = '-ratings';

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

	$scope.getNewContestLink = "contest_entry_edit.html#/-1";

	$scope.filterCards = {
		status: 2
	};
});

app.controller('ContestEntryController', function($scope, $location, ui, mocResource, contestResource, metaResource) {

	$scope.ui = ui;

	var id = getIdFromUrl($location);
	if (id >= 0) {
		$scope.entry = ui.findById(contestResource, id);
		$scope.title = ui.findAttrById(metaResource, 'contest', id);
		$scope.status = ui.findAttrById(contestResource, 'status', id);

		$scope.mocs = mocResource.filterByContestId(id);
		$scope.newedit = 'Edit Contest';
	}
	else {
		$scope.entry = {winners: 3};
		$scope.title = '';
		$scope.status = 0;

		$scope.mocs = [];
		$scope.newedit = 'New Contest';
	}

	$scope.getTitle = function(id) {
		return ui.findAttrById(metaResource, 'title', id);
	};
	$scope.getLink = function(id) {
		return "contest_item.html#/" + id;
	};
	
	$scope.getContestLink = "contest_entry.html#/" + id;
	$scope.getEditLink = "contest_entry_edit.html#/" + id;
});

app.controller('ContestItemController', function($scope, $location, ui, mocResource, tagResource, statusResource, contestResource, metaResource, commentsResource) {

	$scope.ui = ui;
	$scope.cr = commentsResource;

	var id = getIdFromUrl($location);
	$scope.comments = commentsResource.list();
	$scope.myComment = {
		isPublic: false,
		content: ''
	};

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

	$scope.getTagNames = function(tags) {
		return tagResource.getTagNames(tags);
	};

	$scope.getStatus = function(status) {
		return ui.findAttrById(statusResource, 'name', status);
	};
	$scope.getStatusClass = function(status) {
		return ui.findAttrById(statusResource, 'classname', status);
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
	var name = 'Abe Yang';

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
        },
        getDate: function(datetimestr) {
        	return moment(datetimestr).format('ll');
        },
        getTime: function(datetimestr) {
        	return moment(datetimestr).format('h:mm a');
        },
        getDateTime: function(datetimestr) {
        	// return moment(datetimestr).calendar();
        	return this.getDate(datetimestr) + ', ' + this.getTime(datetimestr);
        },
        getMyName: function() {
        	return name;
        },
        lorem: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas sed diam eget risus varius blandit sit amet non magna. Nulla vitae elit libero, a pharetra augue. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Curabitur blandit tempus porttitor.'
	}
});

app.factory('mocResource', function () {

	// http://www.json-generator.com/
	// isRejected: only useful for "display-only" purposes
	/*
		[
		    '{{repeat(20)}}',
		    {
		        id: '{{index()}}',
		        name: '{{firstName()}} {{surname()}}',
		        ratings: '{{integer(0, 5)}}',
		        raters: '{{integer(1, 200)}}',
		        issues: '{{integer(0, 10)}}',
                comments: '{{integer(0, 10)}}',
		        fee: '{{integer(0, 5)}}',
		        parts: '{{integer(1, 100)}}',
		        submitTime: '{{date(new Date(2014, 0, 1), new Date(), "YYYY-MM-ddThh:mm:ss")}}',
		        status: '{{integer(0, 4)}}',
		        isRejected: '{{bool()}}',
		        isFeatured: '{{bool()}}',
		        isPinned: '{{bool()}}',
		        tags: [
		            '{{repeat(1,5)}}',
		            '{{integer(0, 20)}}'
		        ],
		        contest: '{{integer(0, 9)}}',
		        votes: '{{integer(0, 30)}}',
		        stores: '{{integer(0, 15)}}'
		    }
		]
	*/

	var data = [
	  {
	    "id": 0,
	    "name": "Welch Blake",
	    "ratings": 3,
	    "raters": 78,
	    "issues": 0,
	    "comments": 2,
	    "fee": 4,
	    "parts": 62,
	    "submitTime": "2014-02-05T13:23:39",
	    "status": 1,
	    "isRejected": false,
	    "isFeatured": false,
	    "isPinned": false,
	    "tags": [
	      18,
	      4,
	      15,
	      15
	    ],
	    "contest": 0,
	    "votes": 22,
	    "stores": 7
	  },
	  {
	    "id": 1,
	    "name": "Stein Daniel",
	    "ratings": 4,
	    "raters": 128,
	    "issues": 10,
	    "comments": 5,
	    "fee": 0,
	    "parts": 70,
	    "submitTime": "2014-04-04T20:04:03",
	    "status": 1,
	    "isRejected": true,
	    "isFeatured": false,
	    "isPinned": false,
	    "tags": [
	      18
	    ],
	    "contest": 8,
	    "votes": 24,
	    "stores": 9
	  },
	  {
	    "id": 2,
	    "name": "Phelps Coffey",
	    "ratings": 4,
	    "raters": 168,
	    "issues": 0,
	    "comments": 1,
	    "fee": 3,
	    "parts": 6,
	    "submitTime": "2014-02-12T19:48:13",
	    "status": 4,
	    "isRejected": true,
	    "isFeatured": true,
	    "isPinned": false,
	    "tags": [
	      17,
	      15
	    ],
	    "contest": 3,
	    "votes": 22,
	    "stores": 8
	  },
	  {
	    "id": 3,
	    "name": "Ingram Mayo",
	    "ratings": 0,
	    "raters": 102,
	    "issues": 4,
	    "comments": 4,
	    "fee": 1,
	    "parts": 57,
	    "submitTime": "2014-04-07T03:31:12",
	    "status": 2,
	    "isRejected": false,
	    "isFeatured": false,
	    "isPinned": true,
	    "tags": [
	      1,
	      9,
	      1,
	      16,
	      13
	    ],
	    "contest": 0,
	    "votes": 16,
	    "stores": 8
	  },
	  {
	    "id": 4,
	    "name": "Kelley Curry",
	    "ratings": 4,
	    "raters": 125,
	    "issues": 0,
	    "comments": 10,
	    "fee": 1,
	    "parts": 37,
	    "submitTime": "2014-05-01T20:29:29",
	    "status": 3,
	    "isRejected": true,
	    "isFeatured": true,
	    "isPinned": true,
	    "tags": [
	      18
	    ],
	    "contest": 9,
	    "votes": 26,
	    "stores": 12
	  },
	  {
	    "id": 5,
	    "name": "Murphy Estrada",
	    "ratings": 1,
	    "raters": 144,
	    "issues": 1,
	    "comments": 8,
	    "fee": 1,
	    "parts": 68,
	    "submitTime": "2014-01-31T18:35:08",
	    "status": 0,
	    "isRejected": true,
	    "isFeatured": false,
	    "isPinned": false,
	    "tags": [
	      4
	    ],
	    "contest": 6,
	    "votes": 18,
	    "stores": 8
	  },
	  {
	    "id": 6,
	    "name": "Ramsey Morris",
	    "ratings": 5,
	    "raters": 84,
	    "issues": 5,
	    "comments": 0,
	    "fee": 3,
	    "parts": 17,
	    "submitTime": "2014-01-25T16:42:47",
	    "status": 4,
	    "isRejected": true,
	    "isFeatured": false,
	    "isPinned": false,
	    "tags": [
	      6,
	      13,
	      17,
	      3,
	      6
	    ],
	    "contest": 1,
	    "votes": 30,
	    "stores": 4
	  },
	  {
	    "id": 7,
	    "name": "Franks Daugherty",
	    "ratings": 4,
	    "raters": 102,
	    "issues": 7,
	    "comments": 4,
	    "fee": 1,
	    "parts": 90,
	    "submitTime": "2014-05-06T03:10:39",
	    "status": 0,
	    "isRejected": false,
	    "isFeatured": false,
	    "isPinned": true,
	    "tags": [
	      16,
	      6,
	      19,
	      1
	    ],
	    "contest": 4,
	    "votes": 15,
	    "stores": 10
	  },
	  {
	    "id": 8,
	    "name": "Kaufman Good",
	    "ratings": 5,
	    "raters": 127,
	    "issues": 8,
	    "comments": 0,
	    "fee": 1,
	    "parts": 92,
	    "submitTime": "2014-02-25T12:06:02",
	    "status": 3,
	    "isRejected": false,
	    "isFeatured": false,
	    "isPinned": false,
	    "tags": [
	      7,
	      7
	    ],
	    "contest": 3,
	    "votes": 18,
	    "stores": 1
	  },
	  {
	    "id": 9,
	    "name": "Hooper Holland",
	    "ratings": 2,
	    "raters": 14,
	    "issues": 5,
	    "comments": 4,
	    "fee": 0,
	    "parts": 85,
	    "submitTime": "2014-02-27T06:32:00",
	    "status": 4,
	    "isRejected": false,
	    "isFeatured": true,
	    "isPinned": true,
	    "tags": [
	      10,
	      3
	    ],
	    "contest": 3,
	    "votes": 26,
	    "stores": 7
	  },
	  {
	    "id": 10,
	    "name": "Neal Keller",
	    "ratings": 3,
	    "raters": 76,
	    "issues": 7,
	    "comments": 8,
	    "fee": 5,
	    "parts": 47,
	    "submitTime": "2014-01-31T21:54:00",
	    "status": 2,
	    "isRejected": true,
	    "isFeatured": true,
	    "isPinned": true,
	    "tags": [
	      5,
	      8
	    ],
	    "contest": 7,
	    "votes": 17,
	    "stores": 11
	  },
	  {
	    "id": 11,
	    "name": "Colette Kirby",
	    "ratings": 1,
	    "raters": 95,
	    "issues": 1,
	    "comments": 5,
	    "fee": 4,
	    "parts": 76,
	    "submitTime": "2014-06-13T22:05:06",
	    "status": 2,
	    "isRejected": true,
	    "isFeatured": false,
	    "isPinned": false,
	    "tags": [
	      1,
	      9
	    ],
	    "contest": 0,
	    "votes": 23,
	    "stores": 8
	  },
	  {
	    "id": 12,
	    "name": "Arlene Mcclain",
	    "ratings": 1,
	    "raters": 115,
	    "issues": 4,
	    "comments": 10,
	    "fee": 2,
	    "parts": 98,
	    "submitTime": "2014-06-18T18:11:50",
	    "status": 3,
	    "isRejected": true,
	    "isFeatured": false,
	    "isPinned": false,
	    "tags": [
	      4,
	      0
	    ],
	    "contest": 9,
	    "votes": 30,
	    "stores": 7
	  },
	  {
	    "id": 13,
	    "name": "Sheila Hinton",
	    "ratings": 5,
	    "raters": 114,
	    "issues": 3,
	    "comments": 9,
	    "fee": 3,
	    "parts": 52,
	    "submitTime": "2014-03-22T21:25:27",
	    "status": 1,
	    "isRejected": false,
	    "isFeatured": true,
	    "isPinned": true,
	    "tags": [
	      16,
	      6,
	      3
	    ],
	    "contest": 9,
	    "votes": 7,
	    "stores": 15
	  },
	  {
	    "id": 14,
	    "name": "Cecelia Haley",
	    "ratings": 5,
	    "raters": 109,
	    "issues": 4,
	    "comments": 10,
	    "fee": 3,
	    "parts": 45,
	    "submitTime": "2014-06-09T12:19:11",
	    "status": 3,
	    "isRejected": true,
	    "isFeatured": false,
	    "isPinned": true,
	    "tags": [
	      9,
	      16
	    ],
	    "contest": 3,
	    "votes": 14,
	    "stores": 10
	  },
	  {
	    "id": 15,
	    "name": "Allen Guy",
	    "ratings": 0,
	    "raters": 39,
	    "issues": 10,
	    "comments": 3,
	    "fee": 4,
	    "parts": 71,
	    "submitTime": "2014-04-03T08:47:10",
	    "status": 3,
	    "isRejected": false,
	    "isFeatured": false,
	    "isPinned": true,
	    "tags": [
	      19,
	      20,
	      1,
	      20
	    ],
	    "contest": 5,
	    "votes": 3,
	    "stores": 4
	  },
	  {
	    "id": 16,
	    "name": "Ray Odonnell",
	    "ratings": 0,
	    "raters": 86,
	    "issues": 5,
	    "comments": 2,
	    "fee": 4,
	    "parts": 78,
	    "submitTime": "2014-01-11T11:48:32",
	    "status": 1,
	    "isRejected": false,
	    "isFeatured": true,
	    "isPinned": true,
	    "tags": [
	      18,
	      18,
	      13,
	      4
	    ],
	    "contest": 0,
	    "votes": 22,
	    "stores": 1
	  },
	  {
	    "id": 17,
	    "name": "Kerr Bauer",
	    "ratings": 1,
	    "raters": 92,
	    "issues": 9,
	    "comments": 2,
	    "fee": 1,
	    "parts": 75,
	    "submitTime": "2014-04-22T08:33:51",
	    "status": 2,
	    "isRejected": false,
	    "isFeatured": false,
	    "isPinned": false,
	    "tags": [
	      1,
	      2,
	      3,
	      19,
	      7
	    ],
	    "contest": 4,
	    "votes": 4,
	    "stores": 0
	  },
	  {
	    "id": 18,
	    "name": "Kathy Bean",
	    "ratings": 4,
	    "raters": 35,
	    "issues": 0,
	    "comments": 1,
	    "fee": 2,
	    "parts": 15,
	    "submitTime": "2014-05-31T14:32:25",
	    "status": 0,
	    "isRejected": true,
	    "isFeatured": true,
	    "isPinned": false,
	    "tags": [
	      15,
	      5,
	      0,
	      15,
	      16
	    ],
	    "contest": 3,
	    "votes": 13,
	    "stores": 3
	  },
	  {
	    "id": 19,
	    "name": "Potter Dunlap",
	    "ratings": 0,
	    "raters": 30,
	    "issues": 10,
	    "comments": 2,
	    "fee": 2,
	    "parts": 36,
	    "submitTime": "2014-02-02T14:29:25",
	    "status": 1,
	    "isRejected": true,
	    "isFeatured": true,
	    "isPinned": false,
	    "tags": [
	      15
	    ],
	    "contest": 5,
	    "votes": 13,
	    "stores": 7
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
        ratingsById: function(id, includeRaters) {
        	if (_.isUndefined(includeRaters)) includeRaters = true;
        	
        	var moc = this.findById(id);
        	var html = '';
            if (moc.raters) {
            	for (var i=1; i<=5; i++) {
            		if (moc.ratings >= i) html += '<i class="fa fa-star"></i>';
            		else html += '<i class="fa fa-star-o"></i>';
            	}
            	// @todo should use an actual circle graphic instead of parens ()
            	if (includeRaters) html += ' (' + moc.raters + ')';
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
		findById: function(id) {
			return _.find(data, function (tag) {
                return tag.id == id;
            });
		},
		findNameById: function(id) {
			var t = this.findById(id);            
            return t.tagname;
        },
        findCountById: function(id) {
            var t = this.findById(id);
            return t.count;
        },
        maxCount: function() {
        	var t = _.max(data, function(tag){ return tag.count; });
        	return t.count;
        },
        getTagNames: function(tags) {
        	// tags is an array of tag id's

        	if (!tags.length) return;	// if tag is empty, return nothing

        	var html = '<ul>Tag';
        	if (tags.length > 1) html += 's';	// pluralize 'tag'

        	_.each(tags, function(id) {
        		var count = this.findCountById(id);
        		html += '<li><a href="tag.html#/' + id + '"><span class="right">' + count + '</span>' + this.findNameById(id) + '</a></li>';
	        }, this);

        	html += '</ul>'
        	return html;
        }
	}
});

app.factory('contestResource', function() {
	// http://www.json-generator.com/
	// @todo: need status 
	// status: 0=draft, 1=scheduled, 2=new(accepting mocs), 3=pending(receiving votes), 4=expired
	/*
	[
	    '{{repeat(10)}}',
	    {
	        id: '{{index()}}',
	        entries: '{{integer(1, 200)}}',
	        votes: '{{integer(1, 100)}}',
	        views: '{{integer(1, 500)}}',
	        prize1: '{{lorem(1, "sentences")}}',
	        prize2: '{{lorem(1, "sentences")}}',
	        prize3: '{{lorem(1, "sentences")}}',
	        startDate: '{{date(new Date(2014, 0, 1), new Date(), "YYYY-MM-dd")}}',
	        duration: '{{integer(1, 30)}}',
	        daysleft: '{{integer(1, 20)}}',
	        winners: '{{integer(1, 3)}}',
	        status: '{{integer(0, 4)}}'
	    }
	]
	*/

	var data = [
	  {
	    "id": 0,
	    "entries": 57,
	    "votes": 42,
	    "views": 447,
	    "prize1": "Nostrud et veniam elit commodo ex.",
	    "prize2": "Nostrud tempor elit nulla dolore amet cillum sint deserunt excepteur sunt proident sunt cillum adipisicing.",
	    "prize3": "Incididunt nostrud aliquip sit adipisicing proident qui nulla laboris incididunt ut proident est magna.",
	    "startDate": "2014-04-21",
	    "duration": 5,
	    "daysleft": 13,
	    "winners": 3,
	    "status": 4
	  },
	  {
	    "id": 1,
	    "entries": 194,
	    "votes": 83,
	    "views": 310,
	    "prize1": "Ipsum ex sit aute magna nostrud nulla.",
	    "prize2": "Ea dolore incididunt minim nostrud ex nisi adipisicing excepteur non.",
	    "prize3": "Laborum est nisi eiusmod velit.",
	    "startDate": "2014-02-28",
	    "duration": 19,
	    "daysleft": 1,
	    "winners": 2,
	    "status": 0
	  },
	  {
	    "id": 2,
	    "entries": 78,
	    "votes": 53,
	    "views": 181,
	    "prize1": "Incididunt eiusmod id adipisicing voluptate est velit velit voluptate proident cillum eu laborum laboris.",
	    "prize2": "Esse irure adipisicing magna magna nostrud consectetur dolore officia occaecat voluptate do amet mollit veniam.",
	    "prize3": "Pariatur cillum nostrud voluptate in.",
	    "startDate": "2014-02-20",
	    "duration": 15,
	    "daysleft": 6,
	    "winners": 2,
	    "status": 3
	  },
	  {
	    "id": 3,
	    "entries": 63,
	    "votes": 40,
	    "views": 349,
	    "prize1": "Deserunt velit consequat mollit in nulla nostrud minim culpa quis id ullamco.",
	    "prize2": "Id ex consectetur et fugiat laboris aliquip ullamco et id aliquip commodo proident.",
	    "prize3": "Anim deserunt magna quis irure do enim eiusmod laboris nostrud labore ex irure labore.",
	    "startDate": "2014-05-08",
	    "duration": 24,
	    "daysleft": 16,
	    "winners": 1,
	    "status": 2
	  },
	  {
	    "id": 4,
	    "entries": 80,
	    "votes": 63,
	    "views": 53,
	    "prize1": "Cupidatat ad sit et culpa quis esse nulla nostrud aute amet.",
	    "prize2": "Consequat do aliquip esse labore.",
	    "prize3": "Dolore sunt aliquip ut ex.",
	    "startDate": "2014-02-09",
	    "duration": 18,
	    "daysleft": 9,
	    "winners": 3,
	    "status": 4
	  },
	  {
	    "id": 5,
	    "entries": 30,
	    "votes": 97,
	    "views": 279,
	    "prize1": "Qui laboris ad amet nostrud commodo.",
	    "prize2": "Veniam ipsum enim proident eu reprehenderit magna Lorem deserunt reprehenderit dolor est sit.",
	    "prize3": "Excepteur dolor consectetur incididunt sunt aute eu voluptate qui veniam.",
	    "startDate": "2014-01-14",
	    "duration": 25,
	    "daysleft": 8,
	    "winners": 2,
	    "status": 4
	  },
	  {
	    "id": 6,
	    "entries": 52,
	    "votes": 92,
	    "views": 370,
	    "prize1": "Adipisicing do proident nostrud enim adipisicing cillum ut reprehenderit id consectetur duis ut exercitation elit.",
	    "prize2": "Exercitation est laboris laboris ea officia quis elit pariatur amet exercitation nostrud cillum ut dolor.",
	    "prize3": "Aliqua voluptate duis officia ullamco anim adipisicing exercitation adipisicing aute proident ea occaecat.",
	    "startDate": "2014-01-16",
	    "duration": 21,
	    "daysleft": 10,
	    "winners": 1,
	    "status": 3
	  },
	  {
	    "id": 7,
	    "entries": 37,
	    "votes": 91,
	    "views": 62,
	    "prize1": "Adipisicing ut ex sit ad magna veniam sit esse ea elit.",
	    "prize2": "Cupidatat elit consequat velit consequat culpa labore excepteur ad occaecat.",
	    "prize3": "Consectetur nostrud eiusmod adipisicing minim ipsum id voluptate proident cillum dolore.",
	    "startDate": "2014-05-15",
	    "duration": 2,
	    "daysleft": 19,
	    "winners": 3,
	    "status": 4
	  },
	  {
	    "id": 8,
	    "entries": 140,
	    "votes": 95,
	    "views": 468,
	    "prize1": "Culpa eu magna eu esse qui.",
	    "prize2": "Non anim deserunt Lorem aliquip non duis est laboris enim.",
	    "prize3": "Ut esse adipisicing duis elit Lorem enim ipsum Lorem incididunt sit proident nulla nostrud dolor.",
	    "startDate": "2014-06-23",
	    "duration": 30,
	    "daysleft": 15,
	    "winners": 3,
	    "status": 1
	  },
	  {
	    "id": 9,
	    "entries": 198,
	    "votes": 17,
	    "views": 212,
	    "prize1": "Non excepteur ullamco dolor qui velit.",
	    "prize2": "Lorem ipsum laboris sit proident irure proident mollit non labore commodo consectetur.",
	    "prize3": "Ut voluptate sunt aute fugiat mollit ea amet proident id nostrud anim nisi.",
	    "startDate": "2014-05-29",
	    "duration": 4,
	    "daysleft": 5,
	    "winners": 2,
	    "status": 4
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
		{id:0,	name:"Display Only",		classname:"display"},
		{id:1,	name:"Awaiting Approval",	classname:"pending"},
		{id:2,	name:"Ready For Sale",		classname:"sale"},
		{id:3,	name:"In Stores",			classname:"stores"},
		{id:4,	name:"Banned",				classname:"banned"}
	];
	
	return {
		list: function() {
			return data;
		}
	}
});

app.factory('commentsResource', function () {

	// 'id' here refers to avatar image

	var data = [
		{id:0,	name:"Eunice Kim",	isAdmin:true,	isPublic:false,content: 'Alex, what do you think of this?', status: '', submitTime: "2014-06-19T11:36:02"},
		{id:1,	name:"Alex Nam",	isAdmin:true,	isPublic:true, content: "Hi Designer, have you read our ToS? You know you can't put this up, right?", status: '', submitTime: "2014-06-19T12:13:02"},
		{id:2,	name:"",	isAdmin:false,	isPublic:true, content: "Oh really? No I didn't!", status: '', submitTime: "2014-06-19T13:25:02"},
		{id:0,	name:"Eunice Kim",	isAdmin:true,	isPublic:true, content: "", status: 0, submitTime: "2014-06-19T14:41:02"},
		{id:0,	name:"Eunice Kim",	isAdmin:true,	isPublic:true, content: "We can't approve this because it violates our Terms of Service. Sorry!", status: '', submitTime: "2014-06-19T14:41:02"},
		{id:2,	name:"",	isAdmin:false,	isPublic:true, content: "Nooo! Here, I changed it, look!", status: '', submitTime: "2014-06-19T15:07:02"},
		{id:1,	name:"Alex Nam",	isAdmin:true,	isPublic:true, content: '', status: 2, submitTime: "2014-06-19T15:11:02"},
		{id:1,	name:"Alex Nam",	isAdmin:true,	isPublic:true, content: "Very nice! Approved!", status: '', submitTime: "2014-06-19T15:11:02"}
	];

	var defaultComment = {id:3, name:'Abe Yang', isAdmin:true};
	
	return {
		list: function() {
			return data;
		},
		add: function(obj) {
			obj.submitTime = moment().format();
			data.push(obj);
		},
		addStatus: function(status) {
			var comment = _.clone(defaultComment);
			comment.status = status;
			this.add(comment);
		},
		addComment: function(content, isPublic) {
			var comment = _.clone(defaultComment)
			comment.status = '';
			comment.content = content;
			comment.isPublic = isPublic;
			this.add(comment);
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