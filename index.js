const sharp = require("sharp");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());
const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));
const https = require("https");
const fs = require("fs");

const bg = "./background/1.jpg";
(async function () {
  const downloadImage = async () => {
    const url =
      "https://www.walmart.com/ip/JLab-Audio-JBuddies-Studio-Children-s-On-Ear-Headphones-Over-Ear-Headphones-Foldable-Graphite-Purple-JKSTUDIO-GRYPRPL-BOX/724645445";
    console.log("Starting...");
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 800, height: 600 });
    await page.goto(url);
    await page.waitForTimeout(3000);
    await page.mouse.click(500, 300);
    await page.click("div.relative > img.db");
    let images = [];

    let getImage_1 = await page.evaluate(() => {
      let image = document.querySelectorAll("div.relative > img.db");
      return image[0].currentSrc;
    });

    images.push(getImage_1);

    await page.mouse.click(100, 200);
    await page.waitForTimeout(500);

    let getImage_2 = await page.evaluate(() => {
      let image = document.querySelectorAll("div.relative > img.db");
      console.log(image[0].currentSrc);
      return image[0].currentSrc;
    });

    images.push(getImage_2);

    await page.mouse.click(100, 300);
    await page.waitForTimeout(500);

    let getImage_3 = await page.evaluate(() => {
      let image = document.querySelectorAll("div.relative > img.db");
      console.log(image[0].currentSrc);
      return image[0].currentSrc;
    });

    images.push(getImage_3);

    await page.mouse.click(100, 420);
    await page.waitForTimeout(500);

    let getImage_4 = await page.evaluate(() => {
      let image = document.querySelectorAll("div.relative > img.db");
      console.log(image[0].currentSrc);
      return image[0].currentSrc;
    });

    images.push(getImage_4);

    await page.mouse.click(100, 520);
    await page.waitForTimeout(500);

    let getImage_5 = await page.evaluate(() => {
      let image = document.querySelectorAll("div.relative > img.db");
      console.log(image[0].currentSrc);
      return image[0].currentSrc;
    });

    images.push(getImage_5);

    return new Promise((resolve) => {
      for (let i = 0; i < images.length; i++) {
        (async () => {
          let url = images[i];
          const download = async (url, dest, cb) => {
            const file = fs.createWriteStream(dest);
            const request = https.get(url, (res) => {
              res.pipe(file);
              file.on("finish", () => {
                file.end();
                let files = fs.readdirSync("./raw_images");
                if (files.length === 5) {
                  resolve(files);
                }
              });
            });
          };
          await download(url, `./raw_images/${i}.jpg`);
        })();
      }
    });
  };

  const handleImage = async (files) => {
    try {
      files.forEach(async (e, i) => {
        const dataItem = await sharp(`./raw_images/${e}`).metadata();

        if (dataItem.height > 750 && dataItem.width < 900) {
          let resizeItem = await sharp(`./raw_images/${e}`)
            .metadata()
            .resize({ height: 700 })
            .toBuffer();

          let marginLeft = Math.round(
            (900 - dataItem.width * (700 / dataItem.height)) / 2,
            0
          );

          await sharp(bg)
            .composite([
              {
                input: resizeItem,
                left: marginLeft,
                top: 20,
                bot: 0,
              },
            ])
            .toFile(`./results/${e}`);
          return;
        } else if (dataItem.width > 900) {
          let resizeItem = await sharp(`./raw_images/${e}`)
            .resize({ width: 720 })
            .toBuffer();
          await sharp(bg)
            .composite([
              {
                input: resizeItem,
                top: 50,
                left: 90,
                bot: 0,
              },
            ])
            .toFile(`./results/${e}`);
          return;
        } else {
          let resizeItem = await sharp(`./raw_images/${e}`)
            .resize({
              height: 700,
            })
            .toBuffer();
          let marginLeft = Math.round(
            (900 - dataItem.width * (700 / dataItem.height)) / 2,
            0
          );

          await sharp(bg)
            .composite([
              {
                input: resizeItem,
                left: marginLeft,
                top: 20,
                bot: 0,
              },
            ])
            .toFile(`./results/${e}`);
          return;
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  let data = await downloadImage();
  console.log("Downloaded Sucessfully !!!");
  setTimeout(() => {
    handleImage(data);
    console.log("Handled Sucessfully !!!");
  }, 500);
})();
