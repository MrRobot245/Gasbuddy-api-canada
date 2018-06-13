const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

getRandomPlace("https://www.gasbuddy.com/GasPrices/Ontario/Aylmer", function(result) {
	console.log(result);
	// return result;
});


function getRandomPlace(id,callback){
	(async () => {
		const browser = await puppeteer.launch({args: ['--no-sandbox','--disable-setuid-sandbox']});
		const page = await browser.newPage();
		await page.goto(id);

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
				gasArray.push({'price':price,'locaiton':location,'time':time,'addr':locationAddr});
				// console.log(price);
			}
		});
		// console.log(gasArray);
		callback(gasArray);
		await browser.close();
	})();
}
