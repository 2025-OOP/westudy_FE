// src/pages/MeetPage.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import Topbar from "../Components/Topbar";
import JitsiMeet from "../Components/JitsiMeet";

const Wrapper = styled.div`
  ::-webkit-scrollbar {
    display: none;
  }
  margin: 0;
  padding: 0;
`;

const Main = styled.div`
  display: flex;
`;

const LeftSection = styled.div`
  flex: 1;
  padding: 1.5rem;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
  min-height: 90vh;
  position: relative;
`;

const RoomInfo = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const RoomTitle = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: #034c8c;
  margin-bottom: 10px;
`;

const RoomId = styled.p`
  font-size: 14px;
  color: #666;
  margin: 5px 0;
`;

const RoomType = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  margin-top: 5px;
  background-color: ${(props) => (props.isPrivate ? "#ff6b6b" : "#51cf66")};
  color: white;
`;

const ConnectionStatus = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 10px;
  font-size: 12px;
  color: ${(props) => (props.connected ? "#16a085" : "#e74c3c")};
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${(props) => (props.connected ? "#16a085" : "#e74c3c")};
`;

const MeetContainer = styled.div`
  flex: 1;
  width: 100%;
  height: calc(90vh - 160px);
  margin-top: 20px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  background-color: #000;
`;

const RightSection = styled.div`
  width: 320px;
  height: 90vh;
  background-color: #ffffff;
  border-left: 1px solid #000;
  display: flex;
  flex-direction: column;
`;

const TimerSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 25vh;
  width: 100%;
  background-color: #034c8c;
  position: relative;
`;

const Timer = styled.div`
  color: #fff;
  font-weight: bold;
  font-size: 30px;
`;

const TimerStatus = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  color: #fff;
  font-size: 12px;
  opacity: 0.8;
`;

const AutoStartMessage = styled.div`
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  font-size: 12px;
  opacity: 0.8;
  text-align: center;
`;

const RankingSection = styled.div`
  height: 75vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const RankingTitle = styled.div`
  margin: 20px 0;
  font-weight: bold;
  font-size: 24px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const RefreshButton = styled.button`
  background-color: #6b7280;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;

  &:hover {
    background-color: #4b5563;
  }

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
`;

const RankingList = styled.div`
  width: 90%;
  flex: 1;
  overflow-y: auto;
  margin-bottom: 80px;
  max-height: calc(75vh - 140px);

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

const RankingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  margin-bottom: 8px;
  background-color: ${(props) => (props.isCurrentUser ? "#e3f2fd" : "#f5f5f5")};
  border-radius: 8px;
  border-left: 4px solid
    ${(props) => {
      if (props.rank === 1) return "#FFD700";
      if (props.rank === 2) return "#C0C0C0";
      if (props.rank === 3) return "#CD7F32";
      return "#034c8c";
    }};
`;

const RankInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Rank = styled.div`
  font-weight: bold;
  font-size: 16px;
  color: #034c8c;
  min-width: 20px;
`;

const UserId = styled.div`
  font-weight: 500;
  font-size: 14px;
  color: #333;
`;

const StudyTime = styled.div`
  font-weight: bold;
  font-size: 14px;
  color: #666;
`;

const EmptyMessage = styled.div`
  text-align: center;
  color: #9ca3af;
  font-style: italic;
  padding: 40px 20px;
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: #6b7280;
  font-style: italic;
  padding: 40px 20px;
`;

const ButtonContainer = styled.div`
  position: absolute;
  bottom: 20px;
  width: 90%;
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
  }

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
    transform: none;
  }
`;

const StopButton = styled(Button)`
  background-color: ${(props) => (props.isRunning ? "#034c8c" : "#666")};
  color: white;

  &:hover {
    background-color: ${(props) => (props.isRunning ? "#666" : "#034c8c")};
  }
`;

const ExitButton = styled(Button)`
  background-color: #e8604b;
  color: white;

  &:hover {
    background-color: rgb(234, 68, 43);
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  padding: 12px;
  margin: 10px 0;
  font-size: 14px;
  text-align: center;
`;

const MeetPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isContainerReady, setIsContainerReady] = useState(false);
  const [rankingData, setRankingData] = useState([]);
  const [isLoadingRanking, setIsLoadingRanking] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [error, setError] = useState(null);
  const [backendConnected, setBackendConnected] = useState(false);

  // location.state에서 방 정보 받아오기
  const roomInfo =
    location.state || {
      roomId: "unknown",
      roomName: "알 수 없는 방",
      isPrivate: false,
      isCreator: false,
      currentUser: "사용자",
      userName: "사용자",
    };

  const { roomId, roomName, isPrivate, isCreator, currentUser, userName } =
    roomInfo;
  const actualUserName = currentUser || userName || "사용자";

  // API 기본 URL
  const API_BASE_URL =
    process.env.REACT_APP_USE_PROXY === "true" ? "" : "http://localhost:8080";

  // 백엔드 API 요청 헬퍼
  const apiCall = async (endpoint, options = {}) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setBackendConnected(true);
      return data;
    } catch (error) {
      console.error(`API 요청 실패 (${endpoint}):`, error);
      setBackendConnected(false);
      throw error;
    }
  };

  // 컴포넌트 마운트 시 초기화
  useEffect(() => {
    console.log("MeetPage 마운트됨:", roomInfo);

    // 타이머 자동 시작
    setIsTimerRunning(true);
    console.log("타이머 자동 시작됨");

    // 컨테이너 준비
    const containerTimer = setTimeout(() => {
      setIsContainerReady(true);
    }, 1000);

    // 초기 데이터 로드
    loadInitialData();

    return () => clearTimeout(containerTimer);
  }, []);

  // 초기 데이터 로드 함수
  const loadInitialData = async () => {
    try {
      // 참가자 목록 가져오기
      await fetchParticipants();
    } catch (error) {
      console.error("초기 데이터 로드 실패:", error);
      setError("백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.");
    }
  };

  // 참가자 목록 가져오기
  const fetchParticipants = async () => {
    try {
      setIsLoadingRanking(true);

      const data = await apiCall(`/api/rooms/${roomId}/participants`);

      if (data && data.success && Array.isArray(data.participants)) {
        // 참가자별 공부 시간 데이터 생성
        const participantsWithTime = data.participants.map((participant) => ({
          userId: participant || `참가자${Math.random()}`,
          studyTimeSeconds: participant === actualUserName ? timer : 0, // 초 단위로 저장
          studyTime: participant === actualUserName ? formatTime(timer) : formatTime(0),
          isCurrentUser: participant === actualUserName,
        }));

        // 공부 시간(초)을 기준으로 내림차순 정렬
        const sortedParticipants = participantsWithTime.sort((a, b) => b.studyTimeSeconds - a.studyTimeSeconds);

        // 정렬된 순서대로 랭킹 부여
        const rankingData = sortedParticipants.map((participant, index) => ({
          ...participant,
          rank: index + 1,
        }));

        setRankingData(rankingData);
      } else {
        setRankingData([]);
      }

      console.log("참가자 목록 로드 완료:", data);
    } catch (error) {
      console.error("참가자 목록 가져오기 실패:", error);
      setRankingData([]);
    } finally {
      setIsLoadingRanking(false);
    }
  };

  // 타이머 로직
  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // ⬇️ 여기서 타이머가 변경될 때마다 rankingData 내 현재 사용자 항목의 studyTime을 갱신하고 재정렬
  useEffect(() => {
    setRankingData((prev) => {
      // 현재 사용자의 시간 업데이트
      const updatedData = prev.map((item) => {
        if (item.isCurrentUser) {
          return { 
            ...item, 
            studyTime: formatTime(timer),
            studyTimeSeconds: timer
          };
        }
        return item;
      });

      // 공부 시간(초)을 기준으로 내림차순 정렬
      const sortedData = updatedData.sort((a, b) => b.studyTimeSeconds - a.studyTimeSeconds);

      // 정렬된 순서대로 랭킹 재부여
      const rerankedData = sortedData.map((participant, index) => ({
        ...participant,
        rank: index + 1,
      }));

      return rerankedData;
    });
  }, [timer]);

  // 주기적 참가자 목록 업데이트 (30초마다)
  useEffect(() => {
    const interval = setInterval(() => {
      if (backendConnected) {
        fetchParticipants();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [backendConnected, timer]);
  // └ timer를 의존성에 포함하면, fetchParticipants 호출 시 최신 timer가 반영된 state를 사용

  // 시간 포맷팅 함수
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // 타이머 시작/정지
  const handleStopStart = () => {
    setIsTimerRunning((prev) => !prev);
    console.log(`타이머 ${!isTimerRunning ? "시작" : "정지"}`);
    // TODO: 백엔드에 타이머 API가 추가되면 연동
  };

  // 방 나가기
  const handleExit = async () => {
    if (isExiting) return;

    try {
      setIsExiting(true);
      console.log(`방 나가기 시도: ${roomId}`);

      // 백엔드에 방 나가기 요청 (DELETE)
      await apiCall(`/api/rooms/${roomId}/leave`, {
        method: "DELETE",
        body: JSON.stringify({
          username: actualUserName,
          finalTime: timer,
        }),
      });

      console.log("방 나가기 완료");
      navigate("/meetlist");
    } catch (error) {
      console.error("방 나가기 실패:", error);
      // 백엔드 오류에도 페이지 이동 강제
      navigate("/meetlist");
    } finally {
      setIsExiting(false);
    }
  };

  // Jitsi 회의 종료 핸들러
  const handleMeetingEnd = () => {
    console.log("Jitsi 미팅 종료됨");
    handleExit();
  };

  // 참가자 입장 시 랭킹 새로고침
  const handleParticipantJoined = (participant) => {
    console.log("참가자 입장:", participant);
    setTimeout(() => {
      fetchParticipants();
    }, 1000);
  };

  // 참가자 퇴장 시 랭킹 새로고침
  const handleParticipantLeft = (participant) => {
    console.log("참가자 퇴장:", participant);
    setTimeout(() => {
      fetchParticipants();
    }, 1000);
  };

  // 수동 새로고침 버튼
  const handleRefreshRanking = () => {
    fetchParticipants();
  };

  return (
    <Wrapper>
      <Topbar />
      <Main>
        <LeftSection>
          <RoomInfo>
            <RoomTitle>
              {roomName}
              {isCreator && (
                <span style={{ marginLeft: "10px", fontSize: "16px" }}>👑</span>
              )}
            </RoomTitle>
            <RoomId>방 ID: {roomId}</RoomId>
            <RoomType isPrivate={isPrivate}>
              {isPrivate ? "🔒 비공개방" : "🌐 공개방"}
            </RoomType>
            {isCreator && (
              <div
                style={{
                  marginTop: "5px",
                  fontSize: "12px",
                  color: "#ffd700",
                  fontWeight: "bold",
                }}
              >
                👑 당신이 방장입니다
              </div>
            )}
            <ConnectionStatus connected={backendConnected}>
              <StatusDot connected={backendConnected} />
              {backendConnected ? "백엔드 연결됨" : "백엔드 연결 안됨"}
            </ConnectionStatus>
          </RoomInfo>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <MeetContainer>
            {isContainerReady && (
              <JitsiMeet
                roomId={roomId}
                roomName={roomName}
                currentUser={actualUserName}
                isPrivate={isPrivate}
                onMeetingEnd={handleMeetingEnd}
                onParticipantJoined={handleParticipantJoined}
                onParticipantLeft={handleParticipantLeft}
                width="100%"
                height="100%"
              />
            )}
          </MeetContainer>
        </LeftSection>

        <RightSection>
          <TimerSection>
            <Timer>{formatTime(timer)}</Timer>
            <TimerStatus>
              {isTimerRunning ? "실행 중" : "정지됨"}
            </TimerStatus>
            <AutoStartMessage>
            </AutoStartMessage>
          </TimerSection>

          <RankingSection>
            <RankingTitle>
              참가자 목록
              <RefreshButton
                onClick={handleRefreshRanking}
                disabled={isLoadingRanking}
              >
                {isLoadingRanking ? "로딩..." : "새로고침"}
              </RefreshButton>
            </RankingTitle>

            <RankingList>
              {isLoadingRanking ? (
                <LoadingMessage>참가자 목록을 불러오는 중...</LoadingMessage>
              ) : rankingData.length === 0 ? (
                <EmptyMessage>
                  {backendConnected
                    ? "현재 참가자가 없습니다."
                    : "백엔드 서버에 연결되지 않았습니다."}
                </EmptyMessage>
              ) : (
                rankingData.map((user, index) => (
                  <RankingItem
                    key={user.userId || index}
                    rank={user.rank || index + 1}
                    isCurrentUser={user.isCurrentUser}
                  >
                    <RankInfo>
                      <Rank>{user.rank || index + 1}</Rank>
                      <UserId>
                        {user.userId}
                        {user.isCurrentUser && " (나)"}
                        {isCreator && user.userId === actualUserName && " 👑"}
                      </UserId>
                    </RankInfo>
                    <StudyTime>{user.studyTime}</StudyTime>
                  </RankingItem>
                ))
              )}
            </RankingList>

            <ButtonContainer>
              <StopButton
                isRunning={isTimerRunning}
                onClick={handleStopStart}
              >
                {isTimerRunning ? "STOP" : "START"}
              </StopButton>

              <ExitButton onClick={handleExit} disabled={isExiting}>
                {isExiting ? "나가는 중..." : "EXIT"}
              </ExitButton>
            </ButtonContainer>
          </RankingSection>
        </RightSection>
      </Main>
    </Wrapper>
  );
};

export default MeetPage;