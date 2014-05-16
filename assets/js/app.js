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

var app = angular.module('app', []);

// ROUTERS

// app.config(['$routeProvider', function($routeProvider) {
//   $routeProvider.
//       when('/tasks', {templateUrl: 'partials/task-list.html', controller: 'TaskListController'}).
// 	  when('/tasks/new', {templateUrl: 'partials/task-new.html', controller: 'TaskListController'}).
//       when('/tasks/:taskId', {templateUrl: 'partials/task-detail.html', controller: 'TaskListController'}).
//       otherwise({redirectTo: '/tasks'});
// }]);

// CONTROLLERS

/* 	MOC controller */

app.controller('MocController', function($scope, mocResource, tagResource, statusResource) {

	$scope.mocs = mocResource.list();
	$scope.single = mocResource.findById(0);

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
		        fee: '{{integer(0, 5)}}',
		        parts: '{{integer(1, 100)}}',
		        title: '{{lorem(7, "words")}}',
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
	        "name": "Avis Medina",
	        "username": "Fangold",
	        "isFeatured": true,
	        "ratings": 0,
	        "raters": 14,
	        "fee": 1,
	        "parts": 65,
	        "title": "reprehenderit veniam cupidatat quis non commodo exercitation",
	        "content": "Quis adipisicing et est et nisi adipisicing non. In ut qui nisi commodo laboris enim qui ex quis commodo sunt enim pariatur est. Tempor exercitation ea qui officia nisi elit occaecat nostrud incididunt eiusmod ut. Incididunt dolor aute quis eu labore excepteur reprehenderit proident aute ea.\r\n",
	        "submitTime": "2014-01-04T01:20:26",
	        "status": 2,
	        "tags": [
	            14,
	            3
	        ]
	    },
	    {
	        "id": 1,
	        "name": "Sweet Hale",
	        "username": "Zidox",
	        "isFeatured": true,
	        "ratings": 1,
	        "raters": 18,
	        "fee": 4,
	        "parts": 15,
	        "title": "Lorem cillum non consectetur ullamco do mollit",
	        "content": "Eu tempor velit tempor nostrud velit. Ea aliqua laboris enim ea occaecat labore ut ex dolore ullamco dolore mollit laboris dolore. Qui voluptate voluptate culpa aliqua nisi deserunt ullamco sit nisi deserunt sint excepteur consequat adipisicing. Adipisicing ad veniam magna nostrud sit.\r\n",
	        "submitTime": "2014-05-02T12:15:34",
	        "status": 2,
	        "tags": [
	            11,
	            17,
	            20,
	            2
	        ]
	    },
	    {
	        "id": 2,
	        "name": "Boyle Witt",
	        "username": "Aquacine",
	        "isFeatured": true,
	        "ratings": 2,
	        "raters": 5,
	        "fee": 1,
	        "parts": 65,
	        "title": "dolor aliquip aliquip cupidatat ea ex eu",
	        "content": "Ad consequat enim nisi eiusmod aute ipsum aute et. Consectetur anim eiusmod id Lorem aliquip. Ipsum amet consectetur ut reprehenderit magna. Incididunt aliquip incididunt fugiat tempor laboris aliquip pariatur officia veniam. Id esse quis nulla velit reprehenderit. Aliqua Lorem consectetur labore duis ea magna velit sunt tempor.\r\n",
	        "submitTime": "2014-01-01T22:24:20",
	        "status": 3,
	        "tags": [
	            20,
	            6,
	            0,
	            16
	        ]
	    },
	    {
	        "id": 3,
	        "name": "Oneil Bond",
	        "username": "Printspan",
	        "isFeatured": false,
	        "ratings": 5,
	        "raters": 189,
	        "fee": 4,
	        "parts": 31,
	        "title": "in commodo nostrud veniam sunt reprehenderit excepteur",
	        "content": "Occaecat nostrud consectetur enim non. Dolore esse irure sunt nostrud pariatur quis nisi esse culpa. Ipsum esse pariatur aliqua in anim cupidatat duis excepteur fugiat consectetur sit do officia quis.\r\n",
	        "submitTime": "2014-02-18T20:51:25",
	        "status": 0,
	        "tags": [
	            11,
	            8,
	            7,
	            4,
	            3
	        ]
	    },
	    {
	        "id": 4,
	        "name": "Lorraine Miles",
	        "username": "Octocore",
	        "isFeatured": true,
	        "ratings": 1,
	        "raters": 86,
	        "fee": 5,
	        "parts": 46,
	        "title": "minim mollit eu est non ex deserunt",
	        "content": "Ipsum qui laboris ipsum pariatur ad minim. Ea eu mollit nulla dolor amet. Laborum nisi ipsum mollit mollit veniam deserunt. Fugiat velit nisi deserunt eiusmod enim deserunt aute. Irure Lorem eiusmod ea exercitation fugiat magna officia mollit adipisicing ut adipisicing.\r\n",
	        "submitTime": "2014-03-16T20:50:46",
	        "status": 2,
	        "tags": [
	            12,
	            19,
	            6,
	            5,
	            4
	        ]
	    },
	    {
	        "id": 5,
	        "name": "Katie Jenkins",
	        "username": "Tourmania",
	        "isFeatured": false,
	        "ratings": 2,
	        "raters": 13,
	        "fee": 1,
	        "parts": 48,
	        "title": "quis minim proident velit qui adipisicing eiusmod",
	        "content": "Ad exercitation proident consequat magna nulla in amet ipsum aute aliquip veniam labore sunt. Eiusmod labore commodo amet adipisicing. Tempor nulla aliquip excepteur eiusmod enim et non veniam cupidatat velit fugiat non amet cupidatat. Magna nulla occaecat dolore eiusmod cillum eu eiusmod amet.\r\n",
	        "submitTime": "2014-03-09T07:40:08",
	        "status": 3,
	        "tags": [
	            20,
	            10,
	            11
	        ]
	    },
	    {
	        "id": 6,
	        "name": "Gonzalez Page",
	        "username": "Kyaguru",
	        "isFeatured": false,
	        "ratings": 4,
	        "raters": 76,
	        "fee": 0,
	        "parts": 100,
	        "title": "minim nulla cupidatat aliquip fugiat in qui",
	        "content": "Consequat cupidatat qui cillum dolore duis id ex est. Veniam aute aliquip duis sint qui. Mollit quis irure velit in. Nulla cillum officia eu enim incididunt non. Deserunt laborum est mollit consectetur cillum reprehenderit laboris esse fugiat qui pariatur nisi commodo qui. Dolor aliqua nisi eiusmod consequat excepteur aliqua in. Do ea cillum non laborum et velit ad deserunt magna.\r\n",
	        "submitTime": "2014-01-07T13:00:26",
	        "status": 0,
	        "tags": [
	            0,
	            19,
	            11,
	            14,
	            12
	        ]
	    },
	    {
	        "id": 7,
	        "name": "Luann Phelps",
	        "username": "Exodoc",
	        "isFeatured": false,
	        "ratings": 1,
	        "raters": 50,
	        "fee": 1,
	        "parts": 27,
	        "title": "consectetur culpa commodo sit quis fugiat ut",
	        "content": "Lorem velit mollit irure irure eu laborum nulla ullamco elit sunt. Duis aliqua sint culpa et labore aute mollit. Sit pariatur nostrud do aute ad elit esse dolore. Tempor laboris qui in culpa eiusmod incididunt nisi veniam duis aute dolor occaecat. Id laborum eu duis voluptate Lorem. Laborum nostrud nostrud ut voluptate occaecat laborum enim.\r\n",
	        "submitTime": "2014-04-27T11:39:22",
	        "status": 0,
	        "tags": [
	            9,
	            10,
	            0,
	            6,
	            7
	        ]
	    },
	    {
	        "id": 8,
	        "name": "Jeanette Sherman",
	        "username": "Overplex",
	        "isFeatured": false,
	        "ratings": 0,
	        "raters": 158,
	        "fee": 0,
	        "parts": 8,
	        "title": "enim esse veniam in ex excepteur velit",
	        "content": "Ea aliquip aliqua magna culpa minim cupidatat. Eiusmod consectetur incididunt nisi labore cupidatat cillum. Excepteur eiusmod officia nulla fugiat reprehenderit excepteur nisi sint aliqua minim.\r\n",
	        "submitTime": "2014-04-15T06:13:53",
	        "status": 2,
	        "tags": [
	            1,
	            15,
	            5,
	            15
	        ]
	    },
	    {
	        "id": 9,
	        "name": "Wanda Stokes",
	        "username": "Lunchpod",
	        "isFeatured": true,
	        "ratings": 1,
	        "raters": 139,
	        "fee": 5,
	        "parts": 43,
	        "title": "consequat mollit irure do non occaecat laboris",
	        "content": "Commodo pariatur quis deserunt reprehenderit quis pariatur irure. Sit aliquip sint non ullamco non labore. Amet anim nisi minim irure pariatur qui mollit reprehenderit tempor aliqua. Esse nulla magna cillum est officia. Labore quis velit minim adipisicing in enim velit ea ipsum ea laboris mollit do.\r\n",
	        "submitTime": "2014-01-06T22:49:06",
	        "status": 3,
	        "tags": [
	            13,
	            13
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
        }
	}
});

app.factory('tagResource', function () {

	var data = [
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


// =========================================================================================================
//
// JQUERY
//
// =========================================================================================================

$(document).ready(function(){
  
  // Write your Javascript!

});