const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// Coordinates and timezone for Brunei
const LATITUDE = 4.9401;
const LONGITUDE = 114.9516;
const TIMEZONE = 'Asia/Brunei';

// Islamic quotes mapped to prayer names
const quotes = {
  Fajr: "The most beloved actions to Allah are those performed consistently, even if they are few. — Prophet Muhammad ﷺ",
  Dhuhr: "So when you have made a decision, then put your trust in Allah. — Qur’an 3:159",
  Asr: "Indeed, Allah is with those who are patient. — Qur’an 2:153",
  Maghrib: "Verily, with hardship comes ease. — Qur’an 94:6",
  Isha: "Truly, in the remembrance of Allah do hearts find rest. — Qur’an 13:28"
};

// Serve prayer times and quotes to LaMetric
app.get('/', async (req, res) => {
  try {
    const response = await axios.get('https://api.aladhan.com/v1/timings', {
      params: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        method: 3,
        timezonestring: TIMEZONE
      }
    });

    const timings = response.data.data.timings;

    const frames = Object.entries(timings)
      .filter(([name]) => quotes[name])
      .flatMap(([name, time]) => [
        { icon: 'i2922', text: `${name}: ${time}` },
        { icon: 'i17696', text: quotes[name] }
      ]);

    res.json({ frames });
  } catch (error) {
    res.json({
      frames: [
        {
          icon: 'i5555',
          text: `Error fetching data: ${error.message}`
        }
      ]
    });
  }
});

app.listen(PORT, () => console.log(`🌙 Prayer API running on port ${PORT}`));
