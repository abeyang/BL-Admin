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

app.controller('MocController', function($scope, mocResource, tagResource) {

	$scope.mocs = mocResource.list();

	$scope.tagnames = function(tags) {
		// tags is an array of tag id's
		var str = '';

		_.each(tags, function(id) {
			str += tagResource.findNameById(id) + ', ';
		});

		return str.substring(0, str.length-2);		// remove the final ", " in str
	}

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
	        "name": "Acosta Dixon",
	        "username": "Overfork",
	        "isFeatured": false,
	        "fee": 1,
	        "parts": 47,
	        "title": "reprehenderit officia minim duis exercitation eiusmod ex",
	        "content": "Est reprehenderit Lorem ex magna aute officia nisi. Minim mollit in ea aute eu occaecat consequat. Officia voluptate incididunt laborum deserunt tempor dolor ea nulla incididunt laboris mollit. Duis qui ea esse consequat ad enim in ea sint dolore minim velit quis.\r\n",
	        "submitTime": "2014-05-04T00:06:07",
	        "status": 2,
	        "tags": [
	            17,
	            3,
	            11
	        ]
	    },
	    {
	        "id": 1,
	        "name": "Isabelle Burgess",
	        "username": "Ecraze",
	        "isFeatured": false,
	        "fee": 0,
	        "parts": 89,
	        "title": "pariatur mollit ullamco id duis laboris pariatur",
	        "content": "Id deserunt veniam fugiat laborum duis in dolore exercitation et consectetur. Culpa laboris cillum velit in labore cupidatat magna tempor nisi do amet commodo. Laborum exercitation voluptate ipsum proident exercitation aliquip. Nostrud fugiat ad laborum esse duis deserunt dolor sint voluptate ad.\r\n",
	        "submitTime": "2014-03-10T02:44:33",
	        "status": 2,
	        "tags": [
	            17,
	            6
	        ]
	    },
	    {
	        "id": 2,
	        "name": "Holt Riddle",
	        "username": "Equicom",
	        "isFeatured": false,
	        "fee": 4,
	        "parts": 59,
	        "title": "cupidatat consectetur ea commodo enim occaecat tempor",
	        "content": "Commodo aliqua labore cillum cupidatat ut ea enim ullamco enim ipsum magna adipisicing. Dolore exercitation cupidatat ut do nulla exercitation ex nostrud voluptate esse laboris consectetur. Nostrud est et commodo excepteur ipsum. Elit sint consequat ex laboris commodo nulla do laboris sunt est. Nisi enim officia esse sunt amet esse dolor ea mollit culpa nisi non. Eu adipisicing duis amet irure Lorem anim eu. Ea sint ullamco laborum Lorem.\r\n",
	        "submitTime": "2014-04-09T11:46:34",
	        "status": 1,
	        "tags": [
	            17,
	            15,
	            3,
	            18
	        ]
	    },
	    {
	        "id": 3,
	        "name": "Violet Potts",
	        "username": "Dentrex",
	        "isFeatured": false,
	        "fee": 0,
	        "parts": 38,
	        "title": "qui irure sunt nisi exercitation irure exercitation",
	        "content": "Non duis irure consequat sunt et cillum. In consectetur nulla dolore id veniam laboris Lorem id tempor excepteur officia sunt ad. Exercitation tempor duis ipsum et quis officia magna quis est aute id aliquip in. Enim est dolore ad deserunt ut occaecat ex ea consequat. Duis fugiat magna pariatur nostrud occaecat amet cillum tempor ullamco id amet do culpa adipisicing. Cillum labore nisi ad exercitation ut ullamco ad elit deserunt deserunt ea. Qui id exercitation ipsum occaecat.\r\n",
	        "submitTime": "2014-02-23T08:04:29",
	        "status": 1,
	        "tags": [
	            11,
	            3,
	            17,
	            16
	        ]
	    },
	    {
	        "id": 4,
	        "name": "Frazier Pate",
	        "username": "Isbol",
	        "isFeatured": true,
	        "fee": 2,
	        "parts": 77,
	        "title": "irure ipsum amet eu deserunt consequat velit",
	        "content": "Labore sit in esse consequat eiusmod Lorem in adipisicing do reprehenderit anim. Dolore consequat amet nulla aliqua voluptate laborum sit occaecat id fugiat deserunt. Reprehenderit laborum ad ad eiusmod eiusmod excepteur non ut ea ex voluptate consequat. Quis consectetur ex aute reprehenderit nulla cillum deserunt tempor cillum.\r\n",
	        "submitTime": "2014-02-15T01:44:33",
	        "status": 1,
	        "tags": [
	            5,
	            6,
	            20,
	            9
	        ]
	    },
	    {
	        "id": 5,
	        "name": "Hamilton Vargas",
	        "username": "Unia",
	        "isFeatured": true,
	        "fee": 5,
	        "parts": 82,
	        "title": "ipsum tempor anim do incididunt excepteur sit",
	        "content": "Labore qui consectetur magna minim in esse sunt nisi proident. Anim est magna consequat dolor. In est occaecat aliquip amet magna minim non qui consectetur in consectetur. Cillum excepteur culpa ex excepteur est cillum mollit adipisicing. Exercitation consectetur nulla est exercitation elit aute quis excepteur minim incididunt. Id fugiat tempor aliqua sunt cillum irure enim ullamco nostrud. Minim proident esse sint proident dolor Lorem.\r\n",
	        "submitTime": "2014-05-13T16:02:57",
	        "status": 2,
	        "tags": [
	            13,
	            4,
	            1,
	            9,
	            3
	        ]
	    },
	    {
	        "id": 6,
	        "name": "Anthony Curry",
	        "username": "Organica",
	        "isFeatured": false,
	        "fee": 4,
	        "parts": 90,
	        "title": "amet reprehenderit amet magna dolor aliquip officia",
	        "content": "Proident aute est veniam sint dolor in. Veniam do dolor sint eu sunt consequat sit magna ipsum exercitation officia. Reprehenderit fugiat sit occaecat sit officia exercitation aliquip aliquip duis irure est ea. Cupidatat cillum eu consectetur laboris anim est officia in dolor proident voluptate. Do deserunt ipsum nostrud ipsum. Aliqua dolore consectetur commodo ea nostrud veniam amet sint fugiat occaecat.\r\n",
	        "submitTime": "2014-04-24T00:00:49",
	        "status": 2,
	        "tags": [
	            12,
	            12
	        ]
	    },
	    {
	        "id": 7,
	        "name": "Goff Velasquez",
	        "username": "Extragen",
	        "isFeatured": true,
	        "fee": 2,
	        "parts": 94,
	        "title": "nostrud id nisi non do veniam dolor",
	        "content": "Elit irure aliqua fugiat nostrud commodo in occaecat occaecat ipsum deserunt ex deserunt officia consectetur. Tempor magna nulla cupidatat labore ea aute quis. Ad commodo ut ullamco commodo dolor. Adipisicing eu culpa culpa incididunt ipsum consectetur consectetur ea laboris. Tempor dolor cillum incididunt esse dolore consectetur sint commodo tempor. Commodo exercitation irure ea excepteur tempor nostrud ex eiusmod commodo.\r\n",
	        "submitTime": "2014-03-02T15:49:45",
	        "status": 0,
	        "tags": [
	            5,
	            2,
	            16
	        ]
	    },
	    {
	        "id": 8,
	        "name": "Dana Carey",
	        "username": "Globoil",
	        "isFeatured": false,
	        "fee": 2,
	        "parts": 85,
	        "title": "minim aute non laboris reprehenderit reprehenderit duis",
	        "content": "Irure ipsum consectetur aliquip tempor aute consectetur id ipsum occaecat irure est cillum. Qui dolore sunt nulla ex. Non dolore eu nulla occaecat nostrud adipisicing proident ex consectetur amet id ea. Ut deserunt laborum sunt occaecat fugiat consequat eu. Veniam cillum non elit qui voluptate do minim quis quis est voluptate excepteur nisi irure.\r\n",
	        "submitTime": "2014-02-15T06:54:17",
	        "status": 3,
	        "tags": [
	            5
	        ]
	    },
	    {
	        "id": 9,
	        "name": "Mara Richmond",
	        "username": "Ecrater",
	        "isFeatured": false,
	        "fee": 0,
	        "parts": 97,
	        "title": "ullamco aliqua veniam voluptate ea commodo commodo",
	        "content": "Nisi anim sunt proident magna elit. Aliqua consectetur elit cupidatat cupidatat nulla aute deserunt ipsum. Id sint ullamco Lorem minim anim eiusmod duis exercitation cupidatat ea sint amet. Minim deserunt minim tempor voluptate velit.\r\n",
	        "submitTime": "2014-03-08T11:09:01",
	        "status": 2,
	        "tags": [
	            0,
	            12
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


// =========================================================================================================
//
// JQUERY
//
// =========================================================================================================

$(document).ready(function(){
  
  // Write your Javascript!

});