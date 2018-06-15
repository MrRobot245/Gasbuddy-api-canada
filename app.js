// app.js
var express = require('express');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
var fetch = require("node-fetch");
var app = express();
const asyncHandler = require('express-async-handler')


app.get('/location/:gps', asyncHandler(async (req, res, next) => {
	getGasPrice(req.params.gps, function (result) {
		res.send(({
			"status": 200,
			"error": null,
			"response": result
		}));
	});
	// next();
}));

app.get('/netdata/:base/:cmd', asyncHandler(async (req, res, next) => {
	if(req.params.cmd=='cpu'){

		fetch("https://"+req.params.base+"/api/v1/allmetrics").then(function(response) {
		  return response.text().then(function(text) {
			  text=text.split("\n");
			  var value=0;
			  text.forEach(function(a){
				  if (a.indexOf('NETDATA_SYSTEM_CPU_VISIBLETOTAL')>-1){
					  // console.log(a);
					   value=a.split("\"");
					   value=value[1];
				  }
			  })
			  res.send(({
				  "status": 200,
				  "error": null,
				  "response": parseFloat(value/100),
			  }));
			  // console.log(value);
		  });
		});
	}
	else{
		res.send(({
			"status": 200,
			"error": null,
			"response":'unknown command',
		}));
	}

	// next();
}));


module.exports = app;




function getGasPrice(gps, callback) {
	(async () => {
		const browser = await puppeteer.launch({
			args: ['--no-sandbox', '--disable-setuid-sandbox']
		});
		const page = await browser.newPage();
		// console.log(gps);
		var latLong = gps.split("&");
		// console.log(latLong[0]);
		await page.goto("https://www.gasbuddy.com/home?lat=" + latLong[0] + "&lng=" + latLong[1] + "&fuel=1");

		let content = await page.content();
		var $ = cheerio.load(content);
		var gasArray = new Array();

		$('div[class*=styles__stationList]').each(function (i, element) {
			let type = $(this).find('h3').text();
			let location = $(this).find('h3').next().next().html();
			let price = $(this).find('span[class*=styles__price]').text();
			let time = $(this).find('span[class*=styles__postedTime]').text();
			gasArray.push({
				'price': price,
				'location': location,
				'time': time,
				'type': type
			});

		});
		////
		////Town basaed
		////

		// $('.prices-table tr').each(function (i, element) {
		// 	if ($(this).find('.gb-price').html() != null) {
		// 		let price = $(this).find('.gb-price').text().replace(/\s/g, '');
		// 		let location = $(this).find('strong').text().replace(/\s/g, '');
		// 		let time = $(this).find('.date').text().replace(/\s/g, '');
		// 		time = time.substring(0, time.length - 3);
		// 		let locationAddr = $(this).find('.visible-xs').prev().text();
		// 		// console.log(locationAddr);
		// 		gasArray.push({
		// 			'price': price,
		// 			'locaiton': location,
		// 			'time': time,
		// 			'addr': locationAddr
		// 		});
		// 		// console.log(price);
		// 	}
		// });
		// console.log(gasArray);
		callback(gasArray);
		await browser.close();
	})();
}
