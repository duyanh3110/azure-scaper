const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

async function getAzureData() {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox"]
  });
  const url = "https://status.azure.com/en-us/status";
  const page = await browser.newPage();
  const result = await page
    .goto(url)
    .then(function() {
      return page.content();
    })
    .then(html => {
      const $ = cheerio.load(html);
      const data = [];
      const americas = $("table").data("data-zone-name", "americas");
      const eu = $("table").data("data-zone-name", "europe");
      const eusName = americas
        .find("thead > .status-table-head > th:nth-child(3) > span")
        .html();
      const eus2Name = americas
        .find("thead > .status-table-head > th:nth-child(4) > span")
        .html();
      const euName = eu
        .find("thead > .status-table-head > th:nth-child(3) > span")
        .slice(1, 2)
        .text();
      const eusVirtual = americas
        .find("tr:nth-child(3) > td:nth-child(3) > .hide-text")
        .html();
      const eus2Virtual = americas
        .find("tr:nth-child(3) > td:nth-child(4) > .hide-text")
        .html();
      const eusCloud = americas
        .find("tr:nth-child(10) > td:nth-child(3) > .hide-text")
        .html();
      const eus2Cloud = americas
        .find("tr:nth-child(10) > td:nth-child(4) > .hide-text")
        .html();
      const eusAzureFunc = americas
        .find("tr:nth-child(7) > td:nth-child(3) > .hide-text")
        .html();
      const eus2AzureFunc = americas
        .find("tr:nth-child(7) > td:nth-child(4) > .hide-text")
        .html();
      const euVirtual = eu
        .find("tr:nth-child(3) > td:nth-child(3) > .hide-text")
        .html();
      const euCloud = eu
        .find("tr:nth-child(10) > td:nth-child(3) > .hide-text")
        .html();
      const euAzureFunc = eu
        .find("tr:nth-child(7) > td:nth-child(3) > .hide-text")
        .html();
      const eusData = {
        zone: "Americas",
        name: eusName,
        virtual: eusVirtual,
        cloud: eusCloud,
        azureFunc: eusAzureFunc
      };
      const eus2Data = {
        zone: "Americas",
        name: eus2Name,
        virtual: eus2Virtual,
        cloud: eus2Cloud,
        azureFunc: eus2AzureFunc
      };
      const euData = {
        zone: "Europe",
        name: euName,
        virtual: euVirtual,
        cloud: euCloud,
        azureFunc: euAzureFunc
      };
      data.push(eusData, eus2Data, euData);
      return data;
    });
  browser.close();
  return result;
}

exports.getAzureData = async function(req, res) {
  res.set('Access-Control-Allow-Origin', '*');
  res.status(200).send(await getAzureData());
};
