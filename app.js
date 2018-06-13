// app.js
var express = require('express');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
var app = express();
const asyncHandler = require('express-async-handler')


app.get('/location/:town', asyncHandler(async (req, res, next) => {
	getRandomPlace(req.params.town, function(result) {
		res.send(({"status": 200, "error": null, "response": result}));
	});
	// next();
}));


module.exports = app;



function getRandomPlace(town,callback){
	(async () => {
		const browser = await puppeteer.launch({args: ['--no-sandbox','--disable-setuid-sandbox']});
		const page = await browser.newPage();
		await page.goto('https://www.gasbuddy.com/GasPrices/Ontario/'+town);

		let content = await page.content();
		var $ = cheerio.load(content);
		var gasArray = new Array();
		$('.prices-table tr').each(function(i, element){
			if($(this).find('.gb-price').html()!=null)
			{
				let price=$(this).find('.gb-price').text().replace(/\s/g,'');
				let location=$(this).find('strong').text().replace(/\s/g,'');
				let time=$(this).find('.date').text().replace(/\s/g,'');
				time=time.substring(0, time.length - 3);
				let locationAddr=$(this).find('.visible-xs').prev().text();
				// console.log(locationAddr);
				gasArray.push(new Array(price,location,time,locationAddr));
				// console.log(price);
			}
		});
		// console.log(gasArray);
		callback(gasArray);
		await browser.close();
	})();
}
