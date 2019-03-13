// app.js
var express = require('express');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
var app = express();
const asyncHandler = require('express-async-handler')


app.get('/location/:term', asyncHandler(async (req, res, next) => {
	getGasPrice(req.params.term, function (result) {
		res.send(({
			"status": 200,
			"error": null,
			"response": result
		}));
	});
	// next();
}));
module.exports = app;




function getGasPrice(term, callback) {
	(async () => {
		const browser = await puppeteer.launch({
			args: ['--no-sandbox', '--disable-setuid-sandbox']
		});
		const page = await browser.newPage();
		// console.log(gps);
		var input = term.split("&");
		if(input.length==2){
			await page.goto("https://www.gasbuddy.com/home?lat=" + input[0] + "&lng=" + input[1] + "&fuel=1");
		}
		else{
			await page.goto("https://www.gasbuddy.com/home?search=" +encodeURI(term)+ "&fuel=1");
		}
		

		let content = await page.content();
		var $ = cheerio.load(content);
		var gasArray = new Array();

		$('div[class*=GenericStationList__stationListItem]').each(function (i, element) {
			let type = $(this).find('h3').text();
			let location = $(this).find('h3').next().next().html();
			let price = $(this).find('span[class*=GenericStationList__price___]').text();
			let time = $(this).find('span[class*=style__postedTime___]').text();
			gasArray.push({
				'price': price,
				'location': location,
				'time': time,
				'type': type
			});
		});

		gasArray.pop();
		// console.log(gasArray);
		callback(gasArray);
		await browser.close();
	})();
}
