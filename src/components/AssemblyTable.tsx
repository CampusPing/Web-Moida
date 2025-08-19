import React from 'react';

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

interface Props {
  assemblies: Assembly[];
  onRowClick: (assemblyId: string) => void;
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

const formatPeopleCount = (count: number) => {
  return `${count.toLocaleString('en-US')}명`;
};

const AssemblyTable: React.FC<Props> = ({ assemblies, onRowClick }) => {
  return (
    <table className="assembly-table">
      <thead>
        <tr>
          <th>자치구</th>
          <th>행정동</th>
          <th>시작 시간</th>
          <th>종료 시간</th>
          <th>장소</th>
          <th>예상 인원</th>
        </tr>
      </thead>
      <tbody>
        {assemblies.filter(Boolean).map((assembly) => (
          <tr key={assembly.id} onClick={() => onRowClick(assembly.id)}>
            <td>{assembly.districtName}</td>
            <td>{assembly.dong}</td>
            <td>{formatTime(assembly.startDateTime)}</td>
            <td>{formatTime(assembly.endDateTime)}</td>
            <td>{assembly.place}</td>
            <td>{formatPeopleCount(assembly.peopleCount)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AssemblyTable;