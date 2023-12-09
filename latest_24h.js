require("dotenv").config();
const axios = require("axios");
const moment = require("moment");
const fs = require("fs");
const path = require("path");

const BASE_URL = "https://ohcryp-4909b50868b2.herokuapp.com/";
const API_KEY = process.env.API_KEY;
const COLLECTION_NAME = "all_news_processed";

async function fetchNewsFromLast24Hours() {
  try {
    const now = moment();
    const response = await axios.get(`${BASE_URL}articles/${COLLECTION_NAME}`, {
      headers: { "API-Key": API_KEY },
    });

    const allNews = response.data;
    const last24HoursNews = allNews
      .filter((article) => {
        const articleDate = moment(article.date);
        return articleDate.isAfter(now.subtract(24, "hours"));
      })
      .map(({ title, subtitle_generated, summary, link }) => ({
        title,
        subtitle_generated,
        summary,
        link,
      }));

    return last24HoursNews;
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}

function saveNewsToFile(news, folderName) {
  const dataPath = path.join(__dirname, `data/${folderName}`);

  if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(dataPath, { recursive: true });
  }

  const filePath = path.join(
    dataPath,
    `data_of_${moment().format("YYYY-MM-DD_HH-mm-ss")}.json`
  );
  fs.writeFileSync(filePath, JSON.stringify(news, null, 2));
  console.log(`News saved to ${filePath}`);
}

fetchNewsFromLast24Hours().then((news) => {
  saveNewsToFile(news, "latest_24h");
});
