require("dotenv").config();
const axios = require("axios");
const moment = require("moment");
const fs = require("fs");
const path = require("path");

const BASE_URL = "https://ohcryp-4909b50868b2.herokuapp.com/";
const API_KEY = process.env.API_KEY;
const COLLECTION_NAME = "all_news_processed";

async function fetchNewsForToday() {
  try {
    const today = moment().format("YYYY-MM-DD");
    const response = await axios.get(`${BASE_URL}articles/${COLLECTION_NAME}`, {
      headers: { "API-Key": API_KEY },
    });

    const allNews = response.data;
    const todaysNews = allNews
      .filter((article) => moment(article.date).isSame(today, "day"))
      .map(({ title, subtitle_generated, summary, link }) => ({
        title,
        subtitle_generated,
        summary,
        link,
      }));

    return todaysNews;
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}

function saveNewsToFile(news) {
  const today = moment();
  const year = today.format("YYYY");
  const month = today.format("MMMM").toLowerCase();
  const dataPath = path.join(__dirname, `data/${year}/${month}`);

  if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(dataPath, { recursive: true });
  }

  const filePath = path.join(
    dataPath,
    `data_of_${today.format("YYYY-MM-DD")}.json`
  );
  fs.writeFileSync(filePath, JSON.stringify(news, null, 2));
  console.log(`News saved to ${filePath}`);
}

fetchNewsForToday().then((news) => {
  saveNewsToFile(news);
});
