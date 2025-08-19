export interface Assembly {
  id: string;
  districtName: string;
  dong: string;
  startDateTime: string;
  endDateTime: string;
  place: string;
  peopleCount: number;
  latitude: number;
  longitude: number;
}

export const mockAssemblies: Assembly[] = [
  {
    id: "1",
    districtName: "종로구",
    dong: "세종로",
    startDateTime: "2025-08-16T09:00:00",
    endDateTime: "2025-08-16T12:00:00",
    place: "광화문광장",
    peopleCount: 100,
    latitude: 37.5759,
    longitude: 126.9768,
  },
  {
    id: "2",
    districtName: "중구",
    dong: "태평로1가",
    startDateTime: "2025-08-16T14:00:00",
    endDateTime: "2025-08-16T17:00:00",
    place: "서울광장",
    peopleCount: 200, // Assuming "200명 이상" means at least 200
    latitude: 37.5663,
    longitude: 126.9779,
  },
  {
    id: "3",
    districtName: "영등포구",
    dong: "여의도동",
    startDateTime: "2025-08-16T10:00:00",
    endDateTime: "2025-08-16T13:00:00",
    place: "여의도공원",
    peopleCount: 50,
    latitude: 37.5254,
    longitude: 126.9243,
  },
];