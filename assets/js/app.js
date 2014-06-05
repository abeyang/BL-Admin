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

	$scope.getTagNames = function(tags) {
		// tags is an array of tag id's
		var str = '';

		_.each(tags, function(id) {
			str += tagResource.findNameById(id) + ', ';
		});

		return str.substring(0, str.length-2);		// remove the final ", " in str
	};

	$scope.getStatus = function(status) {
		return ui.findAttrById(statusResource, 'name', status);
	};

	$scope.getTitle = function(id) {
		return ui.findAttrById(metaResource, 'title', id);
	};

	$scope.getRatings = function(id) {
		return mocResource.ratingsById(id);
	};

	$scope.selectCount = function() {
		return mocResource.findSelected().length;	
	};

	$scope.selectNone = function() {
		var mocs = mocResource.findSelected();
		_.each(mocs, function (moc) {
			moc.selected = '';
		});
	}

	$scope.filterCards = {
		status: 0
	};

});

/* Tag controllers */

app.controller('TagsController', function($scope, $location, tagResource) {

	$scope.tags = tagResource.list();

	$scope.tagOrder = '-count';		// default tag order: sort by popularity

	$scope.max = tagResource.maxCount();

});

app.controller('TagController', function($scope, $location, ui, mocResource, tagResource, metaResource) {

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

});

/* Help Center Controllers */

app.controller('HelpQAController', function($scope, ui, helpQuestionsResource) {

	$scope.ui = ui;
	
	$scope.entries = helpQuestionsResource.list();

	$scope.filterEntries = {
		isAnswered: false
	};
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
		        username: '{{company()}}',
		        ratings: '{{integer(0, 5)}}',
		        raters: '{{integer(1, 200)}}',
                comments: '{{integer(0, 10)}}',
		        fee: '{{integer(0, 5)}}',
		        parts: '{{integer(1, 100)}}',
		        content: '{{lorem(1, "paragraphs")}}',
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
	        "name": "Bridget Cross",
	        "username": "Bunga",
	        "ratings": 1,
	        "raters": 94,
	        "comments": 3,
	        "fee": 4,
	        "parts": 16,
	        "content": "Duis occaecat proident excepteur officia nisi nisi laboris laborum tempor consequat commodo ut. Aliquip consequat dolor eiusmod et eiusmod. Elit excepteur nostrud velit elit. Sint sit esse occaecat dolor excepteur aute anim reprehenderit sint. Duis aliquip incididunt nostrud reprehenderit Lorem laboris occaecat nulla cillum aliqua est dolor adipisicing.\r\n",
	        "submitTime": "2014-03-22T15:24:40",
	        "status": 3,
	        "tags": [
	            13,
	            8,
	            16
	        ],
	        "contest": 3,
	        "isRejected": true,
	        "votes": 14
	    },
	    {
	        "id": 1,
	        "name": "Day Collins",
	        "username": "Norsul",
	        "ratings": 4,
	        "raters": 188,
	        "comments": 1,
	        "fee": 1,
	        "parts": 28,
	        "content": "Excepteur laboris do incididunt pariatur ut. Irure cillum laboris sunt qui id labore. Mollit minim culpa ea ullamco officia tempor ut Lorem reprehenderit. Laboris officia do reprehenderit aute cillum duis aute reprehenderit tempor quis mollit nulla nostrud sit.\r\n",
	        "submitTime": "2014-03-25T15:43:03",
	        "status": 4,
	        "tags": [
	            1,
	            13,
	            6,
	            11
	        ],
	        "contest": 1,
	        "isRejected": true,
	        "votes": 2
	    },
	    {
	        "id": 2,
	        "name": "Moreno Robinson",
	        "username": "Immunics",
	        "ratings": 1,
	        "raters": 189,
	        "comments": 10,
	        "fee": 3,
	        "parts": 42,
	        "content": "Lorem commodo eu deserunt excepteur exercitation. Ad quis consectetur magna magna mollit nostrud proident Lorem tempor in. Eu sit sint id officia pariatur cillum dolore qui laborum. Tempor non Lorem do adipisicing deserunt reprehenderit est ut eiusmod. In pariatur laborum do irure aute id duis irure esse tempor proident anim aliqua deserunt. Ullamco cillum et Lorem esse aute anim.\r\n",
	        "submitTime": "2014-02-10T18:21:32",
	        "status": 4,
	        "tags": [
	            12,
	            6
	        ],
	        "contest": 2,
	        "isRejected": true,
	        "votes": 12
	    },
	    {
	        "id": 3,
	        "name": "Dillard Good",
	        "username": "Ozean",
	        "ratings": 3,
	        "raters": 14,
	        "comments": 7,
	        "fee": 4,
	        "parts": 78,
	        "content": "Pariatur quis qui quis consequat laboris tempor veniam esse culpa sunt anim. Velit proident ullamco aliquip labore non aute nostrud culpa sit laboris est id adipisicing. Labore velit in consequat do ea fugiat ullamco irure veniam qui. Exercitation excepteur duis Lorem sunt minim sunt aliqua irure. Ullamco ipsum ea est minim reprehenderit incididunt non cupidatat enim cupidatat.\r\n",
	        "submitTime": "2014-01-22T19:52:31",
	        "status": 4,
	        "tags": [
	            6,
	            0,
	            5
	        ],
	        "contest": 7,
	        "isRejected": true,
	        "votes": 11
	    },
	    {
	        "id": 4,
	        "name": "Martin Saunders",
	        "username": "Navir",
	        "ratings": 2,
	        "raters": 75,
	        "comments": 10,
	        "fee": 5,
	        "parts": 80,
	        "content": "Ullamco nulla voluptate voluptate in duis deserunt dolor irure Lorem nulla. Ipsum ea in magna consequat ipsum. Do incididunt in nisi consequat veniam in esse sunt non nulla consectetur do dolor dolor.\r\n",
	        "submitTime": "2014-02-05T07:42:16",
	        "status": 0,
	        "tags": [
	            1
	        ],
	        "contest": 3,
	        "isRejected": true,
	        "votes": 29
	    },
	    {
	        "id": 5,
	        "name": "Angelina Meyers",
	        "username": "Moltonic",
	        "ratings": 4,
	        "raters": 30,
	        "comments": 7,
	        "fee": 5,
	        "parts": 96,
	        "content": "Enim veniam nisi reprehenderit ea adipisicing. Sit irure veniam laboris nulla magna sunt pariatur ipsum occaecat ex fugiat do occaecat do. Quis aute voluptate consectetur qui quis eu eu irure duis. Officia adipisicing eu consequat consequat ad in nostrud id sit velit ad id consequat aliqua. Laborum sunt nostrud amet sit aliquip magna ea sit sit consectetur eiusmod.\r\n",
	        "submitTime": "2014-02-19T08:42:23",
	        "status": 1,
	        "tags": [
	            15,
	            5,
	            5,
	            2,
	            9
	        ],
	        "contest": 2,
	        "isRejected": false,
	        "votes": 16
	    },
	    {
	        "id": 6,
	        "name": "Townsend Dotson",
	        "username": "Utara",
	        "ratings": 4,
	        "raters": 121,
	        "comments": 1,
	        "fee": 2,
	        "parts": 21,
	        "content": "Magna adipisicing proident consectetur sit ullamco veniam non dolore proident velit aliquip veniam voluptate. Est minim ea Lorem qui amet nostrud nulla. Nulla fugiat est in enim in reprehenderit quis deserunt pariatur mollit id dolore cillum consequat.\r\n",
	        "submitTime": "2014-01-29T01:58:01",
	        "status": 4,
	        "tags": [
	            15
	        ],
	        "contest": 6,
	        "isRejected": false,
	        "votes": 16
	    },
	    {
	        "id": 7,
	        "name": "Petersen Dalton",
	        "username": "Ecolight",
	        "ratings": 3,
	        "raters": 123,
	        "comments": 1,
	        "fee": 5,
	        "parts": 87,
	        "content": "Aliquip excepteur cillum veniam tempor. Lorem cupidatat proident et exercitation do veniam ea. Et ipsum est nisi proident irure. Cillum Lorem dolore in adipisicing eu ea eiusmod ipsum quis magna dolor Lorem ex enim. Dolore fugiat fugiat est irure consequat ut.\r\n",
	        "submitTime": "2014-04-12T18:24:17",
	        "status": 3,
	        "tags": [
	            9,
	            2,
	            5
	        ],
	        "contest": 2,
	        "isRejected": true,
	        "votes": 5
	    },
	    {
	        "id": 8,
	        "name": "Obrien Nixon",
	        "username": "Gogol",
	        "ratings": 3,
	        "raters": 62,
	        "comments": 9,
	        "fee": 1,
	        "parts": 44,
	        "content": "Officia esse labore cupidatat nulla dolor nulla enim quis ut irure pariatur eu excepteur eiusmod. Exercitation deserunt ex consequat do irure veniam cillum ea labore quis mollit consequat do et. Deserunt consectetur id incididunt ea ipsum occaecat culpa cillum dolor duis. Lorem et velit minim do laborum aliquip.\r\n",
	        "submitTime": "2014-04-03T09:35:12",
	        "status": 0,
	        "tags": [
	            18,
	            2
	        ],
	        "contest": 2,
	        "isRejected": true,
	        "votes": 25
	    },
	    {
	        "id": 9,
	        "name": "Wilson House",
	        "username": "Xurban",
	        "ratings": 3,
	        "raters": 16,
	        "comments": 6,
	        "fee": 1,
	        "parts": 68,
	        "content": "Laboris aute aute et enim nulla. Exercitation elit excepteur anim commodo fugiat nostrud. Ad quis eu amet ex pariatur reprehenderit. Commodo occaecat aute fugiat minim sint. Sit consectetur qui enim occaecat voluptate amet labore mollit culpa amet. Anim cillum ipsum duis eu dolor quis aliqua excepteur eu et mollit. In proident cillum officia sunt nulla ullamco ut officia amet est.\r\n",
	        "submitTime": "2014-01-08T10:31:27",
	        "status": 3,
	        "tags": [
	            6,
	            20,
	            0,
	            18
	        ],
	        "contest": 3,
	        "isRejected": true,
	        "votes": 23
	    },
	    {
	        "id": 10,
	        "name": "Ila Gross",
	        "username": "Uniworld",
	        "ratings": 2,
	        "raters": 171,
	        "comments": 2,
	        "fee": 2,
	        "parts": 29,
	        "content": "Excepteur officia ullamco sunt qui non proident esse nostrud ea deserunt magna. Nostrud eu eiusmod qui mollit et eiusmod nisi sunt adipisicing magna duis anim. Elit sint nostrud sunt qui officia ut fugiat. Et magna laboris duis aliquip proident cillum Lorem sunt fugiat. Aliquip id fugiat sit cupidatat minim cupidatat duis.\r\n",
	        "submitTime": "2014-02-21T20:27:56",
	        "status": 1,
	        "tags": [
	            15,
	            1,
	            17
	        ],
	        "contest": 3,
	        "isRejected": false,
	        "votes": 25
	    },
	    {
	        "id": 11,
	        "name": "Kelley Juarez",
	        "username": "Maxemia",
	        "ratings": 5,
	        "raters": 12,
	        "comments": 4,
	        "fee": 5,
	        "parts": 81,
	        "content": "Fugiat Lorem qui esse tempor culpa exercitation. Eiusmod Lorem aliqua tempor voluptate magna adipisicing fugiat laborum velit elit nulla consequat ut. Labore occaecat cillum anim nisi id nisi pariatur dolore incididunt voluptate enim sit sit.\r\n",
	        "submitTime": "2014-02-26T07:05:05",
	        "status": 1,
	        "tags": [
	            14,
	            13,
	            14,
	            2
	        ],
	        "contest": 4,
	        "isRejected": true,
	        "votes": 27
	    },
	    {
	        "id": 12,
	        "name": "Andrews Elliott",
	        "username": "Kyagoro",
	        "ratings": 1,
	        "raters": 101,
	        "comments": 1,
	        "fee": 2,
	        "parts": 74,
	        "content": "Ad non proident do id elit eiusmod commodo id nostrud. Mollit nulla in voluptate enim eiusmod eu irure labore. Labore ad consequat Lorem laborum incididunt amet. Occaecat dolore sit occaecat reprehenderit. Officia eu dolor sunt labore pariatur Lorem est commodo.\r\n",
	        "submitTime": "2014-03-17T16:39:47",
	        "status": 1,
	        "tags": [
	            17
	        ],
	        "contest": 3,
	        "isRejected": true,
	        "votes": 2
	    },
	    {
	        "id": 13,
	        "name": "Buck Steele",
	        "username": "Ecraze",
	        "ratings": 1,
	        "raters": 154,
	        "comments": 10,
	        "fee": 4,
	        "parts": 42,
	        "content": "Irure enim duis sit mollit minim deserunt anim mollit. Sint consequat amet duis anim enim. Sit quis nulla excepteur incididunt pariatur irure fugiat amet velit Lorem. Minim id magna consequat aliqua duis esse veniam eiusmod ea irure eu. Excepteur qui ad est et officia duis nisi. Nisi dolor et reprehenderit non duis cillum pariatur laboris exercitation officia.\r\n",
	        "submitTime": "2014-05-01T09:29:40",
	        "status": 2,
	        "tags": [
	            13,
	            3,
	            7,
	            10,
	            20
	        ],
	        "contest": 0,
	        "isRejected": false,
	        "votes": 15
	    },
	    {
	        "id": 14,
	        "name": "Rosalyn Mcbride",
	        "username": "Glasstep",
	        "ratings": 2,
	        "raters": 72,
	        "comments": 4,
	        "fee": 5,
	        "parts": 74,
	        "content": "Veniam deserunt nisi Lorem non sint non anim voluptate anim. Sint culpa ullamco culpa sint magna id consectetur amet aliquip aliqua ad sit. Et exercitation et ea non labore anim aliqua deserunt esse deserunt pariatur sit anim. Ullamco fugiat sunt adipisicing laboris ut eu in. Veniam ex veniam et quis deserunt pariatur dolor ipsum est cupidatat.\r\n",
	        "submitTime": "2014-05-15T02:12:55",
	        "status": 4,
	        "tags": [
	            14,
	            1,
	            2
	        ],
	        "contest": 3,
	        "isRejected": true,
	        "votes": 16
	    },
	    {
	        "id": 15,
	        "name": "Sykes Huber",
	        "username": "Goko",
	        "ratings": 1,
	        "raters": 81,
	        "comments": 9,
	        "fee": 1,
	        "parts": 5,
	        "content": "Adipisicing nulla irure sint voluptate occaecat pariatur magna cillum ut Lorem consectetur anim sit. Aute ea mollit reprehenderit culpa voluptate Lorem commodo tempor deserunt ipsum laboris. Dolor nostrud do tempor voluptate ad sit velit Lorem cillum occaecat labore. Tempor eu proident id dolor culpa nulla aute nostrud est officia in ad. Eu ipsum Lorem ut deserunt culpa adipisicing ea. Labore ullamco non anim nulla qui magna officia in laboris exercitation nulla. Esse officia deserunt commodo non.\r\n",
	        "submitTime": "2014-01-11T18:10:06",
	        "status": 2,
	        "tags": [
	            0,
	            2,
	            20,
	            5
	        ],
	        "contest": 8,
	        "isRejected": true,
	        "votes": 26
	    },
	    {
	        "id": 16,
	        "name": "Jimenez Ford",
	        "username": "Pearlesex",
	        "ratings": 4,
	        "raters": 31,
	        "comments": 0,
	        "fee": 4,
	        "parts": 76,
	        "content": "Sunt ut anim eu cupidatat veniam nostrud. Ea sit commodo eu aute nisi est anim duis. Labore qui proident nulla laboris ullamco occaecat laborum eu adipisicing fugiat.\r\n",
	        "submitTime": "2014-01-28T16:46:05",
	        "status": 2,
	        "tags": [
	            19,
	            5
	        ],
	        "contest": 9,
	        "isRejected": false,
	        "votes": 7
	    },
	    {
	        "id": 17,
	        "name": "Fay Morgan",
	        "username": "Neptide",
	        "ratings": 4,
	        "raters": 105,
	        "comments": 6,
	        "fee": 2,
	        "parts": 85,
	        "content": "Officia aliqua occaecat labore consectetur eu in id minim. Do labore Lorem magna ad. Dolor deserunt consequat amet reprehenderit ullamco. Commodo deserunt incididunt qui veniam fugiat pariatur et. Adipisicing qui cillum adipisicing nisi quis cupidatat ullamco sit nisi occaecat eu nisi officia incididunt. Et veniam eu sunt occaecat qui duis proident.\r\n",
	        "submitTime": "2014-05-25T19:34:43",
	        "status": 2,
	        "tags": [
	            17,
	            2
	        ],
	        "contest": 0,
	        "isRejected": true,
	        "votes": 28
	    },
	    {
	        "id": 18,
	        "name": "Briana Merrill",
	        "username": "Duoflex",
	        "ratings": 3,
	        "raters": 103,
	        "comments": 0,
	        "fee": 4,
	        "parts": 84,
	        "content": "Ullamco magna laboris nostrud irure. Amet velit et amet ad excepteur commodo. Minim esse dolor esse ea. Quis voluptate qui exercitation adipisicing nostrud incididunt quis quis consectetur excepteur fugiat ad culpa occaecat.\r\n",
	        "submitTime": "2014-01-16T12:03:04",
	        "status": 0,
	        "tags": [
	            19,
	            9,
	            11
	        ],
	        "contest": 2,
	        "isRejected": true,
	        "votes": 28
	    },
	    {
	        "id": 19,
	        "name": "Schultz Callahan",
	        "username": "Uni",
	        "ratings": 5,
	        "raters": 199,
	        "comments": 10,
	        "fee": 0,
	        "parts": 72,
	        "content": "Exercitation deserunt irure minim amet occaecat. Anim incididunt est irure irure aliquip consequat cillum exercitation aute. Ullamco adipisicing irure amet enim. Dolore veniam ut pariatur incididunt sint officia in labore exercitation laborum esse nisi in do. Enim laborum commodo laborum tempor ullamco dolore.\r\n",
	        "submitTime": "2014-05-09T15:39:36",
	        "status": 2,
	        "tags": [
	            10
	        ],
	        "contest": 4,
	        "isRejected": false,
	        "votes": 27
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
	        isAnswered: '{{bool()}}',
	        markedByStaff: '{{bool()}}'
	    }
	]
	*/

	var data = [
	    {
	        "id": 0,
	        "name": "Short Barron",
	        "title": "velit dolore consectetur dolor amet officia elit",
	        "category": 5,
	        "votes": 0,
	        "answers": 14,
	        "views": 40,
	        "submitTime": "2014-02-18T04:21:35",
	        "isAnswered": false,
	        "markedByStaff": false
	    },
	    {
	        "id": 1,
	        "name": "Lewis Hester",
	        "title": "et elit cillum amet deserunt nisi quis",
	        "category": 4,
	        "votes": 15,
	        "answers": 22,
	        "views": 406,
	        "submitTime": "2014-05-20T17:14:26",
	        "isAnswered": false,
	        "markedByStaff": true
	    },
	    {
	        "id": 2,
	        "name": "Saunders Mcconnell",
	        "title": "nisi qui incididunt laborum enim excepteur et",
	        "category": 7,
	        "votes": 2,
	        "answers": 15,
	        "views": 59,
	        "submitTime": "2014-01-24T15:43:07",
	        "isAnswered": true,
	        "markedByStaff": true
	    },
	    {
	        "id": 3,
	        "name": "Sonia Holmes",
	        "title": "deserunt esse voluptate incididunt fugiat fugiat elit",
	        "category": 6,
	        "votes": 9,
	        "answers": 6,
	        "views": 410,
	        "submitTime": "2014-03-16T06:01:49",
	        "isAnswered": true,
	        "markedByStaff": false
	    },
	    {
	        "id": 4,
	        "name": "Vance Martin",
	        "title": "dolore cupidatat occaecat quis ipsum laboris veniam",
	        "category": 6,
	        "votes": 1,
	        "answers": 24,
	        "views": 2,
	        "submitTime": "2014-04-09T05:32:44",
	        "isAnswered": false,
	        "markedByStaff": true
	    },
	    {
	        "id": 5,
	        "name": "Jensen Hughes",
	        "title": "consectetur ex dolore anim amet irure non",
	        "category": 4,
	        "votes": 1,
	        "answers": 18,
	        "views": 384,
	        "submitTime": "2014-04-09T05:01:28",
	        "isAnswered": true,
	        "markedByStaff": true
	    },
	    {
	        "id": 6,
	        "name": "Barker Lindsay",
	        "title": "et est officia culpa sit enim irure",
	        "category": 3,
	        "votes": 9,
	        "answers": 10,
	        "views": 137,
	        "submitTime": "2014-02-24T12:54:58",
	        "isAnswered": false,
	        "markedByStaff": true
	    },
	    {
	        "id": 7,
	        "name": "Lidia Davis",
	        "title": "tempor sunt sint Lorem excepteur Lorem fugiat",
	        "category": 7,
	        "votes": 4,
	        "answers": 14,
	        "views": 399,
	        "submitTime": "2014-04-07T22:28:15",
	        "isAnswered": true,
	        "markedByStaff": false
	    },
	    {
	        "id": 8,
	        "name": "Kerry Boyle",
	        "title": "voluptate labore aute excepteur incididunt nostrud laborum",
	        "category": 4,
	        "votes": 16,
	        "answers": 27,
	        "views": 240,
	        "submitTime": "2014-03-17T09:42:03",
	        "isAnswered": true,
	        "markedByStaff": false
	    },
	    {
	        "id": 9,
	        "name": "Young Santana",
	        "title": "aliquip cillum quis amet eu non consequat",
	        "category": 6,
	        "votes": 0,
	        "answers": 8,
	        "views": 203,
	        "submitTime": "2014-01-17T15:10:11",
	        "isAnswered": true,
	        "markedByStaff": true
	    },
	    {
	        "id": 10,
	        "name": "Kathleen Nunez",
	        "title": "proident qui occaecat enim deserunt do sit",
	        "category": 7,
	        "votes": 12,
	        "answers": 17,
	        "views": 404,
	        "submitTime": "2014-04-10T19:25:02",
	        "isAnswered": true,
	        "markedByStaff": true
	    },
	    {
	        "id": 11,
	        "name": "George Cervantes",
	        "title": "enim elit commodo in sit officia labore",
	        "category": 3,
	        "votes": 14,
	        "answers": 18,
	        "views": 249,
	        "submitTime": "2014-05-15T22:50:44",
	        "isAnswered": true,
	        "markedByStaff": false
	    },
	    {
	        "id": 12,
	        "name": "Lizzie Lee",
	        "title": "sunt sit occaecat exercitation consequat duis ad",
	        "category": 2,
	        "votes": 19,
	        "answers": 18,
	        "views": 235,
	        "submitTime": "2014-03-16T18:06:44",
	        "isAnswered": true,
	        "markedByStaff": true
	    },
	    {
	        "id": 13,
	        "name": "Lynette Huber",
	        "title": "incididunt in eu culpa consequat et id",
	        "category": 0,
	        "votes": 11,
	        "answers": 30,
	        "views": 384,
	        "submitTime": "2014-01-29T13:10:09",
	        "isAnswered": true,
	        "markedByStaff": true
	    },
	    {
	        "id": 14,
	        "name": "Annmarie Castro",
	        "title": "exercitation sunt enim amet aliquip exercitation laboris",
	        "category": 2,
	        "votes": 0,
	        "answers": 22,
	        "views": 455,
	        "submitTime": "2014-01-12T14:54:54",
	        "isAnswered": false,
	        "markedByStaff": true
	    },
	    {
	        "id": 15,
	        "name": "Trevino Guerra",
	        "title": "pariatur do ipsum minim esse quis mollit",
	        "category": 0,
	        "votes": 14,
	        "answers": 2,
	        "views": 15,
	        "submitTime": "2014-05-01T23:11:58",
	        "isAnswered": false,
	        "markedByStaff": true
	    },
	    {
	        "id": 16,
	        "name": "Lucinda Marsh",
	        "title": "minim pariatur eu deserunt veniam sint pariatur",
	        "category": 0,
	        "votes": 7,
	        "answers": 25,
	        "views": 99,
	        "submitTime": "2014-04-06T04:10:44",
	        "isAnswered": false,
	        "markedByStaff": false
	    },
	    {
	        "id": 17,
	        "name": "Bridget Moses",
	        "title": "dolor adipisicing qui commodo ut nostrud qui",
	        "category": 1,
	        "votes": 18,
	        "answers": 20,
	        "views": 490,
	        "submitTime": "2014-03-25T07:46:44",
	        "isAnswered": false,
	        "markedByStaff": true
	    },
	    {
	        "id": 18,
	        "name": "Greta Sullivan",
	        "title": "incididunt eiusmod aliquip proident tempor enim eu",
	        "category": 0,
	        "votes": 7,
	        "answers": 29,
	        "views": 280,
	        "submitTime": "2014-01-19T09:28:01",
	        "isAnswered": false,
	        "markedByStaff": false
	    },
	    {
	        "id": 19,
	        "name": "Carr Oneill",
	        "title": "consectetur deserunt ipsum aliquip Lorem minim cupidatat",
	        "category": 2,
	        "votes": 15,
	        "answers": 27,
	        "views": 226,
	        "submitTime": "2014-03-04T20:51:58",
	        "isAnswered": true,
	        "markedByStaff": true
	    },
	    {
	        "id": 20,
	        "name": "Deana Vinson",
	        "title": "qui esse magna anim ut elit consequat",
	        "category": 4,
	        "votes": 14,
	        "answers": 11,
	        "views": 244,
	        "submitTime": "2014-03-26T00:10:28",
	        "isAnswered": false,
	        "markedByStaff": false
	    },
	    {
	        "id": 21,
	        "name": "Walters Wooten",
	        "title": "dolor aute cillum ullamco ex aute incididunt",
	        "category": 6,
	        "votes": 9,
	        "answers": 20,
	        "views": 233,
	        "submitTime": "2014-03-25T14:18:08",
	        "isAnswered": false,
	        "markedByStaff": true
	    },
	    {
	        "id": 22,
	        "name": "Esther Pacheco",
	        "title": "laborum voluptate minim id reprehenderit in dolore",
	        "category": 7,
	        "votes": 12,
	        "answers": 2,
	        "views": 72,
	        "submitTime": "2014-01-30T11:15:27",
	        "isAnswered": false,
	        "markedByStaff": false
	    },
	    {
	        "id": 23,
	        "name": "Glass Pitts",
	        "title": "pariatur cupidatat fugiat ut proident veniam aliquip",
	        "category": 2,
	        "votes": 3,
	        "answers": 20,
	        "views": 135,
	        "submitTime": "2014-01-18T08:41:21",
	        "isAnswered": false,
	        "markedByStaff": false
	    },
	    {
	        "id": 24,
	        "name": "Bailey Stephenson",
	        "title": "esse occaecat cupidatat tempor incididunt ipsum adipisicing",
	        "category": 5,
	        "votes": 16,
	        "answers": 16,
	        "views": 274,
	        "submitTime": "2014-06-01T04:21:53",
	        "isAnswered": false,
	        "markedByStaff": false
	    },
	    {
	        "id": 25,
	        "name": "Ayala Conway",
	        "title": "enim anim excepteur ipsum et laborum magna",
	        "category": 2,
	        "votes": 9,
	        "answers": 15,
	        "views": 120,
	        "submitTime": "2014-04-17T02:27:03",
	        "isAnswered": false,
	        "markedByStaff": true
	    },
	    {
	        "id": 26,
	        "name": "Payne Rios",
	        "title": "laboris adipisicing laborum do est laboris do",
	        "category": 1,
	        "votes": 3,
	        "answers": 17,
	        "views": 92,
	        "submitTime": "2014-03-23T18:56:40",
	        "isAnswered": true,
	        "markedByStaff": true
	    },
	    {
	        "id": 27,
	        "name": "Benton Mcdowell",
	        "title": "tempor ut excepteur dolore ipsum veniam duis",
	        "category": 6,
	        "votes": 8,
	        "answers": 18,
	        "views": 297,
	        "submitTime": "2014-04-07T17:35:54",
	        "isAnswered": true,
	        "markedByStaff": true
	    },
	    {
	        "id": 28,
	        "name": "Douglas Delaney",
	        "title": "dolore ipsum labore nostrud ad sit ea",
	        "category": 1,
	        "votes": 11,
	        "answers": 14,
	        "views": 64,
	        "submitTime": "2014-04-30T13:48:36",
	        "isAnswered": false,
	        "markedByStaff": false
	    },
	    {
	        "id": 29,
	        "name": "Rochelle Stafford",
	        "title": "laboris adipisicing eu enim voluptate est veniam",
	        "category": 2,
	        "votes": 18,
	        "answers": 21,
	        "views": 476,
	        "submitTime": "2014-05-07T19:50:28",
	        "isAnswered": true,
	        "markedByStaff": true
	    },
	    {
	        "id": 30,
	        "name": "Fischer Gilbert",
	        "title": "culpa et quis deserunt officia ipsum occaecat",
	        "category": 7,
	        "votes": 2,
	        "answers": 2,
	        "views": 42,
	        "submitTime": "2014-04-15T01:51:01",
	        "isAnswered": false,
	        "markedByStaff": true
	    },
	    {
	        "id": 31,
	        "name": "Mendoza Burke",
	        "title": "officia Lorem cillum elit dolore esse dolore",
	        "category": 7,
	        "votes": 10,
	        "answers": 23,
	        "views": 339,
	        "submitTime": "2014-04-08T23:22:42",
	        "isAnswered": false,
	        "markedByStaff": false
	    },
	    {
	        "id": 32,
	        "name": "Myers Salinas",
	        "title": "commodo eiusmod eiusmod elit quis eu Lorem",
	        "category": 3,
	        "votes": 4,
	        "answers": 5,
	        "views": 57,
	        "submitTime": "2014-02-01T23:03:38",
	        "isAnswered": true,
	        "markedByStaff": true
	    },
	    {
	        "id": 33,
	        "name": "Bauer Charles",
	        "title": "anim labore ea est laboris incididunt consequat",
	        "category": 2,
	        "votes": 7,
	        "answers": 22,
	        "views": 484,
	        "submitTime": "2014-01-02T00:13:26",
	        "isAnswered": false,
	        "markedByStaff": true
	    },
	    {
	        "id": 34,
	        "name": "Harmon Mendoza",
	        "title": "dolor tempor et magna consequat ex laborum",
	        "category": 5,
	        "votes": 14,
	        "answers": 10,
	        "views": 132,
	        "submitTime": "2014-03-20T18:10:39",
	        "isAnswered": true,
	        "markedByStaff": false
	    },
	    {
	        "id": 35,
	        "name": "Sargent Blair",
	        "title": "consequat ad duis nisi proident veniam id",
	        "category": 4,
	        "votes": 1,
	        "answers": 23,
	        "views": 453,
	        "submitTime": "2014-01-21T11:28:27",
	        "isAnswered": true,
	        "markedByStaff": true
	    },
	    {
	        "id": 36,
	        "name": "Fulton Allen",
	        "title": "cupidatat aliquip adipisicing dolor Lorem id adipisicing",
	        "category": 1,
	        "votes": 12,
	        "answers": 20,
	        "views": 390,
	        "submitTime": "2014-01-13T20:07:58",
	        "isAnswered": false,
	        "markedByStaff": false
	    },
	    {
	        "id": 37,
	        "name": "Finley Murray",
	        "title": "laborum id id irure ipsum sint aliqua",
	        "category": 6,
	        "votes": 19,
	        "answers": 2,
	        "views": 74,
	        "submitTime": "2014-05-25T06:22:38",
	        "isAnswered": true,
	        "markedByStaff": true
	    },
	    {
	        "id": 38,
	        "name": "Grimes Cooke",
	        "title": "in culpa adipisicing reprehenderit nostrud aliquip aliqua",
	        "category": 4,
	        "votes": 12,
	        "answers": 19,
	        "views": 70,
	        "submitTime": "2014-04-29T23:40:50",
	        "isAnswered": false,
	        "markedByStaff": false
	    },
	    {
	        "id": 39,
	        "name": "Molly Gonzales",
	        "title": "mollit labore voluptate ut proident adipisicing eu",
	        "category": 4,
	        "votes": 2,
	        "answers": 26,
	        "views": 407,
	        "submitTime": "2014-04-10T12:49:33",
	        "isAnswered": true,
	        "markedByStaff": false
	    },
	    {
	        "id": 40,
	        "name": "Mcmahon Adkins",
	        "title": "irure excepteur adipisicing laborum adipisicing magna ullamco",
	        "category": 4,
	        "votes": 7,
	        "answers": 23,
	        "views": 120,
	        "submitTime": "2014-01-29T04:57:41",
	        "isAnswered": false,
	        "markedByStaff": false
	    },
	    {
	        "id": 41,
	        "name": "Frank Sykes",
	        "title": "sint cupidatat Lorem dolore exercitation quis et",
	        "category": 2,
	        "votes": 3,
	        "answers": 26,
	        "views": 386,
	        "submitTime": "2014-02-14T13:28:20",
	        "isAnswered": true,
	        "markedByStaff": true
	    },
	    {
	        "id": 42,
	        "name": "Harriet Osborn",
	        "title": "eu consectetur dolore pariatur proident dolore ad",
	        "category": 5,
	        "votes": 6,
	        "answers": 6,
	        "views": 122,
	        "submitTime": "2014-04-27T12:46:22",
	        "isAnswered": true,
	        "markedByStaff": false
	    },
	    {
	        "id": 43,
	        "name": "Marcy Marks",
	        "title": "duis officia deserunt id aliquip sint ea",
	        "category": 5,
	        "votes": 15,
	        "answers": 27,
	        "views": 184,
	        "submitTime": "2014-05-13T02:12:36",
	        "isAnswered": true,
	        "markedByStaff": false
	    },
	    {
	        "id": 44,
	        "name": "Amanda Harrington",
	        "title": "commodo commodo culpa consectetur sit ea culpa",
	        "category": 7,
	        "votes": 17,
	        "answers": 4,
	        "views": 203,
	        "submitTime": "2014-05-11T07:13:43",
	        "isAnswered": false,
	        "markedByStaff": true
	    },
	    {
	        "id": 45,
	        "name": "Kelli Giles",
	        "title": "irure voluptate aliqua cillum id adipisicing labore",
	        "category": 3,
	        "votes": 18,
	        "answers": 1,
	        "views": 36,
	        "submitTime": "2014-01-29T23:08:31",
	        "isAnswered": true,
	        "markedByStaff": true
	    },
	    {
	        "id": 46,
	        "name": "Summer Woods",
	        "title": "consequat enim tempor ullamco magna quis reprehenderit",
	        "category": 4,
	        "votes": 13,
	        "answers": 7,
	        "views": 383,
	        "submitTime": "2014-01-09T06:46:01",
	        "isAnswered": true,
	        "markedByStaff": true
	    },
	    {
	        "id": 47,
	        "name": "Ollie Walter",
	        "title": "occaecat aliqua veniam pariatur consequat qui nostrud",
	        "category": 1,
	        "votes": 5,
	        "answers": 24,
	        "views": 463,
	        "submitTime": "2014-01-25T02:20:59",
	        "isAnswered": false,
	        "markedByStaff": false
	    },
	    {
	        "id": 48,
	        "name": "Brock Sloan",
	        "title": "reprehenderit tempor do dolore amet veniam labore",
	        "category": 5,
	        "votes": 14,
	        "answers": 10,
	        "views": 80,
	        "submitTime": "2014-01-30T20:12:52",
	        "isAnswered": false,
	        "markedByStaff": true
	    },
	    {
	        "id": 49,
	        "name": "Savannah Morgan",
	        "title": "commodo consequat culpa excepteur non ex et",
	        "category": 6,
	        "votes": 12,
	        "answers": 25,
	        "views": 75,
	        "submitTime": "2014-06-04T10:27:06",
	        "isAnswered": true,
	        "markedByStaff": false
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
		{id:0,	name:"New"},	
		{id:1,	name:"Pending"},
		{id:2,	name:"Approved"},
		{id:3,	name:"Rejected"},
		{id:4,	name:"Featured"}
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
  
  // Write your Javascript!

});