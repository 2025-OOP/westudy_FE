import React, { useEffect, useState } from 'react';

function RoomList() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 백엔드 API에서 공개방 목록 가져오기
    fetch('http://localhost:8080/api/rooms', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        // 백엔드 응답 구조에 맞게 처리
        if (data.success && Array.isArray(data.rooms)) {
          setRooms(data.rooms);
        } else {
          setRooms([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('방 목록 불러오기 실패:', error);
        setError('서버와의 통신에 실패했습니다.');
        setLoading(false);
      });
  }, []);

  // 공개방 입장 함수
  const handleJoinRoom = async (roomId, roomName) => {
    try {
      const response = await fetch(`http://localhost:8080/api/rooms/${roomId}/enter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username: '사용자' // TODO: 실제 로그인된 사용자명으로 대체
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // 성공 시 미팅 페이지로 이동하거나 콜백 실행
        console.log(`${roomName} 방에 입장했습니다.`);
        // navigate('/meetpage', { state: { roomId, roomName, isPrivate: false } });
      } else {
        alert('방 입장에 실패했습니다.');
      }
    } catch (error) {
      console.error('방 입장 오류:', error);
      alert('서버와의 통신에 실패했습니다.');
    }
  };

  if (loading) return <p>방 목록을 불러오는 중...</p>;
  if (error) return <p style={{color: 'red'}}>{error}</p>;

  return (
    <div>
      <h2>스터디룸 목록</h2>
      {rooms.length === 0 ? (
        <p>현재 공개된 스터디룸이 없습니다.</p>
      ) : (
        <ul>
          {rooms.map((room) => (
            <li key={room.id} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc' }}>
              <div>
                <strong>방 이름:</strong> {room.name}
              </div>
              <div>
                <strong>방 ID:</strong> {room.id}
              </div>
              <div>
                <strong>참가자 수:</strong> {room.participants || 0}명
              </div>
              <button 
                onClick={() => handleJoinRoom(room.id, room.name)}
                style={{
                  marginTop: '5px',
                  padding: '5px 10px',
                  backgroundColor: '#034C8C',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                입장하기
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RoomList;