const puppeteer = require('puppeteer');
const Chance = require('chance');
const path = require('path');

const chance = new Chance();

/**
 * example usage: `node script.js 120`
 * 
 * In this case the value is 120. 
 * The 1 year list results should then remove all captured records with a "days on zillow value of less than 120"
 */
const lowestDaysAllowed = process.argv[2] ?? 120

// This is the first page to start the scrape on
const targetPage1 = process.argv[3]
  ?? 'https://www.zillow.com/lucas-county-oh/?searchQueryState=%7B%22pagination%22%3A%7B%7D%2C%22usersSearchTerm%22%3A%22Lucas%20County%2C%20OH%22%2C%22mapBounds%22%3A%7B%22west%22%3A-84.05532402050781%2C%22east%22%3A-82.82348197949219%2C%22south%22%3A41.185451773707626%2C%22north%22%3A42.1853634969627%7D%2C%22regionSelection%22%3A%5B%7B%22regionId%22%3A616%2C%22regionType%22%3A4%7D%5D%2C%22isMapVisible%22%3Atrue%2C%22filterState%22%3A%7B%22doz%22%3A%7B%22value%22%3A%2290%22%7D%2C%22sort%22%3A%7B%22value%22%3A%22globalrelevanceex%22%7D%2C%22nc%22%3A%7B%22value%22%3Afalse%7D%2C%22fore%22%3A%7B%22value%22%3Afalse%7D%2C%22cmsn%22%3A%7B%22value%22%3Afalse%7D%2C%22auc%22%3A%7B%22value%22%3Afalse%7D%2C%22ah%22%3A%7B%22value%22%3Atrue%7D%2C%22price%22%3A%7B%22max%22%3A150000%7D%2C%22mp%22%3A%7B%22max%22%3A531%7D%7D%2C%22isListVisible%22%3Atrue%7D';

const removeNoDaysOnZillowRecords = Boolean( process.argv[4] ) 

// scraping starts ----------------------------

(async () => {
  const browser = await puppeteer.launch({ 
    headless: false, 
    slowMo: 250,
    devtools: true,
  })
  
  try {

    const page = await browser.newPage()
    await page.waitForSelector('#wrapper')
    
    await page.goto(targetPage1)
    const homeListingPages = []
    const filteredListings = []


    let nextButtonIsStillEnabled = true;

    // for a single page, get all the listing data
    // save in memory


    // data gathering step --------------------
    while( nextButtonIsStillEnabled ) {
      const delayBetweenPageLoads = chance.normal({
        mean: 10.78 * 1000,
        dev: 6.21 * 1000,

      })

      await page.waitForTimeout(delayBetweenPageLoads)

      const outgoingPageNextButton = page.$('#next')
      await page.click(outgoingPageNextButton)

      for ( let i = 0; i < homeListingPages.length; i++ ) {
        await page.click(homeListingPages[i].url)
  
        const safeListingPageReadingTime = chance.normal({
          mean: 10.32 * 1000,
          dev: 5.12 * 1000,
        })
  
        await page.waitForTimeout( safeListingPageReadingTime )
  
        // TODO fix all the data selectors to the real ones
        const dataSection = page.$('#data')
  
        const daysOnZillow = Number ( dataSection.$('daysOnZillow') )

        // filtering step --------------------------
        if (daysOnZillow >= lowestDaysAllowed) {
          const listingData = {
            beds: dataSection.$('#beds'),
            beds: dataSection.$('#baths'),
            squareFeet: dataSection.$('#baths'),
            address1: dataSection.$('#baths'),
            cityStateZip: dataSection.$('#baths'),
            daysOnZillow,
          }
    
          
          filteredListings.push(listingData);  
        }
  
        // TODO update the next button state property
        nextButtonIsStillEnabled = (await page.$('#next')).getProperties()
          .disabled === true
      }
    }

    browser.close();

    // file saving step -------------------------------
    const createCsvWriter = require('csv-writer').createObjectCsvWriter;

    const csvWriter = createCsvWriter({
      path: separatedFilePath,
      header: [
        { id: 'daysOnZillow', title: 'daysOnZillow' },
        { id: 'address1', title: 'address1' },
        { id: 'cityStateZip', title: 'cityStateZip' },
        { id: 'beds', title: 'beds' },
        { id: 'baths', title: 'baths' },
        { id: 'squarefeet', title: 'squarefeet' },
      ]
    })

    const filePath = path.join( __dirname, 'nearExpiredListings.csv' )

    csvWriter
      .writeRecords( filteredListings )
        .then(() => {
          console.log( `successfully wrote to file ${filePath}` )
        })
        .catch( e => { 
          throw new Error(e) 
        } )

  }
  catch(e) {
    console.log('error: ', e)
  }

  

  await browser.close()
})();