
import fs from 'fs';
import RSS from 'rss';
import { Assembly } from '../src/data/mock-assemblies';

const generateRssFeed = async () => {
  const feed = new RSS({
    title: '오늘의 집회',
    description: '오늘의 집회 정보를 알려드립니다.',
    feed_url: 'https://today-assembly.com/rss.xml',
    site_url: 'https://today-assembly.com',
    language: 'ko',
  });

  try {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;

    const response = await fetch(`http://localhost:3000/api/v2/moida/assemblies?year=${year}&month=${month}&monthSize=2`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const fetchedAssemblies: Assembly[] = data.assemblies || [];

    const todayDateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const todayAssemblies = fetchedAssemblies.filter((assembly: Assembly) => {
      const assemblyDate = assembly.startDateTime.substring(0, 10);
      return assemblyDate === todayDateString;
    });

    todayAssemblies.forEach((assembly) => {
      feed.item({
        title: `${assembly.districtName} ${assembly.place} 집회`,
        description: `일시: ${assembly.startDateTime} ~ ${assembly.endDateTime}\n장소: ${assembly.place}\n인원: ${assembly.peopleCount}명`,
        url: `https://today-assembly.com/assembly/${assembly.id}`,
        guid: assembly.id,
        date: assembly.startDateTime,
        lat: assembly.latitude,
        long: assembly.longitude,
      });
    });

    fs.writeFileSync('./public/rss.xml', feed.xml({ indent: true }));
  } catch (error) {
    console.error("Failed to generate RSS feed:", error);
  }
};

generateRssFeed();
