/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 
var _dbSize = 32 * 1024 * 1024;

var app = {
    initialize: function() {
        this.bind();
    },
    bind: function() {
        document.addEventListener('deviceready', this.deviceready, false);
    },
    deviceready: function() {
		$(".screen-splash-screen").delay(500).fadeIn(2000).delay(1000).fadeOut(1000, function() {
			showScreen("screen-menu");
			$(".screen-menu #button-create-database").on("click", function() {
				createDatabase();
			});
			$(".screen-menu #button-run-mini-till-demo").on("click", function() {
				alert("run mini till demo");
			});
		});
    },
};

function showScreen(screenName) {
	$(".screen").hide();
	$(".screen." + screenName).show();
}

function createDatabase() {
	showScreen("screen-create-database");
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
}

function gotFS(fileSystem) {
	fileSystem.root.getFile("/sdcard/external_sd/temp/STKBYGRP.CSV", null, gotFileEntry, fail);
}

function gotFileEntry(fileEntry) {
	fileEntry.file(gotFile, fail);
}

function gotFile(file){
	readAsText(file);
}

function readAsText(file) {
	var reader = new FileReader();
	reader.onloadend = function(evt) {

		var csv = evt.target.result;
		var lines = csv.split("\n");
		
		html5sql.openDatabase("Easitill", "Easitill DB", _dbSize);
		html5sql.process("DROP TABLE IF EXISTS veprods; CREATE TABLE IF NOT EXISTS veprods (linecode int, description varchar(255), barcode varchar(25), price int, stock int); ", function() {
			for (var i = 1; i < lines.length; i++) {
				var line = lines[i].split(",");
				var sql = "INSERT INTO veprods (linecode, description, barcode, price, stock) values (" +
					line[0] + ", " +
					"'" + line[2] + "', " +
					"'" + line[1] + "', " +
					line[6] + "," + 
					line[13] + ")";
					
				html5sql.process(sql);
				
				var pd = i / lines.length * 100;
				$(".progress-bar").css("width", pd + "%");
			}
		}, function(error, failingQuery) {
			alert("Error : " + error.message + "\r\n" + failingQuery);
		});
	};
	reader.readAsText(file);
}

function fail(evt) {
	alert(evt.target.error.code);
}