const puppeteer = require('puppeteer');

/**
 * example usage: `node script.js 120`
 * 
 * In this case the value is 120. 
 * The 1 year list results should then remove all captured records with a "days on zillow value of less than 120"
 */
const lowestDaysAllow = process.argv[2]

// This is the first page to start the scrape on
const targetPage1 = process.argv[3]
  ?? 'https://www.zillow.com/lucas-county-oh/?searchQueryState=%7B%22pagination%22%3A%7B%7D%2C%22usersSearchTerm%22%3A%22Lucas%20County%2C%20OH%22%2C%22mapBounds%22%3A%7B%22west%22%3A-84.05532402050781%2C%22east%22%3A-82.82348197949219%2C%22south%22%3A41.185451773707626%2C%22north%22%3A42.1853634969627%7D%2C%22regionSelection%22%3A%5B%7B%22regionId%22%3A616%2C%22regionType%22%3A4%7D%5D%2C%22isMapVisible%22%3Atrue%2C%22filterState%22%3A%7B%22doz%22%3A%7B%22value%22%3A%2290%22%7D%2C%22sort%22%3A%7B%22value%22%3A%22globalrelevanceex%22%7D%2C%22nc%22%3A%7B%22value%22%3Afalse%7D%2C%22fore%22%3A%7B%22value%22%3Afalse%7D%2C%22cmsn%22%3A%7B%22value%22%3Afalse%7D%2C%22auc%22%3A%7B%22value%22%3Afalse%7D%2C%22ah%22%3A%7B%22value%22%3Atrue%7D%2C%22price%22%3A%7B%22max%22%3A150000%7D%2C%22mp%22%3A%7B%22max%22%3A531%7D%7D%2C%22isListVisible%22%3Atrue%7D';


// scraping starts ----------------------------

(async () => {
  const browser = await puppeteer.launch({ 
    headless: false, 
    slowMo: 250,
    devtools: true,
  })
  
  const page = await browser.newPage()
  
  try {
    await page.goto(targetPage1)

  }
  catch(e) {
    console.log('error: ', e)
  }

  

  await browser.close()
})();