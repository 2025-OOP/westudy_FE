import { useState, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";
import StartBtn from "./SubmitBtn";
import { useUser } from "../Components/UserContext";
import { useNavigate } from "react-router-dom";

const GlobalStyle = createGlobalStyle`
  /* 전체 페이지 스크롤바 숨기기 (선택사항) */
  body {
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* Internet Explorer 10+ */
  }
  
  body::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }

  .react-calendar {
    width: 100%;
    height: 100%;
    padding: 10px;
    font-size: 20px;
    line-height: 0.5em;
    background-color: #bcb69b0d;
    border: none;
    border-radius: 10px;
    margin-top: 0px;
  }

  .react-calendar__tile {
    background: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    line-height: 2.5em;
  }

  .react-calendar__tile.saturday {
    color:#6560ff;
  }

  .react-calendar__tile--active {
    background-color: #2481A6 !important;
    color: #fff !important;
    border-radius: 8px;
  }

  .react-calendar__tile--active abbr {
    color: #fff !important;
  }

  .react-calendar__tile:enabled:hover {
    background-color: #e0e0e0;
    border-radius: 8px;
  }

  .react-calendar__tile--now abbr {
    color: #022859;
  }

  .react-calendar__tile--now:enabled:hover,
  .react-calendar__tile--now:enabled:focus {
    color: #fff;
    background-color: #2481A6;
    border-radius: 8px;
  }

  .react-calendar__navigation {
    display: flex;
    height: 50px;
    margin-top: 0.5em;
    margin-bottom: 1em;
  }

  .react-calendar__navigation__label__labelText {
    color: #022859 ;
    font-size: 24px;
    font-weight: 800;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .react-calendar__navigation__arrow {
    color: #022859;
  }

  .react-calendar__month-view__weekdays {
    text-align: center;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 0.5em;
    color: #757575;
  }

  .dot {
    margin-top: 4px;
    height: 8px;
    width: 8px;
    background-color: #F2CA50;
    border-radius: 50%;
    position: absolute;
    bottom: 6px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 0;
  }

  abbr[title] {
    text-decoration: none;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%; /* 부모 컨테이너의 높이를 모두 사용 */
  margin: 0;
  box-sizing: border-box;
`;

const CalendarWrap = styled.div`
  display: flex;
  width: 100%;
  height: 100%; /* 부모의 높이를 모두 사용 */
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
  padding: 10px; /* 약간의 여백 추가 */
  box-sizing: border-box;
`;

const CalendarContainer = styled.div`
  flex: 1;
  height: 100%;
  margin-right: 20px;
`;

const TodoPanel = styled.div`
  width: 100%;
  flex-grow: 1;
  background-color: #ffffff;
  padding: 10px 20px;
  border-radius: 12px;
  border: 1px solid #022859;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  min-height: 0; /* flex 자식이 축소될 수 있도록 */
`;

const Title = styled.h3`
  margin-top: 0px;
  margin-bottom: 15px;
  color: #022859;
  font-size: 24px;
  text-align: center;
`;

const TodoList = styled.div`
  overflow-y: auto;
  flex-grow: 1;
  font-size: 18px;
  width: 100%;
  height: 50vh;
  
  /* 스크롤바 숨기기 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

const TodoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 0;

  span {
    flex: 1;
    word-break: break-word;
    text-decoration: ${(props) => (props.checked ? "line-through" : "none")};
    color: ${(props) => (props.checked ? "#888" : "#333")};
  }
`;

const InputContainer = styled.div`
  display: flex;
  width: 100%;
  gap: 8px;
  margin-bottom: 5px;
`;

const Input = styled.input`
  flex: 1;
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 20px;
  width:70%;

  &:focus {
    outline: none;
  }
`;

const Sidebar = styled.div`
  margin-right: 40px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100%; /* 전체 높이 사용 */
  width: 300px; /* 고정된 너비 */
  flex-shrink: 0; /* 축소되지 않도록 */
  padding: 5px 0;
  min-height: 0; /* flex 자식이 축소될 수 있도록 */
`;

const SidebarContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  height: 100%;
  align-items: center;
`;

const Button = styled.button`
  padding: 8px 14px;
  background-color: #034c8c;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  font-size: 18px;
  cursor: pointer;
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  appearance: none;
  border: 2px solid #ABABAB;
  border-radius: 3px;
  width: 20px;
  height: 20px;
  position: relative;
  background-color: white;
  cursor: pointer;

  &:checked {
    border: 2px solid #4C4C4C;
    background-color: white;

    &::after {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 14px;
      height: 14px;
      background-color: #4C4C4C;
      border-radius: 1px;
    }
  }
`;

// StartBtn을 위한 스타일드 컨테이너
const StartBtnContainer = styled.div`
  margin-top: 5px;
  width: 350px;
`;

// 로그인 프롬프트 스타일
const LoginPrompt = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #022859;
  font-size: 18px;
  text-align: center;
  gap: 20px;
`;

function Mycalendar() {
    const [value, onChange] = useState(new Date());
    const [todos, setTodos] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const { currentUser, isAuthenticated } = useUser();
    const navigate = useNavigate();
    
    const selectedDate = moment(value).format("YYYY-MM-DD");

    // 사용자 정보 가져오기 함수 (수정됨)
    const getUserInfo = () => {
      if (!currentUser) return null;
      return {
          id: currentUser.username,
          username: currentUser.username,
          name: currentUser.username
      };
  };
  const userInfo = getUserInfo();

    // localStorage 키 생성 함수
    const getEventsStorageKey = () => {
        return userInfo ? `calendar_events_${userInfo.id}` : null;
    };

    // 현재 사용자의 events 데이터를 localStorage에서 가져오기
    const getCurrentUserEvents = () => {
        const storageKey = getEventsStorageKey();
        if (!storageKey) return {};
        
        try {
            const savedEvents = localStorage.getItem(storageKey);
            return savedEvents ? JSON.parse(savedEvents) : {};
        } catch (error) {
            console.error('이벤트 데이터 로드 실패:', error);
            return {};
        }
    };

    // 현재 사용자의 events 데이터를 localStorage에 저장하기
    const updateUserEvents = (newEvents) => {
        const storageKey = getEventsStorageKey();
        if (!storageKey) return;
        
        try {
            localStorage.setItem(storageKey, JSON.stringify(newEvents));
        } catch (error) {
            console.error('이벤트 데이터 저장 실패:', error);
        }
    };

    const tileClassName = ({date}) => {
        if(date.getDay() === 6) {
            return 'saturday';
        }
    }
  
    // 현재 선택된 날짜의 할 일 목록 가져오기
    const getCurrentDayTodos = () => {
        const currentEvents = getCurrentUserEvents();
        return currentEvents[selectedDate] || [];
    };

    // selectedDate나 사용자가 변경될 때마다 todos 상태 업데이트
    useEffect(() => {
        if (userInfo) {
            setTodos(getCurrentDayTodos());
        }
    }, [selectedDate, userInfo?.id]);

    // 컴포넌트 마운트 시 저장된 이벤트 로드
    useEffect(() => {
        if (userInfo) {
            setTodos(getCurrentDayTodos());
        }
    }, [userInfo?.id]);

    const handleAddTodo = () => {
        if (!inputValue.trim() || !userInfo) return;
        
        const currentEvents = getCurrentUserEvents();
        const newEvents = {
            ...currentEvents,
            [selectedDate]: [
                ...(currentEvents[selectedDate] || []),
                { text: inputValue, checked: false },
            ],
        };
        
        updateUserEvents(newEvents);
        setTodos(newEvents[selectedDate]);
        setInputValue("");
    };
  
    const toggleTodo = (index, checked) => {
        if (!userInfo) return;
        
        const currentEvents = getCurrentUserEvents();
        const dayTodos = [...(currentEvents[selectedDate] || [])];
        dayTodos[index] = { ...dayTodos[index], checked };
        
        const newEvents = {
            ...currentEvents,
            [selectedDate]: dayTodos,
        };
        
        updateUserEvents(newEvents);
        setTodos(dayTodos);
    };
  
    const tileContent = ({ date }) => {
        if (!userInfo) return null;
        
        const dateStr = moment(date).format("YYYY-MM-DD");
        const currentEvents = getCurrentUserEvents();
        const dayTodos = currentEvents[dateStr] || [];
        return dayTodos.length > 0 ? <div className="dot" /> : null;
    };

    // 로그인하지 않은 경우 로그인 프롬프트 표시
    if (!isAuthenticated || !userInfo) {
        return (
            <Wrapper>
                <GlobalStyle />
                <LoginPrompt>
                    <div>캘린더를 사용하려면 로그인이 필요합니다.</div>
                    <Button onClick={() => navigate('/')}>
                        로그인하러 가기
                    </Button>
                </LoginPrompt>
            </Wrapper>
        );
    }

    return (
      <Wrapper>
        <GlobalStyle />
        <CalendarWrap>
          <CalendarContainer>
            <Calendar onChange={onChange} value={value} tileContent={tileContent} tileClassName={tileClassName} />
          </CalendarContainer>
          <Sidebar>
            <SidebarContent>
              <TodoPanel>
                <div style={{ flex: 1, overflowY: "auto", width: "100%" }}>
                  <Title>
                    {moment(value).format("YYYY년 MM월 DD일")}<br />
                    {userInfo.username}님의 To-Do List
                  </Title>
                  <TodoList>
                    {todos.map((item, idx) => (
                      <TodoItem key={idx} checked={item.checked}>
                        <Checkbox
                          checked={item.checked}
                          onChange={(e) => toggleTodo(idx, e.target.checked)}
                        />
                        <span>{item.text}</span>
                      </TodoItem>
                    ))}
                  </TodoList>
                </div>
                <InputContainer>
                  <Input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="할 일을 입력하세요"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
                  />
                  <Button onClick={handleAddTodo}>추가</Button>
                </InputContainer>
              </TodoPanel>
              <StartBtnContainer>
                <StartBtn 
                  width='100%' 
                  text="공부 시작" 
                  padding="0 20px" 
                  onClick={() => navigate('/meetlist')} 
                />
              </StartBtnContainer>
            </SidebarContent>
          </Sidebar>
        </CalendarWrap>
      </Wrapper>
    );
  }

export default Mycalendar;