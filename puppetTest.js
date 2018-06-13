const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
//https://www.gasbuddy.com/home?lat=42.9859247&lng=-81.2483536&fuel=1
getGasPrice("https://www.gasbuddy.com/home?lat=42.9859247&lng=-81.2483536&fuel=1", function (result) {
	console.log(result);
	// return result;
});


function getGasPrice(id, callback) {
	(async () => {
		const browser = await puppeteer.launch({
			args: ['--no-sandbox', '--disable-setuid-sandbox']
		});
		const page = await browser.newPage();
		await page.goto(id);

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