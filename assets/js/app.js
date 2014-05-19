/*	
Created by Abe Yang 5/14/2014

	Legend:
	+ mid = MOC id
	
*/

// =========================================================================================================
//
// ANGULAR MAGIC
//
// =========================================================================================================

'use strict';

var app = angular.module('app', ['ngSanitize']);

// ROUTERS

// app.config(['$routeProvider', function($routeProvider) {
//   $routeProvider.
//       when('/moc/:mid', {controller: 'MocController'}).
//       	otherwise({redirectTo: '/tasks'});
// }]);

// app.config(['$routeProvider', function($routeProvider) {
//   $routeProvider.
//       when('/tasks', {templateUrl: 'partials/task-list.html', controller: 'TaskListController'}).
// 	  when('/tasks/new', {templateUrl: 'partials/task-new.html', controller: 'TaskListController'}).
//       when('/tasks/:taskId', {templateUrl: 'partials/task-detail.html', controller: 'TaskListController'}).
//       otherwise({redirectTo: '/tasks'});
// }]);

// CONTROLLERS

/* 	MOC controller */

app.controller('MocController', function($scope, $location, mocResource, tagResource, statusResource, metaResource) {

	$scope.mocs = mocResource.list();

	if ($location.path()) $scope.mid = $location.path().substr(1);		// remove the first character, '/'
	else $scope.mid = 0;
	
	$scope.single = mocResource.findById($scope.mid);

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

	$scope.filterCards = {
		isFeatured: '',
		status: 0
	};

});


// FACTORIES

app.factory('mocResource', function () {

	// http://www.json-generator.com/
	/*
		[
		    '{{repeat(10)}}',
		    {
		        id: '{{index()}}',
		        name: '{{firstName()}} {{surname()}}',
		        username: '{{company()}}',
		        isFeatured: '{{bool()}}',
		        ratings: '{{integer(0, 5)}}',
		        raters: '{{integer(1, 200)}}',
                comments: '{{integer(0, 10)}}',
		        fee: '{{integer(0, 5)}}',
		        parts: '{{integer(1, 100)}}',
		        content: '{{lorem(1, "paragraphs")}}',
		        submitTime: '{{date(new Date(2014, 0, 1), new Date(), "YYYY-MM-ddThh:mm:ss")}}',
		        status: '{{integer(0, 3)}}',
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
	        "name": "Katie Browning",
	        "username": "Aquoavo",
	        "isFeatured": true,
	        "ratings": 1,
	        "raters": 109,
	        "comments": 5,
	        "fee": 0,
	        "parts": 62,
	        "title": "occaecat sunt labore pariatur dolore sint ex",
	        "content": "Do enim aliquip ea ex adipisicing velit sit dolor. Enim ex ex sint exercitation consequat ex esse. Nostrud proident culpa sunt elit adipisicing sunt amet cillum do.\r\n",
	        "submitTime": "2014-02-22T00:58:38",
	        "status": 0,
	        "tags": [
	            11
	        ]
	    },
	    {
	        "id": 1,
	        "name": "Lynnette Lee",
	        "username": "Mangelica",
	        "isFeatured": true,
	        "ratings": 5,
	        "raters": 97,
	        "comments": 10,
	        "fee": 0,
	        "parts": 80,
	        "title": "veniam incididunt cupidatat elit sit eiusmod sint",
	        "content": "Sunt nisi exercitation cillum officia velit commodo ullamco commodo. Sunt eiusmod qui irure pariatur. Cupidatat occaecat tempor commodo irure in pariatur incididunt excepteur consectetur consequat ullamco sint tempor enim. Commodo adipisicing ea culpa deserunt cillum Lorem magna exercitation. Consequat excepteur reprehenderit aute cupidatat nisi voluptate magna veniam veniam. Dolore commodo eu amet sint qui nostrud do ad.\r\n",
	        "submitTime": "2014-04-27T06:57:29",
	        "status": 0,
	        "tags": [
	            17,
	            2,
	            17,
	            1,
	            16
	        ]
	    },
	    {
	        "id": 2,
	        "name": "Kim Miller",
	        "username": "Renovize",
	        "isFeatured": false,
	        "ratings": 5,
	        "raters": 59,
	        "comments": 1,
	        "fee": 2,
	        "parts": 93,
	        "title": "minim sit laboris eiusmod duis pariatur elit",
	        "content": "Occaecat duis elit Lorem consequat et aute magna labore officia eu enim amet. Velit ullamco voluptate est reprehenderit amet voluptate. Ex elit aute velit sunt laborum officia cupidatat magna deserunt exercitation non. Anim aliqua consectetur ad deserunt dolor sint adipisicing voluptate nulla. Labore tempor sint tempor velit id ex sit nulla excepteur enim excepteur. Do eu minim cupidatat laborum in eu irure.\r\n",
	        "submitTime": "2014-04-06T17:52:53",
	        "status": 3,
	        "tags": [
	            4,
	            5,
	            11,
	            7,
	            16
	        ]
	    },
	    {
	        "id": 3,
	        "name": "Marsha Dixon",
	        "username": "Gology",
	        "isFeatured": false,
	        "ratings": 2,
	        "raters": 187,
	        "comments": 1,
	        "fee": 4,
	        "parts": 72,
	        "title": "reprehenderit veniam magna laborum laborum ullamco culpa",
	        "content": "Ea eu culpa voluptate fugiat incididunt quis ex elit. Velit irure sint sunt elit mollit eu dolore deserunt ea magna pariatur. Consectetur irure reprehenderit proident esse esse excepteur nulla ut incididunt ut. Irure aliqua ut incididunt occaecat consectetur fugiat veniam in officia aute Lorem mollit esse enim. Aliqua esse cupidatat sit ullamco enim pariatur laborum aute voluptate ipsum id id. Voluptate aute anim laborum est pariatur eu ut cupidatat est. Laboris tempor aute proident tempor ut proident magna id aute aute occaecat eiusmod velit.\r\n",
	        "submitTime": "2014-01-26T15:11:41",
	        "status": 0,
	        "tags": [
	            12,
	            8,
	            1
	        ]
	    },
	    {
	        "id": 4,
	        "name": "Christina Juarez",
	        "username": "Comtent",
	        "isFeatured": true,
	        "ratings": 4,
	        "raters": 89,
	        "comments": 2,
	        "fee": 5,
	        "parts": 72,
	        "title": "exercitation commodo pariatur enim ad nisi adipisicing",
	        "content": "Ex incididunt eu sunt ipsum non dolore excepteur incididunt. Ut sunt ad fugiat ex in amet nulla eiusmod excepteur. Sint minim nostrud officia officia laboris laborum aliquip magna qui do. Amet dolor officia exercitation proident deserunt excepteur voluptate culpa do enim magna occaecat. Nisi amet culpa duis ut cupidatat minim. Ipsum incididunt veniam ea cupidatat nostrud veniam ad anim cillum exercitation adipisicing deserunt laborum.\r\n",
	        "submitTime": "2014-01-12T10:14:49",
	        "status": 3,
	        "tags": [
	            19,
	            17,
	            0,
	            17
	        ]
	    },
	    {
	        "id": 5,
	        "name": "Strickland Merrill",
	        "username": "Sentia",
	        "isFeatured": true,
	        "ratings": 0,
	        "raters": 14,
	        "comments": 6,
	        "fee": 0,
	        "parts": 5,
	        "title": "nulla cillum laboris exercitation velit nisi consectetur",
	        "content": "Amet deserunt minim labore sint duis nisi id sunt sint cupidatat esse est duis. Pariatur nisi cupidatat nostrud non exercitation consectetur magna mollit. Adipisicing enim qui culpa ea commodo occaecat deserunt. Nulla do esse deserunt elit velit id fugiat sit sint laboris. Eu cillum enim do cupidatat Lorem mollit eu culpa deserunt.\r\n",
	        "submitTime": "2014-01-19T02:52:26",
	        "status": 1,
	        "tags": [
	            19,
	            4,
	            16,
	            9,
	            14
	        ]
	    },
	    {
	        "id": 6,
	        "name": "Martin Shelton",
	        "username": "Yogasm",
	        "isFeatured": true,
	        "ratings": 3,
	        "raters": 65,
	        "comments": 10,
	        "fee": 3,
	        "parts": 61,
	        "title": "irure minim adipisicing esse consectetur consequat et",
	        "content": "Duis amet qui commodo consectetur aute ut commodo culpa qui veniam. Adipisicing ipsum ea ad est qui quis consequat incididunt non irure laboris. Aute irure exercitation nostrud reprehenderit exercitation commodo adipisicing.\r\n",
	        "submitTime": "2014-03-11T12:29:36",
	        "status": 3,
	        "tags": [
	            8,
	            10,
	            16,
	            13
	        ]
	    },
	    {
	        "id": 7,
	        "name": "Atkins Pacheco",
	        "username": "Balooba",
	        "isFeatured": true,
	        "ratings": 2,
	        "raters": 184,
	        "comments": 2,
	        "fee": 2,
	        "parts": 43,
	        "title": "amet consectetur velit ex proident sunt dolor",
	        "content": "Eiusmod nisi laborum sint ad culpa culpa nulla quis. Velit duis cupidatat qui velit cupidatat reprehenderit labore reprehenderit deserunt. Consectetur excepteur voluptate quis anim anim adipisicing dolor. Aliqua eiusmod nostrud ea duis adipisicing. Sit excepteur ex sit duis consectetur.\r\n",
	        "submitTime": "2014-04-16T12:23:35",
	        "status": 1,
	        "tags": [
	            10,
	            1
	        ]
	    },
	    {
	        "id": 8,
	        "name": "Nona Maldonado",
	        "username": "Zidant",
	        "isFeatured": false,
	        "ratings": 5,
	        "raters": 195,
	        "comments": 1,
	        "fee": 5,
	        "parts": 2,
	        "title": "velit dolore mollit nulla reprehenderit elit in",
	        "content": "Ut nisi quis incididunt ad ad sint. Pariatur est ad amet et veniam velit qui et qui aliquip elit veniam. In pariatur adipisicing irure aute irure adipisicing in enim elit. Culpa nulla irure quis pariatur deserunt laborum magna nostrud cupidatat laborum officia culpa. Id ipsum irure elit reprehenderit consectetur ullamco quis aliquip non aute. Nisi ullamco veniam consequat veniam voluptate aute duis nulla in qui aliqua consequat qui.\r\n",
	        "submitTime": "2014-04-23T10:29:14",
	        "status": 0,
	        "tags": [
	            7
	        ]
	    },
	    {
	        "id": 9,
	        "name": "Swanson Camacho",
	        "username": "Exozent",
	        "isFeatured": true,
	        "ratings": 0,
	        "raters": 148,
	        "comments": 5,
	        "fee": 5,
	        "parts": 100,
	        "title": "ad magna cupidatat sunt labore id ipsum",
	        "content": "Magna amet consectetur cillum magna fugiat occaecat Lorem aliquip dolor pariatur. Esse nulla nostrud irure dolor sunt ad adipisicing nostrud. Quis consectetur ipsum deserunt amet eiusmod officia amet irure consequat. Eiusmod deserunt qui reprehenderit incididunt elit ipsum velit in veniam aliquip. Dolor cupidatat deserunt ipsum consequat irure. Qui velit mollit quis labore deserunt minim proident esse consequat. Reprehenderit aliqua reprehenderit dolor elit sit quis laboris.\r\n",
	        "submitTime": "2014-03-13T18:38:31",
	        "status": 0,
	        "tags": [
	            15,
	            10,
	            16,
	            3,
	            1
	        ]
	    }
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
        ratingsById: function(id) {
        	var moc = this.findById(id);
        	var html = '';
            if (moc.raters) {
            	for (var i=1; i<=5; i++) {
            		if (moc.ratings >= i) html += '<i class="fa fa-star"></i>';
            		else html += '<i class="fa fa-star-o"></i>';
            	}
            }
            html += ' (' + moc.raters + ')';
            return html;
        }
	}
});

app.factory('tagResource', function () {

	var data = [
		{id:0,	tagname:"Ship"},
		{id:1,	tagname:"Red"},
		{id:2,	tagname:"Brown"},
		{id:3,	tagname:"Black"},
		{id:4,	tagname:"White",},
		{id:5,	tagname:"Plane"},
		{id:6,	tagname:"Boat"},
		{id:7,	tagname:"House"},
		{id:8,	tagname:"Horse"},
		{id:9,	tagname:"Dog"},
		{id:10,	tagname:"Cat"},
		{id:11,	tagname:"Mouse"},
		{id:12,	tagname:"Hamster"},
		{id:13,	tagname:"Thing"},
		{id:14,	tagname:"Purple",},
		{id:15,	tagname:"Blue"},
		{id:16,	tagname:"Sweet"},
		{id:17,	tagname:"Console"},
		{id:18,	tagname:"Eagle"},
		{id:19,	tagname:"Mecha"},
		{id:20,	tagname:"Robot"}
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
        }
	}
});

app.factory('statusResource', function () {

	var data = [
		{id:0,	name:"New"},	
		{id:1,	name:"Pending"},
		{id:2,	name:"Approved"},
		{id:3,	name:"Rejected"}
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
		{id:9,	title:"The White Crane"}
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
            var meta = this.findById(id);
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