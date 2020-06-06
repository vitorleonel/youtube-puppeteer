const puppeteer = require("puppeteer");
const fs = require("fs");

async function Bot() {
  const browser = await puppeteer.launch({ headless: false });

  const page = await browser.newPage();

  await page.setViewport({ width: 0, height: 0 });
  await page.goto("https://web.whatsapp.com", { waitUntil: "networkidle0" });

  // Gerenciando sessão do WhatsApp
  try {
    const sessionContent = fs.readFileSync("./session.txt");
    const sessionObject = JSON.parse(sessionContent);

    await page.evaluate((sessionObject) => {
      const keys = Object.keys(sessionObject);
      let keysLength = keys.length;

      while (keysLength--) {
        let key = keys[keysLength];

        window.localStorage.setItem(key, sessionObject[key]);
      }
    }, sessionObject);

    await page.reload({ waitUntil: "networkidle0" });
    await page.waitForSelector("div.app-wrapper-web .two", { timeout: 30000 });
  } catch (error) {
    await page.waitForSelector("div.app-wrapper-web .two", { timeout: 30000 });

    const sessionObject = await page.evaluate(() => {
      let response = {};

      const keys = Object.keys(window.localStorage);
      let keysLength = keys.length;

      while (keysLength--) {
        let key = keys[keysLength];

        if (key.includes("==")) {
          continue;
        }

        response[key] = window.localStorage.getItem(key);
      }

      return response;
    });

    fs.writeFileSync("./session.txt", JSON.stringify(sessionObject), "UTF-8");
  }

  // Troque "eu" pelo nome do contato exibido na sua lista de conversas
  await page.waitFor(2000);
  await page.click('._210SC span[title="Eu"]');
  await page.waitFor(1000);

  await page.type("#main div.copyable-text.selectable-text", "E ai, beleza?");
  await page.waitFor(1000);

  await page.click('div[title="Anexar"]');
  await page.waitFor(1000);

  const imageInput = await page.$("ul.I4jbF li:nth-child(1) input[type=file]");
  imageInput.uploadFile("./minha-imagem.png");

  await page.waitFor(2000);

  await page.click('span[data-icon="send"]');
  await page.waitFor(5000);

  await browser.close();
}

Bot();
