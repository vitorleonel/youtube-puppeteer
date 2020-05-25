const puppeteer = require("puppeteer");

async function Bot() {
  const browser = await puppeteer.launch({ headless: false });

  const page = await browser.newPage();

  await page.setViewport({ width: 0, height: 0 });
  await page.goto("https://web.whatsapp.com", { waitUntil: "networkidle0" });
  await page.waitFor(5000);

  // Troque "eu" pelo nome do contato exibido na sua lista de conversas
  await page.click('._2wP_Y span[title="Eu"]');
  await page.waitFor(1000);

  await page.type("._3F6QL._2WovP", "E ai, beleza?");
  await page.waitFor(1000);

  await page.click('div[title="Anexar"]');
  await page.waitFor(1000);

  const imageInput = await page.$("._2imug li input");
  imageInput.uploadFile("./minha-imagem.png");

  await page.waitFor(2000);

  await page.click('span[data-icon="send"]');
  await page.waitFor(1000);

  await browser.close();
}

Bot();
