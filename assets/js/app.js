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

// ROUTERS

/* app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/moc/:mid', {controller: 'MocController'}).
      	otherwise({redirectTo: '/tasks'});
}]);*/

/* app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/tasks', {templateUrl: 'partials/task-list.html', controller: 'TaskListController'}).
	  when('/tasks/new', {templateUrl: 'partials/task-new.html', controller: 'TaskListController'}).
      when('/tasks/:taskId', {templateUrl: 'partials/task-detail.html', controller: 'TaskListController'}).
      otherwise({redirectTo: '/tasks'});
}]);*/

// CONTROLLERS

/* MOC controller */

app.controller('MocController', function($scope, $location, mocResource, tagResource, statusResource, metaResource) {

	$scope.mocs = mocResource.list();
	$scope.statii = statusResource.list();
	
	var id = getIdFromUrl($location);
	$scope.single = mocResource.findById(id);

	$scope.showTags = true;

	$scope.getTagNames = function(tags) {
		// tags is an array of tag id's
		var str = '';

		_.each(tags, function(id) {
			str += tagResource.findNameById(id) + ', ';
		});

		return str.substring(0, str.length-2);		// remove the final ", " in str
	};

	$scope.getStatus = function(status) {
		return statusResource.findNameById(status);
	};

	$scope.getTitle = function(id) {
		return metaResource.findTitleById(id);
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

/* Tag controller */

app.controller('TagsController', function($scope, $location, tagResource) {

	$scope.tags = tagResource.list();

	$scope.tagOrder = '-count';		// default tag order: sort by popularity

	$scope.max = tagResource.maxCount();

});

app.controller('TagController', function($scope, $location, mocResource, tagResource, metaResource) {

	var id = getIdFromUrl($location);
	$scope.tag = tagResource.findById(id);

	$scope.mocs = mocResource.filterByTagId(id);

	$scope.showTags = false;

	$scope.getTitle = function(id) {
		return metaResource.findTitleById(id);
	};
	$scope.getRatings = function(id) {
		return mocResource.ratingsById(id);
	};

});


// HELPERS

function getIdFromUrl(location) {
	var id = 0;
	if (location.path()) id = location.path().substr(1);		// remove the first character, '/'
	return id;
}


// FACTORIES

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
		        ]
		    }
		]
	*/

	var data = [
	    {
	        "id": 0,
	        "name": "Janette Bailey",
	        "username": "Medesign",
	        "ratings": 5,
	        "raters": 8,
	        "comments": 6,
	        "fee": 0,
	        "parts": 69,
	        "content": "In voluptate nostrud labore voluptate. Ipsum ex cupidatat anim ex sit aliquip cupidatat pariatur non ut in anim. Labore labore esse pariatur dolor laborum magna in anim. Consequat Lorem mollit ea exercitation incididunt mollit ex deserunt tempor non exercitation aliqua.\r\n",
	        "submitTime": "2014-04-03T18:32:21",
	        "status": 3,
	        "tags": [
	            8,
	            5
	        ]
	    },
	    {
	        "id": 1,
	        "name": "Justice Gallegos",
	        "username": "Norsul",
	        "ratings": 0,
	        "raters": 125,
	        "comments": 7,
	        "fee": 5,
	        "parts": 37,
	        "content": "Quis ullamco ullamco culpa ex velit magna cillum eiusmod reprehenderit. Labore aute deserunt commodo ut fugiat aute pariatur. Tempor sunt do velit aute ex commodo nostrud voluptate nostrud cillum qui. Qui ex excepteur adipisicing esse voluptate adipisicing incididunt amet et.\r\n",
	        "submitTime": "2014-02-10T10:45:49",
	        "status": 1,
	        "tags": [
	            5,
	            8,
	            6
	        ]
	    },
	    {
	        "id": 2,
	        "name": "Millie Morton",
	        "username": "Viagrand",
	        "ratings": 4,
	        "raters": 6,
	        "comments": 2,
	        "fee": 3,
	        "parts": 93,
	        "content": "Eu sit nostrud aliqua consectetur in et anim veniam aute enim. Nulla ad minim anim eu irure amet sint id ullamco deserunt. Qui sunt incididunt consequat Lorem sunt. Labore elit nisi nostrud deserunt excepteur pariatur minim. Velit eu tempor in commodo commodo dolor aliqua nostrud consequat eu exercitation exercitation consequat. Lorem exercitation et culpa dolore cupidatat mollit nostrud sit excepteur ipsum deserunt.\r\n",
	        "submitTime": "2014-05-10T05:57:05",
	        "status": 4,
	        "tags": [
	            7,
	            6,
	            20,
	            19,
	            4
	        ]
	    },
	    {
	        "id": 3,
	        "name": "Jerry Myers",
	        "username": "Dymi",
	        "ratings": 0,
	        "raters": 178,
	        "comments": 2,
	        "fee": 3,
	        "parts": 84,
	        "content": "Lorem consequat ut nisi nulla deserunt amet. Occaecat elit ipsum excepteur ad minim incididunt quis. Magna sint esse nulla anim ex adipisicing voluptate. Deserunt et amet ut et duis id eiusmod laboris do dolor elit elit ipsum.\r\n",
	        "submitTime": "2014-02-07T06:10:15",
	        "status": 3,
	        "tags": [
	            17,
	            11,
	            18,
	            13,
	            0
	        ]
	    },
	    {
	        "id": 4,
	        "name": "Felecia Sims",
	        "username": "Ovation",
	        "ratings": 3,
	        "raters": 157,
	        "comments": 1,
	        "fee": 4,
	        "parts": 42,
	        "content": "Voluptate laboris id qui dolore nisi cupidatat ullamco mollit sint quis non cupidatat. Nulla proident est minim elit dolore non irure ipsum exercitation. Tempor ad labore irure commodo. Adipisicing aute incididunt veniam mollit in dolore duis ullamco officia aliqua labore do. Nulla nostrud excepteur laborum sit cillum. Esse minim deserunt mollit consequat ipsum dolor nulla dolore esse.\r\n",
	        "submitTime": "2014-04-18T17:31:45",
	        "status": 4,
	        "tags": [
	            13,
	            0,
	            6,
	            5,
	            16
	        ]
	    },
	    {
	        "id": 5,
	        "name": "Reeves Moore",
	        "username": "Wrapture",
	        "ratings": 1,
	        "raters": 58,
	        "comments": 10,
	        "fee": 2,
	        "parts": 54,
	        "content": "Aute aute occaecat sunt cupidatat officia nostrud proident. Proident dolore eu occaecat nisi adipisicing consectetur dolor ullamco. Culpa qui quis cupidatat ullamco officia dolor aute. Sint adipisicing commodo aliquip veniam ullamco ad fugiat irure ut dolore. Lorem fugiat proident anim quis veniam elit ut nisi eiusmod. Officia labore cupidatat tempor ea do ex esse anim laborum ipsum.\r\n",
	        "submitTime": "2014-01-16T01:22:55",
	        "status": 0,
	        "tags": [
	            16
	        ]
	    },
	    {
	        "id": 6,
	        "name": "Jody Roberts",
	        "username": "Kyaguru",
	        "ratings": 3,
	        "raters": 95,
	        "comments": 8,
	        "fee": 3,
	        "parts": 5,
	        "content": "Pariatur reprehenderit non adipisicing eiusmod id deserunt ut aliqua amet ullamco dolor. Elit dolore excepteur labore dolor fugiat ipsum proident esse velit anim magna culpa exercitation. In nostrud deserunt laboris reprehenderit occaecat voluptate cupidatat. Quis in consectetur esse minim reprehenderit duis pariatur. Ut elit velit Lorem exercitation. Cupidatat duis elit officia deserunt eiusmod in sint est tempor ipsum. Aliquip sint ex deserunt proident proident pariatur sit nulla.\r\n",
	        "submitTime": "2014-05-11T08:19:08",
	        "status": 4,
	        "tags": [
	            3,
	            6,
	            3
	        ]
	    },
	    {
	        "id": 7,
	        "name": "Mueller Lang",
	        "username": "Norsup",
	        "ratings": 2,
	        "raters": 177,
	        "comments": 2,
	        "fee": 0,
	        "parts": 52,
	        "content": "Pariatur consequat voluptate et sit culpa velit pariatur voluptate. Adipisicing deserunt ad labore elit magna. Mollit ullamco aute ullamco magna mollit sit exercitation ipsum aliquip irure elit. Aute fugiat velit tempor pariatur nulla deserunt.\r\n",
	        "submitTime": "2014-01-24T23:19:16",
	        "status": 1,
	        "tags": [
	            3,
	            16
	        ]
	    },
	    {
	        "id": 8,
	        "name": "Patsy Reid",
	        "username": "Enersol",
	        "ratings": 2,
	        "raters": 182,
	        "comments": 9,
	        "fee": 3,
	        "parts": 37,
	        "content": "Qui irure culpa eiusmod reprehenderit. Exercitation laboris veniam ullamco ad Lorem elit aute et nulla consequat ut enim pariatur. Culpa reprehenderit exercitation reprehenderit exercitation et tempor enim excepteur aliqua sint quis ex. Officia qui quis non in laboris et eiusmod consequat cillum labore fugiat sunt. Ut qui exercitation et adipisicing eiusmod. Incididunt tempor nostrud officia cillum. Minim consequat elit irure velit.\r\n",
	        "submitTime": "2014-02-18T13:48:55",
	        "status": 2,
	        "tags": [
	            19,
	            0
	        ]
	    },
	    {
	        "id": 9,
	        "name": "Dionne Ratliff",
	        "username": "Ohmnet",
	        "ratings": 1,
	        "raters": 49,
	        "comments": 4,
	        "fee": 1,
	        "parts": 78,
	        "content": "Dolore eiusmod magna aliqua ullamco tempor occaecat aliquip et in veniam dolore. Proident aliquip adipisicing est est mollit deserunt et consectetur ullamco duis sint qui. Eu proident nostrud in minim eu voluptate nulla sint sint exercitation elit dolor.\r\n",
	        "submitTime": "2014-04-30T19:33:31",
	        "status": 0,
	        "tags": [
	            5,
	            5,
	            5
	        ]
	    },
	    {
	        "id": 10,
	        "name": "Dena Richard",
	        "username": "Injoy",
	        "ratings": 0,
	        "raters": 8,
	        "comments": 1,
	        "fee": 0,
	        "parts": 58,
	        "content": "Mollit magna deserunt dolor sint voluptate excepteur ea commodo et culpa. Exercitation excepteur dolore tempor ipsum mollit ea laborum voluptate ad. Velit enim anim dolor culpa exercitation cillum.\r\n",
	        "submitTime": "2014-05-09T22:31:02",
	        "status": 0,
	        "tags": [
	            17,
	            8,
	            6,
	            2,
	            5
	        ]
	    },
	    {
	        "id": 11,
	        "name": "Muriel Lee",
	        "username": "Equitax",
	        "ratings": 5,
	        "raters": 33,
	        "comments": 4,
	        "fee": 1,
	        "parts": 20,
	        "content": "Enim cupidatat id magna consequat tempor culpa velit aute. In velit aliquip nostrud laborum exercitation sunt exercitation. Laboris adipisicing irure excepteur est aute qui eiusmod non irure cupidatat qui consequat. Tempor est cupidatat tempor irure. Pariatur eu laboris eiusmod est ea tempor. Amet minim irure mollit deserunt aliquip aliqua nulla eiusmod aliqua est. Incididunt qui velit incididunt proident et cillum Lorem esse voluptate sit esse.\r\n",
	        "submitTime": "2014-02-17T19:34:13",
	        "status": 3,
	        "tags": [
	            18,
	            9,
	            1,
	            12,
	            8
	        ]
	    },
	    {
	        "id": 12,
	        "name": "Stacy Hood",
	        "username": "Proflex",
	        "ratings": 2,
	        "raters": 109,
	        "comments": 5,
	        "fee": 4,
	        "parts": 16,
	        "content": "Ipsum consequat ipsum cupidatat officia. Velit dolore ut anim reprehenderit ullamco amet proident consectetur. In Lorem magna irure non. Aliquip ullamco dolore anim consequat occaecat dolore consectetur do nostrud incididunt irure dolore anim. Voluptate esse consequat fugiat mollit labore. Do amet sint enim aliquip et ullamco consequat minim minim in duis officia qui sit. Officia irure labore do duis ea ut ullamco aliquip et deserunt mollit irure.\r\n",
	        "submitTime": "2014-04-22T04:46:29",
	        "status": 4,
	        "tags": [
	            0,
	            14,
	            1,
	            13,
	            14
	        ]
	    },
	    {
	        "id": 13,
	        "name": "Terrie Martin",
	        "username": "Recrisys",
	        "ratings": 0,
	        "raters": 170,
	        "comments": 7,
	        "fee": 1,
	        "parts": 46,
	        "content": "Qui irure cupidatat veniam reprehenderit eu eu. Enim in occaecat est qui cupidatat cillum fugiat culpa. Est do commodo culpa consequat. Nulla enim eu incididunt pariatur ea ex esse officia laboris magna. Commodo voluptate ea aute non nostrud culpa nisi cupidatat aliquip ullamco labore. In adipisicing commodo dolore quis reprehenderit incididunt amet nisi laborum irure incididunt esse.\r\n",
	        "submitTime": "2014-01-23T21:05:43",
	        "status": 1,
	        "tags": [
	            7
	        ]
	    },
	    {
	        "id": 14,
	        "name": "Curtis Turner",
	        "username": "Sonique",
	        "ratings": 2,
	        "raters": 175,
	        "comments": 5,
	        "fee": 0,
	        "parts": 14,
	        "content": "Irure magna aute aliquip duis ipsum ea aliquip et magna est officia occaecat reprehenderit ut. Cillum voluptate cillum veniam aliquip officia mollit duis adipisicing deserunt mollit id exercitation irure. Consequat do mollit enim esse amet amet ea sit ad. Amet cupidatat voluptate eu incididunt sit voluptate consequat culpa ut est sit. Do adipisicing et nostrud eu nostrud commodo. Anim exercitation occaecat deserunt amet id duis nisi cillum irure. Tempor qui consectetur Lorem non id proident velit laboris nostrud est pariatur nisi.\r\n",
	        "submitTime": "2014-04-08T02:19:38",
	        "status": 4,
	        "tags": [
	            18,
	            2,
	            5,
	            16
	        ]
	    },
	    {
	        "id": 15,
	        "name": "Claudia Dale",
	        "username": "Genekom",
	        "ratings": 2,
	        "raters": 120,
	        "comments": 2,
	        "fee": 1,
	        "parts": 62,
	        "content": "Occaecat ad adipisicing officia officia aliqua irure ullamco proident id cillum do ut. Veniam nostrud nisi sunt quis mollit ullamco cillum. Reprehenderit exercitation excepteur duis laborum.\r\n",
	        "submitTime": "2014-04-05T07:14:05",
	        "status": 0,
	        "tags": [
	            15
	        ]
	    },
	    {
	        "id": 16,
	        "name": "Landry Dawson",
	        "username": "Zanity",
	        "ratings": 4,
	        "raters": 145,
	        "comments": 9,
	        "fee": 2,
	        "parts": 80,
	        "content": "Adipisicing deserunt nulla sint exercitation. Non sunt enim aliquip nisi incididunt. Ipsum qui adipisicing magna eu ea ullamco cillum.\r\n",
	        "submitTime": "2014-04-02T06:21:02",
	        "status": 1,
	        "tags": [
	            4
	        ]
	    },
	    {
	        "id": 17,
	        "name": "Lula Grimes",
	        "username": "Deviltoe",
	        "ratings": 1,
	        "raters": 183,
	        "comments": 7,
	        "fee": 2,
	        "parts": 17,
	        "content": "Qui tempor cupidatat aute nulla ad cillum labore. Laboris sit labore in anim mollit anim excepteur consectetur laborum veniam nulla id ea pariatur. Enim et proident nostrud aliquip nostrud est reprehenderit enim labore ullamco adipisicing pariatur duis.\r\n",
	        "submitTime": "2014-01-06T17:23:06",
	        "status": 1,
	        "tags": [
	            14,
	            7,
	            16,
	            19
	        ]
	    },
	    {
	        "id": 18,
	        "name": "Carly Byers",
	        "username": "Zboo",
	        "ratings": 2,
	        "raters": 189,
	        "comments": 3,
	        "fee": 0,
	        "parts": 58,
	        "content": "Ut laborum occaecat cillum commodo elit nostrud fugiat ad laboris exercitation dolor commodo. Reprehenderit cillum qui fugiat aliqua cillum ipsum Lorem laboris. Consequat nostrud Lorem fugiat nostrud consectetur nulla magna exercitation mollit. Enim deserunt ipsum quis dolor id ipsum dolore anim sint ex ea Lorem velit. Nisi eiusmod cupidatat consectetur sint nulla deserunt. Esse occaecat velit dolor Lorem aliquip laborum. Dolore officia non ullamco proident aliquip magna nostrud ut.\r\n",
	        "submitTime": "2014-01-04T07:59:18",
	        "status": 1,
	        "tags": [
	            19,
	            13
	        ]
	    },
	    {
	        "id": 19,
	        "name": "Whitney Hamilton",
	        "username": "Eventage",
	        "ratings": 1,
	        "raters": 100,
	        "comments": 6,
	        "fee": 0,
	        "parts": 83,
	        "content": "Dolore do ea ullamco aute reprehenderit qui veniam reprehenderit anim mollit. Esse anim ad est exercitation eiusmod aliquip ullamco anim laboris excepteur est cupidatat. Reprehenderit dolore occaecat excepteur dolore sit amet occaecat nostrud nulla commodo ut enim.\r\n",
	        "submitTime": "2014-01-10T01:18:43",
	        "status": 1,
	        "tags": [
	            20,
	            10,
	            17,
	            15,
	            4
	        ]
	    }
	];
		
	return {
		list: function() {
			return data;
		},
		findById: function(id) {
            return _.find(data, function(moc) {
                return moc.id == id;
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
            	html += ' (' + moc.raters + ')';
            }
            else html = 'No ratings yet';
            
            return html;
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
            return _.find(data, function (moc) {
                return moc.id == id;
            });
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
		},
		findNameById: function(id) {
            var s = _.find(data, function (status) {
                return status.id == id;
            });

            return s.name;
        }
	}
});

app.factory('metaResource', function () {

	var data = [
		{id:0,	title:"The Fail Whale"},
		{id:1,	title:"Hogwarts Castle"},
		{id:2,	title:"This is the Captain Speaking"},
		{id:3,	title:"The Kingdom of Super Bite-Sized Tiny Little Lego People of Hobbitton"},
		{id:4,	title:"My Little Typewriter"},
		{id:5,	title:"Tank in Snow"},
		{id:6,	title:"The Gray Battalion"},
		{id:7,	title:"Shelob"},
		{id:8,	title:"USS Enterprise"},
		{id:9,	title:"The White Crane"},
		{id:10,	title:"Mecha of Doom"},
		{id:11,	title:"R2D2, where are you?"},
		{id:12,	title:"Crows Landing"},
		{id:13,	title:"Blockheads"},
		{id:14,	title:"2001: Space Odyssey"},
		{id:15,	title:"Bomber Plane"},
		{id:16,	title:"Assimilation is Inevitable"},
		{id:17,	title:"Cancer is in my DNA"},
		{id:18,	title:"Polly wants a cracker!"},
		{id:19,	title:"Alice in Wonderland"},
	];
	
	return {
		list: function() {
			return data;
		},
		findById: function(id) {
            return _.find(data, function (moc) {
                return moc.id == id;
            });
        },
		findTitleById: function(id) {
            var meta = this.findById(id%data.length);
            return meta.title;
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