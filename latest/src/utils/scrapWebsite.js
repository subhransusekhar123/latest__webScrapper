import axios from "axios";
import * as cheerio from 'cheerio';
import async from 'async';



async function scrapWebsite(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const bodyText = $("body").html();
    // console.log($);
   
    const emails = new Set(); // Using a set to avoid duplicates;

 

    
    const regex = /<a[\s\S]*?href="mailto:([^"?]*)\??([^"]*)?"[\s\S]*?>(.*?)<\/a>/gm;

    let matches;

    while ((matches = regex.exec(bodyText)) !== null) {
      // const mailto = matches[1];
      emails.add(matches[1])
      const email = matches[1];
      const linkText = matches[3];

      
      // console.log("Mailto:", mailto);
      console.log("Email:", email);
      console.log("Link Text:", linkText);
    }

    console.log(Array.from(emails), url);
    console.log(`Data scraped successfully from ${url}`);
    if (emails.size > 0) {
      return { emails: Array.from(emails), url: url.replace("https://", "") };
    } else {
      return null;
    }
  } catch (error) {
    if (error.response) {
      console.error(
        `Error fetching data from ${url}. Status code: ${error.response.status}`,
      );
      return null;
    } else if (error.request) {
      console.error(`Error fetching data from ${url}. No response received.`);
      return null;
    } else {
      console.error(`Error fetching data from ${url}:`, error.message);
      return null;
    }
  }
}




const dataAfterScrapingWebs = (urls) => {

    return new Promise((res, rej)=> {
        const allUrl = urls.map((url, i) => {
            return async () => {
                try {
                   return await scrapWebsite(url)
    
                } catch (error) {
                    console.error("Error scraping this website", error.message);
                }
            }
    
    
        })
    
        console.log(allUrl);
    
        async.parallel(
            allUrl,
            (err, results) => {
                if (err) {
                    console.error("Error scraping websites", err.message);
                    rej(err)
                }
                else{
                    console.log(results, "results");
                    res(results) 
                }
                // console.log(err, results)
            }
        );

    })
    // let results = [] ;

    

    // console.log(results, "results from last scrap")
};




export default dataAfterScrapingWebs;
