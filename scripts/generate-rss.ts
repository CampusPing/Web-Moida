
import fs from 'fs';
import RSS from 'rss';
import { mockAssemblies } from '../src/data/mock-assemblies';

const generateRssFeed = async () => {
  const feed = new RSS({
    title: '오늘의 집회',
    description: '오늘의 집회 정보를 알려드립니다.',
    feed_url: 'https://today-assembly.com/rss.xml',
    site_url: 'https://today-assembly.com',
    language: 'ko',
  });

  mockAssemblies.forEach((assembly) => {
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
};

generateRssFeed();
