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
var app = {
    initialize: function() {
        this.bind();
    },
    bind: function() {
        document.addEventListener('deviceready', this.deviceready, false);
    },
    deviceready: function() {
		$(".splash-screen").delay(500).fadeIn(1000).delay(1000).fadeOut(1000, function() {
			$(".menu").delay(500).fadeIn(1000);
			$(".menu #button-create-database").on("click", function() {
				createDatabase();
			});
			$(".menu #button-run-mini-till-demo").on("click", function() {
				alert("run mini till demo");
			});
		});
    },
};

function createDatabase() {
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
		alert("Text read complete - " + lines.length + " lines");
	};
	reader.readAsText(file);
}

function fail(evt) {
	alert(evt.target.error.code);
}