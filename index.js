const puppeteer = require("puppeteer");
const fs = require("fs");

async function retrievePDF(address, outputPath) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const url = "https://cloud.eais.go.kr/";

  try {
    await page.goto(url, { waitUntil: "networkidle2" });

    // Click the "Issurance of building ledger" button
    await page.click("selector-for-issurance-of-building-ledger");

    // Input the address
    await page.type("selector-for-address-input", address);

    // Trigger search
    await page.click("selector-for-search-button");
    await page.waitForNavigation({ waitUntil: "networkidle2" });

    // Click on the "Print PDF" button
    await page.click("selector-for-print-pdf");
    await page.waitForTimeout(5000); // Wait for the PDF generation

    // Intercept and save the PDF
    const pdfBuffer = await page.pdf({ format: "A4" });
    fs.writeFileSync(outputPath, pdfBuffer);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await browser.close();
  }
}

// Easy and detailed addresses
const addresses = [
  "경기도 고양시 일산동구 강석로 152 강촌마을아파트 제701동 제2층 제202호 [마두동 796]",
  "서울특별시 강남구 언주로 332 역삼푸르지오 제101동 제1층 제101호 [역삼동 754-1]",
  "서울특별시 강남구 언주로 332 역삼푸르지오 제101동 제1층 제102호 [역삼동 754-1]",
  "경기도 부천시 부일로 440-13 숲속애가 주건축물제1동 [심곡동 396-9 외 1필지]",
  "인천광역시 부평구 부영로 196 대림아파트 제11동 제1층 제102호 [부평동 64-20 외 2필지]",
  "경기도 부천시 부일로 440-13 숲속애가 주건축물제1동 [심곡동 396-9 외 1필지]",
];

// Output directory
const outputDir = "./pdfs";
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Process each address
addresses.forEach((address, index) => {
  const outputPath = `${outputDir}/output${index + 1}.pdf`;
  retrievePDF(address, outputPath)
    .then(() => console.log(`PDF saved to ${outputPath}`))
    .catch((error) =>
      console.error(`Error retrieving PDF for address: ${address}`, error)
    );
});
