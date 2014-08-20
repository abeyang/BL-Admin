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

var app = angular.module('app', ['ngSanitize', 'textAngular']);

// CONTROLLERS

/* MOC controller */

app.controller('MocController', function($scope, $location, ui, mocResource, tagResource, statusResource, metaResource) {

	$scope.mocs = mocResource.list();
	$scope.statii = statusResource.list();
	
	var id = getIdFromUrl($location);
	$scope.single = ui.findById(mocResource, id);

	$scope.myComment = {
		isPublic: false,
		content1: '',
		content2: '',
		content3: ''
	};

	$scope.showTags = true;

	$scope.ui = ui;

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

	$scope.numIssues = function() {
		var issues = 0;
		if ($scope.myComment.content1) issues++;
		if ($scope.myComment.content2) issues++;
		if ($scope.myComment.content3) issues++;
		return issues;
	};

	$scope.filterCards = {
		status: 1,
		isFeatured: ''
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

app.controller('ContestController', function($scope, ui, mocResource, metaResource) {

	$scope.ui = ui;
	$scope.mocs = mocResource.list();

	$scope.getTitle = function(id) {
		return ui.findAttrById(metaResource, 'title', id);
	};

	$scope.getLink = function(id) {
		return "contest_item.html#/" + id;
	};
	
	$scope.filterCards = {
		status: 1
	};
});

app.controller('ContestAllController', function($scope, ui, contestResource, metaResource) {

	$scope.ui = ui;
	
	$scope.entries = contestResource.list();

	$scope.getTitle = function(id) {
		return ui.findAttrById(metaResource, 'contest', id);
	};

	$scope.getPrize = function(id, n) {
		var prize = ui.findAttrById(contestResource, 'prize' + n, id);
		if (prize) prize *= 10;
		return prize;
	};

	$scope.selectedContestId = -1;

	$scope.editContest = function(id) {
		window.location.href = "contest_entry_edit.html#/" + id;

		// $scope.selectedContestId = id;

		// if (id >= 0) {
		// 	$scope.title = $scope.getTitle(id);
		// 	$scope.desc = ui.lorem;
		// 	$scope.prize = $scope.getPrize(id);

		// 	$scope.acceptStartDate = new Date(ui.findAttrById(contestResource, 'acceptStartDate', id));
		// 	$scope.acceptEndDate = new Date(ui.findAttrById(contestResource, 'acceptEndDate', id));
		// 	$scope.voteStartDate = new Date(ui.findAttrById(contestResource, 'voteStartDate', id));
		// 	$scope.voteEndDate = new Date(ui.findAttrById(contestResource, 'voteEndDate', id));
		// 	$scope.announceDate = new Date(ui.findAttrById(contestResource, 'announceDate', id));
		// }
		// else {
		// 	$scope.title = $scope.desc = $scope.prize = '';
		// 	$scope.acceptStartDate = $scope.acceptEndDate = $scope.voteStartDate = $scope.voteEndDate = $scope.announceDate = '';
		// }
		
	}
});


app.controller('ContestEntryController', function($scope, $location, ui, contestResource, metaResource) {
// @todo can delete this whole section
	$scope.ui = ui;

	var id = getIdFromUrl($location);
	$scope.id = id;

	$scope.getTitle = function(id) {
		return ui.findAttrById(metaResource, 'contest', id);
	};
	$scope.getLink = function(id) {
		return "contest_item.html#/" + id;
	};
	$scope.getPrize = function(id, n) {
		var prize = ui.findAttrById(contestResource, 'prize' + n, id);
		if (prize) prize *= 10;
		return prize;
	};

	if (id >= 0) {
		$scope.title = $scope.getTitle(id);
		$scope.desc = ui.lorem;
		$scope.prize1 = $scope.getPrize(id, 1);
		$scope.prize2 = $scope.getPrize(id, 2);
		$scope.prize3 = $scope.getPrize(id, 3);

		$scope.acceptStartDate = new Date(ui.findAttrById(contestResource, 'acceptStartDate', id));
		$scope.acceptEndDate = new Date(ui.findAttrById(contestResource, 'acceptEndDate', id));
		$scope.voteStartDate = new Date(ui.findAttrById(contestResource, 'voteStartDate', id));
		$scope.voteEndDate = new Date(ui.findAttrById(contestResource, 'voteEndDate', id));
		$scope.announceDate = new Date(ui.findAttrById(contestResource, 'announceDate', id));

		$scope.newedit = 'Edit Contest';
	}
	else {
		$scope.title = $scope.desc = $scope.prize = '';
		$scope.acceptStartDate = $scope.acceptEndDate = $scope.voteStartDate = $scope.voteEndDate = $scope.announceDate = '';

		$scope.newedit = 'New Contest';
	}
	
	$scope.getContestLink = "contest_entry.html#/" + id;
	$scope.getEditLink = "contest_entry_edit.html#/" + id;
});


app.controller('ContestItemController', function($scope, $location, ui, mocResource, tagResource, statusResource, contestResource, metaResource) {

	$scope.ui = ui;

	var id = getIdFromUrl($location);
	$scope.myComment = {
		isPublic: false,
		content: ''
	};

	$scope.single = ui.findById(mocResource, id);
	$scope.title = ui.findAttrById(metaResource, 'title', id);

	var contest_id = $scope.single.contest;
	$scope.entry = ui.findById(contestResource, contest_id);
	$scope.entry_title = ui.findAttrById(metaResource, 'contest', contest_id);
	// $scope.entry_link = "contest_entry.html#/" + contest_id;

	$scope.getTagNames = function(tags) {
		return tagResource.getTagNames(tags);
	};

	$scope.getStatus = function(status) {
		return ui.findAttrById(statusResource, 'name', status);
	};

	$scope.numIssues = function() {
		var issues = 0;
		if ($scope.myComment.content1) issues++;
		if ($scope.myComment.content2) issues++;
		if ($scope.myComment.content3) issues++;
		return issues;
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

app.controller('HelpTopicsController', function($scope, $location, ui, helpCategoriesResource, helpTopicsResource) {

	$scope.ui = ui;

	var id = getIdFromUrl($location);
	$scope.thisCategory = ui.findById(helpCategoriesResource, id);
	
	$scope.topics = helpTopicsResource.list();

	$scope.getTopicsLink = "helpcenter_topics.html#/" + id;
	$scope.getFaqLink = "helpcenter_faq.html#/" + id;
});

/* Back Office Controller */

app.controller('BackOfficeController', function($scope, ui, backOfficeResource) {

	$scope.ui = ui;
	$scope.bo = backOfficeResource.list();

	$scope.mastercheckbox = false;
	
	$scope.selectedItems = 0;
	$scope.$watch('bo', function(bo){
		var selectedItems = 0;
		angular.forEach(bo, function(item){
	  		selectedItems += item.selected ? 1 : 0;
		})
		$scope.selectedItems = selectedItems;
	}, true);
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
		        issues: '{{integer(0, 3)}}',
                comments: '{{integer(0, 10)}}',
		        fee: '{{integer(0, 5)}}',
		        parts: '{{integer(1, 100)}}',
		        submitTime: '{{date(new Date(2014, 0, 1), new Date(), "YYYY-MM-ddThh:mm:ss")}}',
		        status: '{{integer(0, 4)}}',
		        isRejected: '{{bool()}}',
		        isFeatured: '{{bool()}}',
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
	    "name": "Geneva Powers",
	    "ratings": 4,
	    "raters": 39,
	    "issues": 3,
	    "comments": 2,
	    "fee": 5,
	    "parts": 17,
	    "submitTime": "2014-01-20T03:38:53",
	    "status": 2,
	    "isRejected": false,
	    "isFeatured": false,
	    "tags": [
	      5,
	      20,
	      3,
	      4,
	      5
	    ],
	    "contest": 5,
	    "votes": 20,
	    "stores": 10
	  },
	  {
	    "id": 1,
	    "name": "Christa Larsen",
	    "ratings": 3,
	    "raters": 146,
	    "issues": 2,
	    "comments": 2,
	    "fee": 1,
	    "parts": 63,
	    "submitTime": "2014-07-12T14:14:05",
	    "status": 1,
	    "isRejected": true,
	    "isFeatured": false,
	    "tags": [
	      5
	    ],
	    "contest": 3,
	    "votes": 13,
	    "stores": 12
	  },
	  {
	    "id": 2,
	    "name": "Faulkner Levy",
	    "ratings": 3,
	    "raters": 47,
	    "issues": 1,
	    "comments": 7,
	    "fee": 5,
	    "parts": 3,
	    "submitTime": "2014-06-10T15:51:46",
	    "status": 0,
	    "isRejected": false,
	    "isFeatured": false,
	    "tags": [
	      11,
	      17,
	      4,
	      2,
	      6
	    ],
	    "contest": 3,
	    "votes": 27,
	    "stores": 6
	  },
	  {
	    "id": 3,
	    "name": "Daphne Perry",
	    "ratings": 0,
	    "raters": 71,
	    "issues": 3,
	    "comments": 7,
	    "fee": 1,
	    "parts": 10,
	    "submitTime": "2014-02-16T16:55:33",
	    "status": 2,
	    "isRejected": false,
	    "isFeatured": true,
	    "tags": [
	      15,
	      9,
	      4,
	      20
	    ],
	    "contest": 1,
	    "votes": 14,
	    "stores": 6
	  },
	  {
	    "id": 4,
	    "name": "Bishop Bender",
	    "ratings": 1,
	    "raters": 76,
	    "issues": 3,
	    "comments": 4,
	    "fee": 4,
	    "parts": 93,
	    "submitTime": "2014-07-30T14:19:37",
	    "status": 1,
	    "isRejected": false,
	    "isFeatured": true,
	    "tags": [
	      2,
	      16,
	      20
	    ],
	    "contest": 2,
	    "votes": 18,
	    "stores": 4
	  },
	  {
	    "id": 5,
	    "name": "Douglas Carey",
	    "ratings": 3,
	    "raters": 90,
	    "issues": 3,
	    "comments": 9,
	    "fee": 5,
	    "parts": 90,
	    "submitTime": "2014-01-22T22:33:40",
	    "status": 3,
	    "isRejected": true,
	    "isFeatured": true,
	    "tags": [
	      9,
	      4,
	      5,
	      13
	    ],
	    "contest": 6,
	    "votes": 28,
	    "stores": 4
	  },
	  {
	    "id": 6,
	    "name": "Odessa Rodriquez",
	    "ratings": 3,
	    "raters": 26,
	    "issues": 2,
	    "comments": 0,
	    "fee": 0,
	    "parts": 79,
	    "submitTime": "2014-05-05T05:31:12",
	    "status": 2,
	    "isRejected": true,
	    "isFeatured": false,
	    "tags": [
	      11,
	      7,
	      14,
	      0,
	      15
	    ],
	    "contest": 7,
	    "votes": 29,
	    "stores": 1
	  },
	  {
	    "id": 7,
	    "name": "Sofia Hubbard",
	    "ratings": 0,
	    "raters": 31,
	    "issues": 1,
	    "comments": 0,
	    "fee": 2,
	    "parts": 29,
	    "submitTime": "2014-03-11T18:06:51",
	    "status": 0,
	    "isRejected": false,
	    "isFeatured": true,
	    "tags": [
	      12
	    ],
	    "contest": 5,
	    "votes": 30,
	    "stores": 8
	  },
	  {
	    "id": 8,
	    "name": "Sonja Head",
	    "ratings": 1,
	    "raters": 128,
	    "issues": 0,
	    "comments": 2,
	    "fee": 5,
	    "parts": 60,
	    "submitTime": "2014-04-10T11:04:34",
	    "status": 0,
	    "isRejected": true,
	    "isFeatured": true,
	    "tags": [
	      6,
	      4,
	      18,
	      16,
	      16
	    ],
	    "contest": 9,
	    "votes": 28,
	    "stores": 15
	  },
	  {
	    "id": 9,
	    "name": "Clare Farley",
	    "ratings": 4,
	    "raters": 160,
	    "issues": 0,
	    "comments": 3,
	    "fee": 3,
	    "parts": 74,
	    "submitTime": "2014-07-16T19:55:48",
	    "status": 0,
	    "isRejected": true,
	    "isFeatured": true,
	    "tags": [
	      2,
	      7,
	      20,
	      2,
	      16
	    ],
	    "contest": 6,
	    "votes": 1,
	    "stores": 7
	  },
	  {
	    "id": 10,
	    "name": "Marguerite Smith",
	    "ratings": 3,
	    "raters": 110,
	    "issues": 2,
	    "comments": 5,
	    "fee": 3,
	    "parts": 28,
	    "submitTime": "2014-02-27T01:36:20",
	    "status": 0,
	    "isRejected": false,
	    "isFeatured": true,
	    "tags": [
	      2
	    ],
	    "contest": 0,
	    "votes": 4,
	    "stores": 10
	  },
	  {
	    "id": 11,
	    "name": "Aimee Moses",
	    "ratings": 4,
	    "raters": 69,
	    "issues": 2,
	    "comments": 6,
	    "fee": 4,
	    "parts": 70,
	    "submitTime": "2014-07-27T14:55:12",
	    "status": 2,
	    "isRejected": false,
	    "isFeatured": true,
	    "tags": [
	      5,
	      0,
	      20,
	      11
	    ],
	    "contest": 9,
	    "votes": 21,
	    "stores": 14
	  },
	  {
	    "id": 12,
	    "name": "Rose Holloway",
	    "ratings": 2,
	    "raters": 24,
	    "issues": 1,
	    "comments": 2,
	    "fee": 2,
	    "parts": 11,
	    "submitTime": "2014-01-02T23:07:32",
	    "status": 4,
	    "isRejected": true,
	    "isFeatured": true,
	    "tags": [
	      9,
	      7
	    ],
	    "contest": 0,
	    "votes": 6,
	    "stores": 4
	  },
	  {
	    "id": 13,
	    "name": "Booker Guerra",
	    "ratings": 4,
	    "raters": 55,
	    "issues": 2,
	    "comments": 1,
	    "fee": 1,
	    "parts": 35,
	    "submitTime": "2014-02-06T20:58:49",
	    "status": 4,
	    "isRejected": false,
	    "isFeatured": false,
	    "tags": [
	      4,
	      14,
	      2,
	      10
	    ],
	    "contest": 6,
	    "votes": 24,
	    "stores": 7
	  },
	  {
	    "id": 14,
	    "name": "Ina Mcneil",
	    "ratings": 0,
	    "raters": 94,
	    "issues": 2,
	    "comments": 7,
	    "fee": 1,
	    "parts": 50,
	    "submitTime": "2014-04-09T01:32:59",
	    "status": 3,
	    "isRejected": false,
	    "isFeatured": true,
	    "tags": [
	      13
	    ],
	    "contest": 2,
	    "votes": 1,
	    "stores": 5
	  },
	  {
	    "id": 15,
	    "name": "Patrica Ramos",
	    "ratings": 3,
	    "raters": 75,
	    "issues": 3,
	    "comments": 9,
	    "fee": 3,
	    "parts": 48,
	    "submitTime": "2014-07-01T22:21:32",
	    "status": 3,
	    "isRejected": true,
	    "isFeatured": false,
	    "tags": [
	      5,
	      5
	    ],
	    "contest": 4,
	    "votes": 29,
	    "stores": 6
	  },
	  {
	    "id": 16,
	    "name": "Buckley Newman",
	    "ratings": 5,
	    "raters": 30,
	    "issues": 3,
	    "comments": 7,
	    "fee": 5,
	    "parts": 57,
	    "submitTime": "2014-05-30T16:53:54",
	    "status": 0,
	    "isRejected": false,
	    "isFeatured": true,
	    "tags": [
	      19,
	      15,
	      6,
	      19,
	      4
	    ],
	    "contest": 7,
	    "votes": 15,
	    "stores": 6
	  },
	  {
	    "id": 17,
	    "name": "Moss Bates",
	    "ratings": 4,
	    "raters": 125,
	    "issues": 2,
	    "comments": 0,
	    "fee": 4,
	    "parts": 71,
	    "submitTime": "2014-07-21T15:34:56",
	    "status": 4,
	    "isRejected": true,
	    "isFeatured": true,
	    "tags": [
	      16,
	      3,
	      10,
	      10,
	      12
	    ],
	    "contest": 6,
	    "votes": 6,
	    "stores": 12
	  },
	  {
	    "id": 18,
	    "name": "Marisol Hale",
	    "ratings": 2,
	    "raters": 41,
	    "issues": 3,
	    "comments": 1,
	    "fee": 4,
	    "parts": 54,
	    "submitTime": "2014-08-06T13:28:38",
	    "status": 1,
	    "isRejected": true,
	    "isFeatured": true,
	    "tags": [
	      16,
	      10,
	      8,
	      0
	    ],
	    "contest": 8,
	    "votes": 21,
	    "stores": 13
	  },
	  {
	    "id": 19,
	    "name": "Donaldson Miranda",
	    "ratings": 2,
	    "raters": 97,
	    "issues": 1,
	    "comments": 8,
	    "fee": 5,
	    "parts": 79,
	    "submitTime": "2014-01-18T02:18:43",
	    "status": 4,
	    "isRejected": false,
	    "isFeatured": false,
	    "tags": [
	      20,
	      20,
	      15,
	      13
	    ],
	    "contest": 4,
	    "votes": 8,
	    "stores": 3
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
	        isActive: '{{bool()}}',
	        prize1: '{{integer(15, 30)}}',
	        prize2: '{{integer(7, 15)}}',
	        prize3: '{{integer(1, 7)}}',
	        entries: '{{integer(1, 200)}}',
	        votes: '{{integer(1, 100)}}',
	        views: '{{integer(1, 500)}}',
	        acceptStartDate: '{{date(new Date(2014, 0, 1), new Date(), "YYYY-MM-ddThh:mm:ss")}}',
	        acceptEndDate: '{{date(new Date(2014, 1, 1), new Date(), "YYYY-MM-ddThh:mm:ss")}}',
	        voteStartDate: '{{date(new Date(2014, 1, 1), new Date(), "YYYY-MM-ddThh:mm:ss")}}',
	        voteEndDate: '{{date(new Date(2014, 2, 1), new Date(), "YYYY-MM-ddThh:mm:ss")}}',
	        announceDate: '{{date(new Date(2014, 3, 1), new Date(), "YYYY-MM-ddThh:mm:ss")}}'
	    }
	]
	*/

	var data = [
	  {
	    "id": 0,
	    "isActive": true,
	    "prize1": 21,
	    "prize2": 14,
	    "prize3": 5,
	    "entries": 169,
	    "votes": 26,
	    "views": 186,
	    "acceptStartDate": "2014-04-11T00:25:25",
	    "acceptEndDate": "2014-05-23T23:28:36",
	    "voteStartDate": "2014-07-23T16:59:28",
	    "voteEndDate": "2014-03-31T05:44:31",
	    "announceDate": "2014-04-20T12:43:41"
	  },
	  {
	    "id": 1,
	    "isActive": false,
	    "prize1": 19,
	    "prize2": 8,
	    "prize3": 4,
	    "entries": 108,
	    "votes": 8,
	    "views": 306,
	    "acceptStartDate": "2014-05-03T13:57:24",
	    "acceptEndDate": "2014-05-30T01:01:45",
	    "voteStartDate": "2014-02-16T02:46:23",
	    "voteEndDate": "2014-05-07T08:32:04",
	    "announceDate": "2014-07-06T07:33:10"
	  },
	  {
	    "id": 2,
	    "isActive": false,
	    "prize1": 16,
	    "prize2": 15,
	    "prize3": 1,
	    "entries": 128,
	    "votes": 16,
	    "views": 316,
	    "acceptStartDate": "2014-02-20T05:05:13",
	    "acceptEndDate": "2014-06-03T01:08:00",
	    "voteStartDate": "2014-08-14T03:27:29",
	    "voteEndDate": "2014-03-05T00:03:43",
	    "announceDate": "2014-05-22T01:50:15"
	  },
	  {
	    "id": 3,
	    "isActive": true,
	    "prize1": 24,
	    "prize2": 7,
	    "prize3": 6,
	    "entries": 119,
	    "votes": 19,
	    "views": 306,
	    "acceptStartDate": "2014-04-16T09:28:03",
	    "acceptEndDate": "2014-03-27T23:36:21",
	    "voteStartDate": "2014-04-04T17:05:38",
	    "voteEndDate": "2014-03-23T06:31:36",
	    "announceDate": "2014-05-31T11:14:25"
	  },
	  {
	    "id": 4,
	    "isActive": false,
	    "prize1": 16,
	    "prize2": 12,
	    "prize3": 6,
	    "entries": 73,
	    "votes": 9,
	    "views": 97,
	    "acceptStartDate": "2014-01-05T17:27:20",
	    "acceptEndDate": "2014-02-25T02:35:43",
	    "voteStartDate": "2014-03-23T17:25:43",
	    "voteEndDate": "2014-03-17T16:25:42",
	    "announceDate": "2014-04-27T17:36:48"
	  },
	  {
	    "id": 5,
	    "isActive": false,
	    "prize1": 28,
	    "prize2": 10,
	    "prize3": 3,
	    "entries": 171,
	    "votes": 90,
	    "views": 27,
	    "acceptStartDate": "2014-05-25T09:34:51",
	    "acceptEndDate": "2014-05-25T03:49:41",
	    "voteStartDate": "2014-07-15T08:32:12",
	    "voteEndDate": "2014-05-14T04:09:34",
	    "announceDate": "2014-06-24T20:45:31"
	  },
	  {
	    "id": 6,
	    "isActive": true,
	    "prize1": 18,
	    "prize2": 15,
	    "prize3": 3,
	    "entries": 58,
	    "votes": 16,
	    "views": 500,
	    "acceptStartDate": "2014-02-17T17:50:08",
	    "acceptEndDate": "2014-07-14T02:28:45",
	    "voteStartDate": "2014-02-03T11:41:40",
	    "voteEndDate": "2014-08-05T00:34:42",
	    "announceDate": "2014-04-07T17:02:33"
	  },
	  {
	    "id": 7,
	    "isActive": false,
	    "prize1": 15,
	    "prize2": 7,
	    "prize3": 5,
	    "entries": 115,
	    "votes": 13,
	    "views": 296,
	    "acceptStartDate": "2014-02-25T09:43:25",
	    "acceptEndDate": "2014-06-30T19:08:01",
	    "voteStartDate": "2014-05-28T07:23:55",
	    "voteEndDate": "2014-07-10T18:29:40",
	    "announceDate": "2014-05-01T19:46:07"
	  },
	  {
	    "id": 8,
	    "isActive": true,
	    "prize1": 22,
	    "prize2": 14,
	    "prize3": 7,
	    "entries": 88,
	    "votes": 70,
	    "views": 473,
	    "acceptStartDate": "2014-06-13T11:10:09",
	    "acceptEndDate": "2014-06-29T11:35:00",
	    "voteStartDate": "2014-02-20T00:45:59",
	    "voteEndDate": "2014-06-13T12:55:41",
	    "announceDate": "2014-05-30T07:09:50"
	  },
	  {
	    "id": 9,
	    "isActive": false,
	    "prize1": 27,
	    "prize2": 14,
	    "prize3": 4,
	    "entries": 175,
	    "votes": 24,
	    "views": 185,
	    "acceptStartDate": "2014-01-07T03:33:17",
	    "acceptEndDate": "2014-05-19T06:50:33",
	    "voteStartDate": "2014-07-02T03:09:38",
	    "voteEndDate": "2014-05-27T17:34:34",
	    "announceDate": "2014-08-08T21:55:43"
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

app.factory('backOfficeResource', function () {

	var data = [
		{id:0,	issue:"NSS", order: 10035841, date1:"3/14/14", date2:"8/28/14",	amount:"28.00",	user:"superflynut",		store:"Nutty Legos"},
		{id:1,	issue:"NRS", order: 10086263, date1:"4/16/14", date2:"8/17/14",	amount:"36.50",	user:"Captain Brick",	store:"Captain AmeriBrick"},
		{id:2,	issue:"NPX", order: 10012563, date1:"5/20/14", date2:"8/11/14",	amount:"18.90",	user:"LegoLass",		store:"Lord of the Bricks"},
		{id:3,	issue:"NSB", order: 10023463, date1:"6/05/14", date2:"8/08/14",	amount:"17.00",	user:"legolandia",		store:"Lego Landia"},
		{id:4,	issue:"NSS", order: 10089242, date1:"6/23/14", date2:"8/06/14",	amount:"5.00",	user:"Dad's AFOL",		store:"Dad's AFOL"},
		{id:5,	issue:"NRS", order: 10082352, date1:"6/23/14", date2:"8/05/14",	amount:"31.10",	user:"AFOL 4 the Win",	store:"AFOL 4 Life"},
		{id:6,	issue:"NPX", order: 10046831, date1:"7/27/14", date2:"7/27/14",	amount:"7.50",	user:"Bricktopia",		store:"Brick Utopia"},
		{id:7,	issue:"NSB", order: 10092948, date1:"8/08/14", date2:"7/25/14",	amount:"180.00",user:"Free 4 All",		store:"Brick 4 Less"},
		{id:8,	issue:"NSS", order: 10092352, date1:"8/21/14", date2:"7/23/14",	amount:"250.00",user:"Sink or Swim",	store:"Does it Float"},
		{id:9,	issue:"NPX", order: 10016362, date1:"8/28/14", date2:"7/21/14",	amount:"52.75",	user:"Brick City",		store:"Bricks 4 Sale"},
		{id:10,	issue:"NRS", order: 10084634, date1:"8/28/14", date2:"7/16/14",	amount:"83.80",	user:"Fan of Lego",		store:"Legora"}
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
  
	$('.menu').dropit();	// @todo still has issues where menu initiator disappears after 2nd click..

});