'use client';

import { useState, useEffect, useMemo } from 'react';
import AssemblyMap from "@/components/AssemblyMap";
import AssemblyTable from "@/components/AssemblyTable";
import { Assembly } from "@/data/mock-assemblies";

export default function Home() {
  const [assemblies, setAssemblies] = useState<Assembly[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOnlyOngoing, setShowOnlyOngoing] = useState(false);
  const [selectedAssemblyId, setSelectedAssemblyId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const todayDateString = `${year}-${String(month).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

        const cachedData = localStorage.getItem(`assemblies_${todayDateString}`);
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          setAssemblies(parsedData);
          setLoading(false);
          console.log("데이터를 로컬 스토리지에서 불러왔습니다.");
          return;
        }

        const response = await fetch(`/api/v2/moida/assemblies?year=${year}&month=${month}&monthSize=2`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const fetchedAssemblies = data.assemblies || [];
        console.log(`서버로부터 가져온 집회 데이터 : ${data.assemblies}`)

        const monthStr = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        // const todayDateString = `${year}-${monthStr}-${day}`; // Already defined above

        const todayAssemblies = fetchedAssemblies.filter((assembly: Assembly) => {
          const assemblyDate = assembly.startDateTime.substring(0, 10);
          return assemblyDate === todayDateString;
        });

        console.log(`오늘 날짜로 필터링한 집회 데이터 : ${todayAssemblies}`)
        setAssemblies(todayAssemblies);
        localStorage.setItem(`assemblies_${todayDateString}`, JSON.stringify(todayAssemblies)); // Store filtered data
        console.log("데이터를 로컬 스토리지에 저장했습니다.");

      } catch (e: unknown) {
        console.error("Failed to fetch assemblies:", e);
        setError("데이터를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredAssemblies = useMemo(() => {
    if (!showOnlyOngoing) {
      return assemblies;
    }
    const now = new Date();
    return assemblies.filter((assembly: Assembly) => {
      const startTime = new Date(assembly.startDateTime);
      const endTime = new Date(assembly.endDateTime);
      return startTime <= now && now <= endTime;
    });
  }, [assemblies, showOnlyOngoing]);

  const today = new Date();
  const formattedDate = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

  const handleAssemblySelect = (assemblyId: string) => {
    setSelectedAssemblyId(assemblyId);
  };

  const renderTableContent = () => {
    if (assemblies.length === 0 && !loading) {
      return <div className="message-box">오늘 예정된 집회가 없습니다.</div>;
    }
    return <AssemblyTable assemblies={filteredAssemblies} onRowClick={handleAssemblySelect} />;
  };

  return (
    <main>
      <div className="container">
        <header className="page-header">
          <div>
            <div className="date-display">{formattedDate}</div>
            <h1>오늘의집회</h1>
          </div>
          <div className="header-controls">
            <div className="store-buttons">
              <a href="https://play.google.com/store/apps/details?id=com.campus.moida&hl=ko" target="_blank" rel="noopener noreferrer">
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" className="store-button-img" />
              </a>
              <a href="https://apps.apple.com/kr/app/%EC%98%A4%EB%8A%98%EC%9D%98%EC%A7%91%ED%9A%8C-%EC%B4%9B%EB%B6%88-%EC%9D%BC%EC%A0%95-%EC%B2%B4%ED%81%AC-%EB%A6%AC%EC%8A%A4%ED%8A%B8%EA%B9%8C%EC%A7%80/id6747088162" target="_blank" rel="noopener noreferrer">
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="Download on the App Store" className="store-button-img" />
              </a>
            </div>
            <div className="toggle-switch-container">
              <span className={showOnlyOngoing ? 'active' : ''}>진행 중인 집회만 보기</span>
              <label className="toggle-switch">
                <input type="checkbox" checked={showOnlyOngoing} onChange={() => setShowOnlyOngoing(!showOnlyOngoing)} />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </header>
      </div>

      {loading && (
        <div className="container">
          <div className="message-box">
            집회 정보를 조회하고 있어요 🔍 <span className="spinner"></span>
          </div>
        </div>
      )}
      {error && <div className="container"><div className="message-box error">{error}</div></div>}

      {!loading && !error && (
        <>
          <AssemblyMap assemblies={filteredAssemblies} selectedAssemblyId={selectedAssemblyId} />
          <div className="container">
            {renderTableContent()}
          </div>
        </>
      )}
    </main>
  );
}