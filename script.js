const puppeteer = require('puppeteer');
// get the 1 year list
// remove all records with doz of less than 120 ()

(async () => {
  const browser = await puppeteer.launch({ 
    headless: false, 
    slowMo: 250,
    devtools: true,
  })
  
  const page = await browser.newPage()
  
  try {
    await page.goto('https://zillow.com')
    await page.waitForSelector('#__next')
    console.log('page', page)
  }
  catch(e) {
    console.log('error: ', e)
  }

  

  await browser.close()
})();