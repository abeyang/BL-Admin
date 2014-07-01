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
	
	// placement: only shows when contest has expired
	var popular_moc = mocResource.mostPopular(contest_id);
	$scope.isThisPopular = (popular_moc.id == id);

	$scope.statii = [
		ui.findById(statusResource, 5),
		ui.findById(statusResource, 1),
		ui.findById(statusResource, 6)
	];

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

app.controller('HelpController', function($scope, ui, helpCategoriesResource) {

	$scope.ui = ui;
	
	$scope.categories = helpCategoriesResource.list();

	$scope.getCategoryLink = function(id) {
		return "helpcenter_topics.html#/" + id;
	};
});

// app.controller('HelpCatController', function($scope, ui, helpCategoriesResource) {

// 	$scope.ui = ui;

// });

app.controller('HelpTopicsController', function($scope, $location, ui, helpCategoriesResource, helpTopicsResource) {

	$scope.ui = ui;

	var id = getIdFromUrl($location);
	$scope.thisCategory = ui.findById(helpCategoriesResource, id);
	
	$scope.topics = helpTopicsResource.list();

	$scope.getTopicsLink = "helpcenter_topics.html#/" + id;
	$scope.getFaqLink = "helpcenter_faq.html#/" + id;
});



// HELPERS

function getIdFromUrl(location) {
	var id = 0;
	if (location.path()) id = location.path().substr(1);		// remove the first character, '/'
	return id;
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
	    "entries": 17,
	    "votes": 47,
	    "views": 268,
	    "prize1": "Ipsum in eu Lorem incididunt ut eu cupidatat nulla consectetur nostrud exercitation eu aute amet.",
	    "prize2": "Mollit mollit laboris officia quis ut.",
	    "prize3": "Quis reprehenderit reprehenderit eiusmod dolore excepteur ad.",
	    "startDate": "2014-03-10",
	    "duration": 30,
	    "daysleft": 2,
	    "winners": 1,
	    "status": 4
	  },
	  {
	    "id": 1,
	    "entries": 145,
	    "votes": 42,
	    "views": 322,
	    "prize1": "Elit sit pariatur et dolor amet nulla cupidatat occaecat.",
	    "prize2": "Proident voluptate eiusmod cillum consectetur consectetur adipisicing sunt consectetur ea sint.",
	    "prize3": "Minim qui elit cillum veniam id occaecat ad officia eiusmod.",
	    "startDate": "2014-03-07",
	    "duration": 25,
	    "daysleft": 3,
	    "winners": 2,
	    "status": 3
	  },
	  {
	    "id": 2,
	    "entries": 77,
	    "votes": 80,
	    "views": 381,
	    "prize1": "Ex do id fugiat in officia mollit eu labore minim.",
	    "prize2": "Ex qui elit qui enim ad cupidatat veniam amet occaecat ad fugiat.",
	    "prize3": "Deserunt reprehenderit incididunt magna magna velit.",
	    "startDate": "2014-03-11",
	    "duration": 9,
	    "daysleft": 10,
	    "winners": 1,
	    "status": 2
	  },
	  {
	    "id": 3,
	    "entries": 149,
	    "votes": 92,
	    "views": 444,
	    "prize1": "Id cupidatat et dolor ipsum.",
	    "prize2": "In aliquip non eiusmod ut velit nisi commodo mollit Lorem laborum.",
	    "prize3": "Adipisicing incididunt officia reprehenderit enim occaecat consequat id labore mollit voluptate nulla.",
	    "startDate": "2014-02-26",
	    "duration": 19,
	    "daysleft": 20,
	    "winners": 1,
	    "status": 3
	  },
	  {
	    "id": 4,
	    "entries": 77,
	    "votes": 51,
	    "views": 477,
	    "prize1": "Fugiat ex ex officia minim ut laboris nostrud aute adipisicing ea cillum laboris.",
	    "prize2": "Reprehenderit tempor adipisicing eiusmod anim commodo duis cillum laboris dolor occaecat.",
	    "prize3": "Quis do non pariatur exercitation in cupidatat quis laboris.",
	    "startDate": "2014-03-02",
	    "duration": 3,
	    "daysleft": 12,
	    "winners": 3,
	    "status": 0
	  },
	  {
	    "id": 5,
	    "entries": 150,
	    "votes": 49,
	    "views": 290,
	    "prize1": "Id reprehenderit incididunt occaecat anim Lorem magna duis.",
	    "prize2": "Occaecat qui enim magna nostrud velit reprehenderit consequat esse voluptate nulla laboris culpa.",
	    "prize3": "Laboris dolore ut et veniam aliqua eu sit tempor irure proident aliquip irure consectetur ex.",
	    "startDate": "2014-06-04",
	    "duration": 26,
	    "daysleft": 5,
	    "winners": 2,
	    "status": 2
	  },
	  {
	    "id": 6,
	    "entries": 164,
	    "votes": 41,
	    "views": 438,
	    "prize1": "Enim sunt ullamco excepteur consectetur enim enim elit non occaecat.",
	    "prize2": "Eu id commodo exercitation commodo adipisicing sunt commodo.",
	    "prize3": "Veniam aute occaecat irure id eu dolore dolor pariatur.",
	    "startDate": "2014-06-20",
	    "duration": 13,
	    "daysleft": 18,
	    "winners": 2,
	    "status": 4
	  },
	  {
	    "id": 7,
	    "entries": 29,
	    "votes": 54,
	    "views": 241,
	    "prize1": "Consequat magna ut nostrud excepteur fugiat esse est.",
	    "prize2": "Minim magna cillum in reprehenderit.",
	    "prize3": "Lorem pariatur sint consectetur quis minim cupidatat est.",
	    "startDate": "2014-03-12",
	    "duration": 17,
	    "daysleft": 17,
	    "winners": 1,
	    "status": 1
	  },
	  {
	    "id": 8,
	    "entries": 131,
	    "votes": 67,
	    "views": 325,
	    "prize1": "Magna proident excepteur nostrud voluptate nostrud deserunt cupidatat nostrud.",
	    "prize2": "Officia culpa minim officia voluptate veniam Lorem aliquip cupidatat.",
	    "prize3": "Esse nostrud enim qui laboris duis culpa pariatur enim irure adipisicing non velit.",
	    "startDate": "2014-01-13",
	    "duration": 18,
	    "daysleft": 3,
	    "winners": 2,
	    "status": 4
	  },
	  {
	    "id": 9,
	    "entries": 27,
	    "votes": 77,
	    "views": 362,
	    "prize1": "Occaecat ex consectetur fugiat ullamco enim.",
	    "prize2": "Ullamco officia sit consequat culpa do quis.",
	    "prize3": "Ipsum cupidatat culpa officia anim officia pariatur qui eiusmod irure.",
	    "startDate": "2014-03-24",
	    "duration": 20,
	    "daysleft": 17,
	    "winners": 2,
	    "status": 0
	  }
	];

	return {
		list: function() {
			return data;
		}
	}
});

app.factory('helpTopicsResource', function() {
	// @todo need to delete (or adjust)
	// http://www.json-generator.com/
	/*
	[
	    '{{repeat(50)}}',
	    {
	        id: '{{index()}}',
	        title: '{{lorem(7, "words")}}',
	        content: '{{lorem(2, "sentences")}}',
	        category: '{{integer(0, 7)}}',
	        comments: '{{integer(1, 30)}}',
	        views: '{{integer(1, 500)}}',
	        submitTime: '{{date(new Date(2014, 0, 1), new Date(), "YYYY-MM-ddThh:mm:ss")}}'
	    }
	]
	*/

	var data = [
	  {
	    "id": 0,
	    "title": "est proident ullamco et consectetur labore occaecat",
	    "content": "Dolore est laborum ad velit consequat amet sunt ex enim cupidatat exercitation. Sit amet proident mollit velit laboris aliqua eiusmod officia.",
	    "category": 2,
	    "comments": 26,
	    "views": 458,
	    "submitTime": "2014-06-15T03:19:49"
	  },
	  {
	    "id": 1,
	    "title": "nulla aute exercitation nisi ullamco in proident",
	    "content": "Velit sit elit tempor eiusmod ea elit deserunt ea velit incididunt deserunt veniam consectetur. Dolor laboris amet non nulla nisi elit nisi ullamco fugiat nisi pariatur nostrud.",
	    "category": 4,
	    "comments": 30,
	    "views": 66,
	    "submitTime": "2014-03-07T03:26:03"
	  },
	  {
	    "id": 2,
	    "title": "magna irure aliqua quis culpa in duis",
	    "content": "Veniam ut aliqua irure amet cupidatat. Ex quis mollit cupidatat ut esse Lorem.",
	    "category": 6,
	    "comments": 12,
	    "views": 421,
	    "submitTime": "2014-02-28T13:01:15"
	  },
	  {
	    "id": 3,
	    "title": "elit dolor ex voluptate laborum sunt esse",
	    "content": "Nostrud eu aliqua ullamco sunt deserunt elit. Et amet et ex ex do mollit ad pariatur cillum eiusmod esse.",
	    "category": 6,
	    "comments": 14,
	    "views": 38,
	    "submitTime": "2014-01-22T22:07:51"
	  },
	  {
	    "id": 4,
	    "title": "do do consectetur nulla occaecat est incididunt",
	    "content": "Dolore velit excepteur aliqua irure. Reprehenderit anim sunt culpa aliquip laboris exercitation consectetur laborum magna.",
	    "category": 7,
	    "comments": 25,
	    "views": 146,
	    "submitTime": "2014-04-01T13:24:59"
	  },
	  {
	    "id": 5,
	    "title": "dolore ea fugiat fugiat proident Lorem quis",
	    "content": "Velit ea esse exercitation eiusmod aute laboris. Occaecat voluptate deserunt exercitation occaecat.",
	    "category": 6,
	    "comments": 3,
	    "views": 206,
	    "submitTime": "2014-05-07T19:19:24"
	  },
	  {
	    "id": 6,
	    "title": "dolore sit culpa cillum velit voluptate magna",
	    "content": "Labore do et laborum ad elit. Et fugiat labore quis duis qui deserunt est ex velit qui et sunt.",
	    "category": 3,
	    "comments": 24,
	    "views": 274,
	    "submitTime": "2014-02-13T21:44:08"
	  },
	  {
	    "id": 7,
	    "title": "non tempor qui elit ad id est",
	    "content": "Est proident ipsum aliqua ad consequat et reprehenderit ullamco et enim quis. Tempor ad qui occaecat ullamco pariatur exercitation excepteur qui quis aliqua consequat.",
	    "category": 2,
	    "comments": 14,
	    "views": 262,
	    "submitTime": "2014-05-15T20:46:16"
	  },
	  {
	    "id": 8,
	    "title": "laboris do cillum proident enim deserunt proident",
	    "content": "Esse id et fugiat laboris ipsum pariatur cupidatat mollit excepteur. Sit cupidatat anim labore ipsum proident proident eiusmod aute.",
	    "category": 1,
	    "comments": 25,
	    "views": 104,
	    "submitTime": "2014-04-19T20:23:01"
	  },
	  {
	    "id": 9,
	    "title": "do elit magna in ad dolore et",
	    "content": "Esse laboris occaecat aliquip ex fugiat Lorem aliquip. Excepteur irure veniam sint exercitation dolore non tempor mollit aute eiusmod sint quis.",
	    "category": 3,
	    "comments": 30,
	    "views": 37,
	    "submitTime": "2014-02-17T16:27:27"
	  },
	  {
	    "id": 10,
	    "title": "cillum sint quis nulla dolor et aliqua",
	    "content": "Laboris incididunt velit proident nulla Lorem commodo amet sint pariatur do est. Consequat duis qui magna duis enim dolor aliqua tempor tempor irure qui voluptate.",
	    "category": 5,
	    "comments": 16,
	    "views": 25,
	    "submitTime": "2014-02-12T19:38:47"
	  },
	  {
	    "id": 11,
	    "title": "non pariatur cupidatat ipsum laboris nostrud dolor",
	    "content": "Duis nostrud sit deserunt magna proident tempor sit aliqua adipisicing. Fugiat culpa aliquip velit aliqua minim sunt laboris do consectetur.",
	    "category": 5,
	    "comments": 10,
	    "views": 456,
	    "submitTime": "2014-03-26T12:27:55"
	  },
	  {
	    "id": 12,
	    "title": "ipsum Lorem ex adipisicing quis mollit nisi",
	    "content": "Mollit laborum non anim deserunt id labore sint nostrud proident aliqua cupidatat duis anim. Eu est enim velit ad duis labore proident ut exercitation.",
	    "category": 6,
	    "comments": 5,
	    "views": 442,
	    "submitTime": "2014-03-19T09:03:38"
	  },
	  {
	    "id": 13,
	    "title": "anim enim fugiat do qui reprehenderit ad",
	    "content": "Non cupidatat fugiat commodo ut Lorem. Dolor amet occaecat dolor aute nisi eiusmod.",
	    "category": 3,
	    "comments": 26,
	    "views": 342,
	    "submitTime": "2014-05-02T00:49:07"
	  },
	  {
	    "id": 14,
	    "title": "officia ullamco ex pariatur in ad consectetur",
	    "content": "Duis veniam tempor ipsum proident consequat consequat culpa nulla. Aute anim minim magna consequat adipisicing qui incididunt.",
	    "category": 0,
	    "comments": 10,
	    "views": 400,
	    "submitTime": "2014-05-28T13:21:46"
	  },
	  {
	    "id": 15,
	    "title": "esse ipsum consectetur aute Lorem do labore",
	    "content": "Fugiat occaecat minim do magna in incididunt et amet dolor irure in eiusmod. Exercitation dolor qui aliqua est veniam deserunt cupidatat dolore commodo.",
	    "category": 0,
	    "comments": 30,
	    "views": 400,
	    "submitTime": "2014-01-01T21:42:12"
	  },
	  {
	    "id": 16,
	    "title": "mollit eu occaecat nostrud cillum mollit ea",
	    "content": "Adipisicing ad sint adipisicing proident aliqua. Occaecat sit ea do aute.",
	    "category": 0,
	    "comments": 27,
	    "views": 312,
	    "submitTime": "2014-04-23T18:09:17"
	  },
	  {
	    "id": 17,
	    "title": "excepteur non cupidatat ad amet ea ea",
	    "content": "Occaecat qui adipisicing voluptate exercitation enim ut adipisicing quis duis. Ad commodo voluptate id ex proident nostrud.",
	    "category": 6,
	    "comments": 18,
	    "views": 36,
	    "submitTime": "2014-02-27T09:47:33"
	  },
	  {
	    "id": 18,
	    "title": "dolor amet quis sint laboris cupidatat sit",
	    "content": "Excepteur culpa qui anim do enim dolore laborum velit. Qui commodo pariatur incididunt cupidatat laboris enim quis labore aliqua nostrud in veniam nulla.",
	    "category": 1,
	    "comments": 29,
	    "views": 307,
	    "submitTime": "2014-02-17T18:58:38"
	  },
	  {
	    "id": 19,
	    "title": "sint et veniam est irure laboris sunt",
	    "content": "Sunt enim elit aute aliqua Lorem labore dolor cupidatat ea mollit enim ex esse. Sint quis officia ad dolore sint elit.",
	    "category": 4,
	    "comments": 2,
	    "views": 389,
	    "submitTime": "2014-06-20T11:59:32"
	  },
	  {
	    "id": 20,
	    "title": "ad culpa aute culpa laborum anim amet",
	    "content": "Minim reprehenderit exercitation cillum aliqua adipisicing voluptate magna anim. Excepteur excepteur Lorem Lorem nulla esse velit.",
	    "category": 0,
	    "comments": 23,
	    "views": 500,
	    "submitTime": "2014-05-02T16:33:00"
	  },
	  {
	    "id": 21,
	    "title": "deserunt sint fugiat labore deserunt id ea",
	    "content": "Dolor pariatur qui ex enim sunt laborum voluptate velit consequat excepteur deserunt cillum. Sint ullamco adipisicing et aliqua ut elit excepteur velit consectetur labore labore nulla.",
	    "category": 0,
	    "comments": 29,
	    "views": 49,
	    "submitTime": "2014-02-24T18:07:10"
	  },
	  {
	    "id": 22,
	    "title": "adipisicing nulla labore ut pariatur eiusmod ut",
	    "content": "Et nisi proident eiusmod officia culpa. Anim Lorem voluptate incididunt proident duis incididunt laborum eiusmod laborum cillum ex nisi sit est.",
	    "category": 7,
	    "comments": 9,
	    "views": 496,
	    "submitTime": "2014-06-27T10:45:03"
	  },
	  {
	    "id": 23,
	    "title": "non eiusmod tempor tempor incididunt in cupidatat",
	    "content": "Occaecat nulla laboris magna laborum mollit cillum et proident id do esse ullamco. Officia ex culpa do ullamco amet aliqua duis ipsum dolor do amet est commodo aliquip.",
	    "category": 1,
	    "comments": 19,
	    "views": 258,
	    "submitTime": "2014-03-11T14:33:20"
	  },
	  {
	    "id": 24,
	    "title": "voluptate duis ipsum tempor eu irure magna",
	    "content": "Voluptate dolor quis sunt sit dolore sint nostrud ullamco cupidatat cupidatat tempor irure. Aute voluptate fugiat exercitation reprehenderit officia id amet irure minim ea minim veniam non enim.",
	    "category": 5,
	    "comments": 5,
	    "views": 201,
	    "submitTime": "2014-05-18T11:08:34"
	  },
	  {
	    "id": 25,
	    "title": "fugiat enim reprehenderit incididunt magna excepteur nulla",
	    "content": "Exercitation irure laborum minim irure cillum aute aliquip magna est Lorem adipisicing Lorem. Adipisicing magna laborum elit adipisicing anim est laborum.",
	    "category": 0,
	    "comments": 17,
	    "views": 259,
	    "submitTime": "2014-05-11T00:58:32"
	  },
	  {
	    "id": 26,
	    "title": "magna laborum mollit sit anim exercitation Lorem",
	    "content": "Dolor mollit nisi nulla deserunt sit dolore dolor do. Reprehenderit deserunt qui incididunt cillum anim deserunt ullamco.",
	    "category": 0,
	    "comments": 2,
	    "views": 211,
	    "submitTime": "2014-04-20T14:42:32"
	  },
	  {
	    "id": 27,
	    "title": "incididunt cupidatat mollit ex labore minim et",
	    "content": "Aliqua est elit occaecat ipsum nisi mollit nostrud ex commodo. Fugiat irure fugiat duis aliquip elit esse.",
	    "category": 2,
	    "comments": 11,
	    "views": 241,
	    "submitTime": "2014-04-26T01:29:54"
	  },
	  {
	    "id": 28,
	    "title": "pariatur eiusmod consectetur consequat minim magna tempor",
	    "content": "Non commodo dolor fugiat anim enim nulla voluptate. In deserunt ea proident consectetur qui anim elit esse.",
	    "category": 5,
	    "comments": 11,
	    "views": 232,
	    "submitTime": "2014-05-17T07:46:42"
	  },
	  {
	    "id": 29,
	    "title": "amet consequat aliquip nisi aliqua quis occaecat",
	    "content": "Nostrud incididunt nulla ipsum nostrud voluptate culpa anim aute. Sint sit magna elit dolor elit velit sit velit culpa proident officia.",
	    "category": 2,
	    "comments": 25,
	    "views": 312,
	    "submitTime": "2014-06-30T10:40:34"
	  },
	  {
	    "id": 30,
	    "title": "nisi laborum do tempor pariatur commodo nisi",
	    "content": "Eu voluptate sunt magna eiusmod nisi cillum non exercitation amet Lorem deserunt. Fugiat nulla aute consequat aliquip quis magna esse.",
	    "category": 4,
	    "comments": 9,
	    "views": 205,
	    "submitTime": "2014-01-07T04:23:33"
	  },
	  {
	    "id": 31,
	    "title": "do ex nostrud occaecat id duis reprehenderit",
	    "content": "Non consectetur nostrud consectetur voluptate eu do laboris. Tempor adipisicing adipisicing incididunt ut pariatur sunt anim incididunt pariatur et aliquip dolor ad.",
	    "category": 2,
	    "comments": 22,
	    "views": 294,
	    "submitTime": "2014-04-07T08:35:00"
	  },
	  {
	    "id": 32,
	    "title": "nostrud magna aliqua id officia fugiat duis",
	    "content": "Ex id dolore elit laboris amet ut mollit eu amet veniam Lorem sit sunt enim. Do duis incididunt qui occaecat dolor commodo ea culpa.",
	    "category": 0,
	    "comments": 13,
	    "views": 317,
	    "submitTime": "2014-04-10T22:37:36"
	  },
	  {
	    "id": 33,
	    "title": "fugiat duis consectetur incididunt ullamco culpa magna",
	    "content": "Deserunt aliqua enim cillum esse. Exercitation elit laboris adipisicing et proident.",
	    "category": 7,
	    "comments": 19,
	    "views": 73,
	    "submitTime": "2014-05-22T11:02:35"
	  },
	  {
	    "id": 34,
	    "title": "ex aliqua amet excepteur id id sint",
	    "content": "Fugiat laborum laboris labore tempor incididunt commodo aliqua ea laborum. Sunt ea voluptate amet qui elit veniam quis adipisicing amet aliqua.",
	    "category": 1,
	    "comments": 18,
	    "views": 80,
	    "submitTime": "2014-02-09T19:58:38"
	  },
	  {
	    "id": 35,
	    "title": "officia officia aliqua esse anim ullamco enim",
	    "content": "Minim commodo do ullamco ut velit nisi aliqua. Proident tempor irure cillum aliqua esse do qui.",
	    "category": 6,
	    "comments": 26,
	    "views": 218,
	    "submitTime": "2014-06-19T10:41:24"
	  },
	  {
	    "id": 36,
	    "title": "cillum amet aliquip pariatur reprehenderit mollit laborum",
	    "content": "Anim ea esse veniam cillum proident aliqua do amet nisi sit laboris. Esse sit labore reprehenderit et minim ipsum ea laborum veniam.",
	    "category": 1,
	    "comments": 16,
	    "views": 361,
	    "submitTime": "2014-01-21T14:55:14"
	  },
	  {
	    "id": 37,
	    "title": "proident aute elit cillum cillum ullamco sit",
	    "content": "Nulla laboris voluptate do laboris nulla est eu consequat. Fugiat eu officia tempor magna anim in est non adipisicing elit.",
	    "category": 5,
	    "comments": 30,
	    "views": 91,
	    "submitTime": "2014-06-25T22:05:37"
	  },
	  {
	    "id": 38,
	    "title": "ad qui amet cupidatat laborum mollit qui",
	    "content": "Esse duis ea officia incididunt. Consequat aliquip pariatur cillum consequat labore cillum.",
	    "category": 6,
	    "comments": 18,
	    "views": 183,
	    "submitTime": "2014-01-15T03:58:49"
	  },
	  {
	    "id": 39,
	    "title": "non est dolor anim ut est nisi",
	    "content": "Esse enim fugiat consequat velit nisi. Do exercitation consequat aliqua eiusmod irure laboris esse enim aliquip.",
	    "category": 0,
	    "comments": 18,
	    "views": 193,
	    "submitTime": "2014-01-22T18:48:42"
	  },
	  {
	    "id": 40,
	    "title": "est dolor velit qui ea aliquip occaecat",
	    "content": "Excepteur et incididunt enim officia amet aliqua deserunt nostrud incididunt ex mollit amet. Ipsum exercitation culpa anim nostrud cillum adipisicing anim consequat.",
	    "category": 5,
	    "comments": 19,
	    "views": 258,
	    "submitTime": "2014-03-29T00:10:58"
	  },
	  {
	    "id": 41,
	    "title": "cupidatat duis minim exercitation Lorem occaecat culpa",
	    "content": "Incididunt sunt nostrud eiusmod officia. Ullamco adipisicing reprehenderit aliquip aliqua velit aute nostrud nostrud do.",
	    "category": 3,
	    "comments": 24,
	    "views": 145,
	    "submitTime": "2014-06-08T03:32:40"
	  },
	  {
	    "id": 42,
	    "title": "exercitation id mollit laboris officia nulla elit",
	    "content": "Non sunt cupidatat aliquip deserunt irure elit excepteur ad consectetur. Proident consectetur sint anim eiusmod occaecat cupidatat nostrud fugiat ut in officia.",
	    "category": 1,
	    "comments": 20,
	    "views": 264,
	    "submitTime": "2014-06-21T12:01:34"
	  },
	  {
	    "id": 43,
	    "title": "consectetur sit dolore mollit cupidatat consectetur cupidatat",
	    "content": "Fugiat id ullamco nulla anim incididunt consectetur. Eiusmod ea do nulla non commodo esse pariatur tempor dolor mollit ex.",
	    "category": 1,
	    "comments": 15,
	    "views": 260,
	    "submitTime": "2014-01-29T08:20:45"
	  },
	  {
	    "id": 44,
	    "title": "ea velit anim labore fugiat cillum exercitation",
	    "content": "Consequat aute qui ex deserunt culpa labore sint Lorem ad eu. Ut sit elit sint fugiat fugiat amet mollit laborum officia sunt sint sunt amet nulla.",
	    "category": 2,
	    "comments": 14,
	    "views": 341,
	    "submitTime": "2014-04-28T18:49:52"
	  },
	  {
	    "id": 45,
	    "title": "aliqua voluptate aliquip aliquip nisi laboris anim",
	    "content": "Cupidatat duis sit eiusmod commodo dolore cillum ullamco Lorem velit. Ex veniam officia labore laborum sunt Lorem dolore cupidatat cillum ex aute cupidatat reprehenderit irure.",
	    "category": 6,
	    "comments": 4,
	    "views": 439,
	    "submitTime": "2014-03-18T15:24:15"
	  },
	  {
	    "id": 46,
	    "title": "magna sunt in enim cillum fugiat et",
	    "content": "Reprehenderit nisi aliquip cupidatat sint in cupidatat ut ut cillum officia enim veniam occaecat. Irure enim sunt laboris occaecat ipsum.",
	    "category": 6,
	    "comments": 26,
	    "views": 261,
	    "submitTime": "2014-06-13T08:25:43"
	  },
	  {
	    "id": 47,
	    "title": "mollit dolor enim aliqua tempor eu enim",
	    "content": "Deserunt est deserunt ipsum incididunt ad laborum. Minim qui et occaecat pariatur quis commodo ut quis nostrud et cupidatat adipisicing quis voluptate.",
	    "category": 3,
	    "comments": 12,
	    "views": 357,
	    "submitTime": "2014-01-17T14:25:09"
	  },
	  {
	    "id": 48,
	    "title": "voluptate tempor sunt anim culpa veniam deserunt",
	    "content": "Enim pariatur veniam elit velit cillum. Sunt consectetur sint qui officia commodo laborum non anim aliquip consectetur eu aliqua nisi.",
	    "category": 7,
	    "comments": 28,
	    "views": 353,
	    "submitTime": "2014-05-24T16:05:38"
	  },
	  {
	    "id": 49,
	    "title": "cupidatat veniam do aliquip magna ullamco id",
	    "content": "Aute reprehenderit et voluptate esse sunt amet culpa ipsum magna duis ut sint nulla ipsum. Velit excepteur ex excepteur enim ad.",
	    "category": 4,
	    "comments": 20,
	    "views": 108,
	    "submitTime": "2014-02-27T17:49:03"
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
	        "topics": 17,
	        "questions": 37
	    },
	    {
	        "id": 1,
	        "title": "Design Contest",
	        "content": "Understand how the MOC Contest works, and how to gain greater exposure.",
	        "for": "Designers",
	        "topics": 8,
	        "questions": 62
	    },
	    {
	        "id": 2,
	        "title": "Selling MOCs",
	        "content": "How to pair up with a seller or designer, and how buyers play a big part in helping them partner up.",
	        "for": "Designers, Sellers, Shoppers",
	        "topics": 12,
	        "questions": 25
	    },
	    {
	        "id": 3,
	        "title": "Shop Management",
	        "content": "How to keep track of your inventory on both the new and the old BrickLink systems.",
	        "for": "Sellers",
	        "topics": 21,
	        "questions": 46
	    },
	    {
	        "id": 4,
	        "title": "Ordering & Shipping",
	        "content": "Learn how to deal with ordering issues and understand how weight and location affects shipping costs.",
	        "for": "Sellers, Shoppers",
	        "topics": 26,
	        "questions": 94
	    },
	    {
	        "id": 5,
	        "title": "Community",
	        "content": "How to positively engage the BrickLink community, and what to do with those who don't.",
	        "for": "Designers, Sellers, Shoppers",
	        "topics": 15,
	        "questions": 20
	    },
	    {
	        "id": 6,
	        "title": "Account & Membership",
	        "content": "Learn how to manage your account, and how to become a seller and/or designer.",
	        "for": "Designers, Sellers, Shoppers",
	        "topics": 6,
	        "questions": 11
	    },
	    {
	        "id": 7,
	        "title": "Rules & Policies",
	        "content": "Guidelines to how BrickLink and MOC Shop operate.",
	        "for": "Designers, Sellers, Shoppers",
	        "topics": 7,
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
		{id:2,	name:"Ready For Sale",		classname:"approved"},
		{id:3,	name:"In Stores",			classname:"approved"},
		{id:4,	name:"Banned",				classname:"rejected"},
		{id:5,	name:"Rejected",			classname:"rejected"},
		{id:6,	name:"Approved",			classname:"approved"}
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
		{id:0,	type:1, name:"Eunice Kim",	isAdmin:true,	isPublic:false,content: 'Alex, what do you think of this?', status: '', submitTime: "2014-06-19T11:36:02"},
		{id:1,	type:1, name:"Alex Nam",	isAdmin:true,	isPublic:true, content: "Hi Designer, have you read our ToS? You know you can't put this up, right?", status: '', submitTime: "2014-06-19T12:13:02"},
		{id:2,	type:1, name:"",	isAdmin:false,	isPublic:true, content: "Oh really? No I didn't!", status: '', submitTime: "2014-06-19T13:25:02"},
		{id:0,	type:1, name:"Eunice Kim",	isAdmin:true,	isPublic:true, content: "", status: 0, submitTime: "2014-06-19T14:41:02"},
		{id:0,	type:1, name:"Eunice Kim",	isAdmin:true,	isPublic:true, content: "We can't approve this because it violates our Terms of Service. Sorry!", status: '', submitTime: "2014-06-19T14:41:02"},
		{id:2,	type:1, name:"",	isAdmin:false,	isPublic:true, content: "Nooo! Here, I changed it, look!", status: '', submitTime: "2014-06-19T15:07:02"},
		{id:1,	type:1, name:"Alex Nam",	isAdmin:true,	isPublic:true, content: '', status: 2, submitTime: "2014-06-19T15:11:02"},
		{id:1,	type:1, name:"Alex Nam",	isAdmin:true,	isPublic:true, content: "Very nice! Approved!", status: '', submitTime: "2014-06-19T15:11:02"},
		{id:8,	type:2, name:"Alice Finch",	isAdmin:true,	isPublic:false, content: "Hmm, I don't know about this MOC", status: '', submitTime: "2014-06-19T15:11:02"}
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
		addStatus: function(status, type) {
			var comment = _.clone(defaultComment);
			comment.status = status;
			comment.type = type;
			this.add(comment);
		},
		addComment: function(content, isPublic, type) {
			var comment = _.clone(defaultComment)
			comment.status = '';
			comment.content = content;
			comment.isPublic = isPublic;
			comment.type = type;
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
  
	// $('.menu').dropit();

});