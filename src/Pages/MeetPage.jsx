import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import Topbar from "../Components/Topbar";

const Wrapper = styled.div`
    ::-webkit-scrollbar {
        display: none;
    }
    margin: 0;
    padding: 0;
`

const Main = styled.div`
    display: flex;
`

const LeftSection = styled.div`
    flex: 1;
    padding: 1.5rem;
    background-color: #f8f9fa;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #666;
    font-size: 18px;
`

const RoomInfo = styled.div`
    text-align: center;
    margin-bottom: 20px;
`

const RoomTitle = styled.h1`
    font-size: 24px;
    font-weight: bold;
    color: #034C8C;
    margin-bottom: 10px;
`

const RoomId = styled.p`
    font-size: 14px;
    color: #666;
    margin: 5px 0;
`

const RoomType = styled.span`
    display: inline-block;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: bold;
    margin-top: 5px;
    background-color: ${props => props.isPrivate ? '#ff6b6b' : '#51cf66'};
    color: white;
`

const MeetPlaceholder = styled.div`
    margin-top: 20px;
    padding: 20px;
    border: 2px dashed #ddd;
    border-radius: 8px;
    color: #999;
`

const RightSection = styled.div`
    width: 320px;
    height: 90vh;
    background-color: #ffffff;
    border-left: 1px solid #000;
    display: flex;
    flex-direction: column;
`

const TimerSection = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 25vh;
    width: 100%;
    background-color: #034C8C;
`

const Timer = styled.div`
    color: #fff;
    font-weight: bold;
    font-size: 30px;
`

const RankingSection = styled.div`
    height: 75vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
`

const RankingTitle = styled.div`
    margin: 20px 0;
    font-weight: bold;
    font-size: 24px;
    flex-shrink: 0;
`

const RankingList = styled.div`
    width: 90%;
    flex: 1;
    overflow-y: auto;
    margin-bottom: 80px; /* 버튼 공간 확보 */
    max-height: calc(75vh - 140px); /* 타이틀과 버튼 공간 제외 */
    
    /* 스크롤바 스타일링 */
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
`

const RankingItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    margin-bottom: 8px;
    background-color: ${props => props.isCurrentUser ? '#e3f2fd' : '#f5f5f5'};
    border-radius: 8px;
    border-left: 4px solid ${props => {
        if (props.rank === 1) return '#FFD700';
        if (props.rank === 2) return '#C0C0C0';
        if (props.rank === 3) return '#CD7F32';
        return '#034C8C';
    }};
`

const RankInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`

const Rank = styled.div`
    font-weight: bold;
    font-size: 16px;
    color: #034C8C;
    min-width: 20px;
`

const UserId = styled.div`
    font-weight: 500;
    font-size: 14px;
    color: #333;
`

const StudyTime = styled.div`
    font-weight: bold;
    font-size: 14px;
    color: #666;
`

const ButtonContainer = styled.div`
    position: absolute;
    bottom: 20px;
    width: 90%;
    display: flex;
    gap: 10px;
`

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
`

const StopButton = styled(Button)`
    background-color: ${props => props.isRunning ? '#034C8C' : '#666'};
    color: white;
    
    &:hover {
        background-color: ${props => props.isRunning ? '#666' : '#034C8C'};
    }
`

const ExitButton = styled(Button)`
    background-color: #E8604B;
    color: white;
    
    &:hover {
        background-color:rgb(234, 68, 43);
    }
`

const MeetPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isTimerRunning, setIsTimerRunning] = useState(true);
    const [timer, setTimer] = useState(0); // 초 단위
    
    // location.state에서 방 정보 받아오기
    const roomInfo = location.state || {
        roomId: "unknown",
        roomName: "알 수 없는 방",
        isPrivate: false
    };
    
    // Mock data - 백엔드 연동 시 제거될 부분
    const [rankingData, setRankingData] = useState([
        { userId: "user123", studyTime: "02:45:30", rank: 1, isCurrentUser: false },
        { userId: "student456", studyTime: "02:30:15", rank: 2, isCurrentUser: true },
        { userId: "learner789", studyTime: "02:15:45", rank: 3, isCurrentUser: false },
        { userId: "studybuddy", studyTime: "01:58:20", rank: 4, isCurrentUser: false },
        { userId: "focused_mind", studyTime: "01:45:10", rank: 5, isCurrentUser: false },
        { userId: "bookworm", studyTime: "01:30:25", rank: 6, isCurrentUser: false },
        { userId: "nightowl", studyTime: "01:20:05", rank: 7, isCurrentUser: false },
        { userId: "earlybird", studyTime: "01:10:40", rank: 8, isCurrentUser: false },
    ]);

    // 타이머 로직 (백엔드 연동 시 수정될 부분)
    useEffect(() => {
        let interval;
        if (isTimerRunning) {
            interval = setInterval(() => {
                setTimer(prevTimer => prevTimer + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning]);

    // 시간 포맷팅 함수
    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleStopStart = () => {
        setIsTimerRunning(!isTimerRunning);
        // TODO: 백엔드에 타이머 상태 전송
    };

    const handleExit = () => {
        // TODO: 백엔드에 종료 신호 전송
        navigate('/meetlist'); // meetlist 페이지로 이동
    };

    return (
        <Wrapper>
            <Topbar/>
            <Main>
                <LeftSection>
                    <RoomInfo>
                        <RoomTitle>{roomInfo.roomName}</RoomTitle>
                        <RoomId>방 ID: {roomInfo.roomId}</RoomId>
                        <RoomType isPrivate={roomInfo.isPrivate}>
                            {roomInfo.isPrivate ? '비공개방' : '공개방'}
                        </RoomType>
                    </RoomInfo>
                    <MeetPlaceholder>
                        {/* 백엔드에서 meet 화면 임베딩될 영역 */}
                        Meet 화면 영역
                        <br />
                        (화상채팅 기능이 여기에 들어갑니다)
                    </MeetPlaceholder>
                </LeftSection>
                <RightSection>
                    <TimerSection>
                        <Timer>{formatTime(timer)}</Timer>
                    </TimerSection>
                    <RankingSection>
                        <RankingTitle>
                            Ranking
                        </RankingTitle>
                        <RankingList>
                            {rankingData.map((user, index) => (
                                <RankingItem 
                                    key={user.userId} 
                                    rank={user.rank}
                                    isCurrentUser={user.isCurrentUser}
                                >
                                    <RankInfo>
                                        <Rank>{user.rank}</Rank>
                                        <UserId>{user.userId}</UserId>
                                    </RankInfo>
                                    <StudyTime>{user.studyTime}</StudyTime>
                                </RankingItem>
                            ))}
                        </RankingList>
                        <ButtonContainer>
                            <StopButton 
                                isRunning={isTimerRunning}
                                onClick={handleStopStart}
                            >
                                {isTimerRunning ? 'STOP' : 'START'}
                            </StopButton>
                            <ExitButton onClick={handleExit}>
                                EXIT
                            </ExitButton>
                        </ButtonContainer>
                    </RankingSection>
                </RightSection>
            </Main>
        </Wrapper>
    )
}

export default MeetPage;