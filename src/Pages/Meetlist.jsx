// src/pages/Meetlist.jsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Topbar from "../Components/Topbar";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Components/UserContext";

const Wrapper = styled.div`
  ::-webkit-scrollbar { display: none; }
  margin: 0;
  padding: 0;
`;

const Main = styled.div` display: flex; `;

const LeftSection = styled.div`
  flex: 1;
  padding: 1.5rem;
`;

const RightSection = styled.div`
  width: 320px;
  height: 90vh;
  background-color: #022859;
  padding: 1.5rem;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  padding: 1.5rem;
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #374151;
`;

const RoomList = styled.div`
  display: flex; flex-direction: column; gap: 1rem;
  height: 70vh; overflow-y: auto; max-height: 65vh; padding-right: 0.5rem;
  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 3px; }
  &::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 3px; }
  &::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }
`;

const RoomItem = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  padding: 1rem; border: 1px solid #e5e7eb; border-radius: 8px;
  background-color: white;
`;

const RoomInfo = styled.div` flex: 1; `;

const RoomName = styled.span`
  color: #374151; font-weight: 500;
`;

const RoomType = styled.span`
  background-color: ${p => p.$isPrivate ? "#fef2f2" : "#f0f9ff"};
  color: ${p => p.$isPrivate ? "#991b1b" : "#1e40af"};
  font-size: 0.75rem; font-weight: 500; margin-left: 0.5rem;
  padding: 0.25rem 0.5rem; border-radius: 4px;
`;

const JoinButton = styled.button`
  background-color: #034c8c; color: white; padding: 0.5rem 1rem;
  border-radius: 6px; border: none; font-weight: 500;
  cursor: pointer; transition: background-color 0.2s;
  &:hover { background-color: #022859; }
`;

const RefreshButton = styled.button`
  background-color: #6b7280; 
  color: white; padding: 0.5rem 1rem;
  border-radius: 6px; border: none; font-weight: 500;
  cursor: pointer; transition: background-color 0.2s;
  margin-left: auto;
  margin-bottom: 10px;
  &:hover { background-color: #4b5563; }
`;

const FormGroup = styled.div` margin-bottom: 1rem; `;

const Label = styled.label`
  display: block; font-size: 0.875rem; font-weight: 500;
  color: #374151; margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%; padding: 0.75rem; border: 1px solid #d1d5db;
  border-radius: 6px; font-size: 1rem; box-sizing: border-box;
  &:focus {
    outline: none; border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59,130,246,0.3);
  }
`;

const PrimaryButton = styled.button`
  width: 100%; background-color: #2481a6; color: white;
  padding: 0.75rem; border-radius: 6px; border: none;
  font-weight: 500; cursor: pointer; margin-bottom: 1rem;
  transition: background-color 0.2s;
  &:hover { background-color: rgba(36,129,166,0.82); }
`;

const SecondaryButton = styled.button`
  width: 100%; background-color: white; color: #034c8c;
  font-size: 18px; padding: 0.75rem; border-radius: 6px;
  border: 2px solid white; font-weight: 500; cursor: pointer;
  transition: background-color 0.2s;
  &:hover { background-color: #f9fafb; }
`;

const Modal = styled.div`
  position: fixed; inset: 0; background-color: rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center;
  z-index: 50;
`;

const ModalContent = styled.div`
  background-color: white; border-radius: 8px;
  padding: 1.5rem; width: 24rem; max-width: 90%; margin: 1rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem; font-weight: bold;
  margin-bottom: 1.5rem; color: #374151;
`;

const CheckboxGroup = styled.div`
  display: flex; align-items: center; margin-bottom: 1rem;
`;

const Checkbox = styled.input`
  appearance: none; border: 2px solid #ababab;
  border-radius: 3px; width: 20px; height: 20px;
  position: relative; background-color: white; cursor: pointer;
  &:checked {
    border: 2px solid #4c4c4c;
    &::after {
      content: ""; position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%,-50%);
      width: 14px; height: 14px;
      background-color: #4c4c4c; border-radius: 1px;
    }
  }
`;

const CheckboxLabel = styled.label`
  font-size: 0.875rem; font-weight: 500;
  color: #374151; margin-left: 0.5rem;
`;

const ButtonGroup = styled.div`
  display: flex; gap: 0.75rem; margin-top: 1.5rem;
`;

const CancelButton = styled.button`
  flex: 1; background-color: #d1d5db; color: #374151;
  padding: 0.5rem; border-radius: 6px; border: none;
  cursor: pointer; transition: background-color 0.2s;
  &:hover { background-color: #9ca3af; }
`;

const CreateButton = styled.button`
  flex: 1; background-color: #034c8c; color: white;
  padding: 0.5rem; border-radius: 6px; border: none;
  cursor: pointer; transition: background-color 0.2s;
  &:hover { background-color: rgb(1,62,115); }
`;

const ErrorMessage = styled.div`
  color: #dc2626; background-color: #fef2f2;
  border: 1px solid #fecaca; border-radius: 6px;
  padding: 0.75rem; margin-bottom: 1rem;
  font-size: 0.875rem;
`;

const LoadingMessage = styled.div`
  color: #6b7280; text-align: center;
  padding: 2rem; font-style: italic;
`;

const EmptyMessage = styled.div`
  color: #9ca3af; text-align: center;
  padding: 2rem; font-style: italic;
`;

const PasswordModal = styled(Modal)``;

const PasswordModalContent = styled(ModalContent)``;

const Meetlist = () => {
  const [rooms, setRooms] = useState([]);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [privateRoomForm, setPrivateRoomForm] = useState({ id: "", password: "" });
  const [createRoomForm, setCreateRoomForm] = useState({
    roomName: "", isPrivate: false, password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isPrivateLoading, setIsPrivateLoading] = useState(false);
  const [isCreateLoading, setIsCreateLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useUser();
  const API_BASE_URL = "http://localhost:8080";

  useEffect(() => {
    if (!isAuthenticated || !currentUser) navigate("/");
  }, [isAuthenticated, currentUser, navigate]);

  // 방 목록 조회 - 백엔드가 반환하는 isPrivate 값을 그대로 사용
  const fetchRoomList = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/rooms/list`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      
      // 방 데이터 정규화
      const normalizedRooms = data.map(r => ({
        roomId: r.roomId ?? r.id,
        roomName: r.roomName ?? r.name,
        isPrivate: r.isPrivate ?? false,  // 백엔드에서 password 유무로 설정한 값
        creator: r.creator ?? "",
        createdAt: r.createdAt ?? "",
      }))
      .filter(room => !room.isPrivate);
      
      setRooms(normalizedRooms);
      
      // 디버깅용 로그 (개발 환경에서만)
      if (process.env.NODE_ENV === 'development') {
        console.log('방 목록:', normalizedRooms);
        console.log('공개방:', normalizedRooms.filter(r => !r.isPrivate).length);
        console.log('비공개방:', normalizedRooms.filter(r => r.isPrivate).length);
      }
      
    } catch (e) {
      console.error('방 목록 조회 실패:', e);
      setError(e.message.includes("404")
        ? "API 엔드포인트를 찾을 수 없습니다."
        : "서버에 연결할 수 없습니다."
      );
      setRooms([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomList();
    const iv = setInterval(fetchRoomList, 30000);
    return () => clearInterval(iv);
  }, []);

  const publicRooms = rooms.filter(r => !r.isPrivate);
  const privateCount = rooms.length - publicRooms.length;

  // 공개방 입장 (비공개방 클릭 시 비밀번호 모달 표시)
  const handleJoinPublicRoom = async (roomId, roomName, isPrivate) => {
    if (isPrivate) {
      // 비공개방인 경우 비밀번호 입력 모달 표시
      setSelectedRoom({ roomId, roomName });
      setPasswordInput("");
      setShowPasswordModal(true);
      return;
    }
    
    // 공개방 직접 입장
    try {
      const res = await fetch(`${API_BASE_URL}/api/rooms/${roomId}/enter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: currentUser.username,
          // password는 null로 전송 (공개방이므로)
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${res.status}`);
      }
      
      const body = await res.json();
      
      // 🔥 중요: success 체크를 엄격하게
      if (body.success !== true) {
        throw new Error(body.message || "입장에 실패했습니다.");
      }
      
      navigate("/meetpage", {
        state: {
          roomId, 
          roomName,
          isPrivate: false,
          isCreator: false,
          userName: currentUser.username
        }
      });
    } catch (error) {
      console.error('공개방 입장 실패:', error);
      alert(`공개방 입장에 실패했습니다: ${error.message}`);
    }
  };

  // 비밀번호 모달에서 입장 시도
  const handlePasswordSubmit = async () => {
    if (!passwordInput.trim()) {
      return alert("비밀번호를 입력하세요.");
    }
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/rooms/${selectedRoom.roomId}/enter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: currentUser.username,
          password: passwordInput.trim(),
        }),
      });
      
      // 🔥 중요: 상태 코드 체크 강화
      if (!res.ok) {
        // 401, 403 등 인증 실패 관련 상태 코드 처리
        if (res.status === 401 || res.status === 403) {
          throw new Error("비밀번호가 올바르지 않습니다.");
        }
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${res.status}`);
      }
      
      const body = await res.json();
      
      // 🔥 중요: success 체크를 엄격하게 (=== true로 체크)
      if (body.success !== true) {
        // success가 false이거나 undefined인 경우 모두 실패로 처리
        throw new Error(body.message || "비밀번호가 올바르지 않습니다.");
      }
      
      // 🔥 추가 검증: 입장 권한이 있는지 확인
      if (body.authorized === false) {
        throw new Error("입장 권한이 없습니다.");
      }
      
      setShowPasswordModal(false);
      navigate("/meetpage", {
        state: {
          roomId: selectedRoom.roomId,
          roomName: selectedRoom.roomName,
          isPrivate: true,
          isCreator: false,
          userName: currentUser.username,
        },
      });
      
      // 성공 시 비밀번호 입력 초기화
      setPasswordInput("");
      
    } catch (e) {
      console.error('비공개방 입장 실패:', e);
      alert(e.message);
      // 🔥 중요: 에러 발생 시 입력한 비밀번호 유지 (재시도 편의성)
      // setPasswordInput(""); // 주석 처리
    }
  };

  const handleJoinPrivateRoom = async () => {
    const { id, password } = privateRoomForm;
    if (!id.trim() || !password.trim()) {
      return alert("ID와 비밀번호를 입력하세요.");
    }
    
    setIsPrivateLoading(true);
    
    try {
      const requestBody = {
        username: currentUser.username,
        password: password.trim(),
      };
      
      // 디버깅용 로그 (개발 환경에서만)
      if (process.env.NODE_ENV === 'development') {
        console.log('비공개방 입장 요청:');
        console.log('- Room ID:', id);
        console.log('- Username:', requestBody.username);
        console.log('- Password:', '***'); // 보안상 실제 비밀번호는 로그에 남기지 않음
        console.log('- Request URL:', `${API_BASE_URL}/api/rooms/${id}/enter`);
      }
      
      const res = await fetch(`${API_BASE_URL}/api/rooms/${id}/enter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      
      // 응답 상태 로그
      if (process.env.NODE_ENV === 'development') {
        console.log('서버 응답 상태:', res.status);
      }
      
      // 🔥 중요: 상태 코드 체크 강화
      if (!res.ok) {
        // 401, 403 등 인증 실패 관련 상태 코드 처리
        if (res.status === 401 || res.status === 403 || res.status === 400) {
          throw new Error("비밀번호가 올바르지 않습니다.");
        }
        if (res.status === 404) {
          throw new Error("존재하지 않는 방입니다.");
        }
        
        // 다른 에러의 경우 서버 응답 메시지 확인
        const errorData = await res.json().catch(() => ({}));
        console.error('❌ 서버 에러 응답:', errorData);
        throw new Error(errorData.message || `HTTP ${res.status} 에러가 발생했습니다.`);
      }
      
      const body = await res.json();
      
      // 성공 응답 로그
      if (process.env.NODE_ENV === 'development') {
        console.log('입장 성공 응답:', body);
      }
      
      // 🔥 중요: success 체크를 엄격하게 (=== true로 체크)
      if (body.success !== true) {
        // success가 false이거나 undefined인 경우 모두 실패로 처리
        throw new Error(body.message || "비밀번호가 올바르지 않습니다.");
      }
      
      // 🔥 추가 검증: 입장 권한이 있는지 확인
      if (body.authorized === false) {
        throw new Error("입장 권한이 없습니다.");
      }
      
      // 성공 시 페이지 이동
      console.log('비공개방 입장 성공!');
      
      navigate("/meetpage", {
        state: {
          roomId: parseInt(id), // 숫자로 변환
          roomName: body.roomName || `Room ${id}`,
          isPrivate: true,
          isCreator: false,
          userName: currentUser.username,
        },
      });
      
      // 폼 초기화
      setPrivateRoomForm({ id: "", password: "" });
      
    } catch (e) {
      console.error('비공개방 입장 실패:', e);
      alert(e.message);
      // 🔥 중요: 에러 발생 시 ID는 유지하고 비밀번호만 초기화
      setPrivateRoomForm(prev => ({ ...prev, password: "" }));
    } finally {
      setIsPrivateLoading(false);
    }
  };

  // 공부방 생성 - isPrivate는 보내지 않음 (백엔드가 password로 판단)
  const handleCreateRoom = async () => {
    const { roomName, isPrivate, password } = createRoomForm;
    if (!roomName.trim()) return alert("방 이름을 입력하세요.");
    if (isPrivate && !password.trim()) return alert("비공개방은 비밀번호가 필요합니다.");

    setIsCreateLoading(true);
    try {
      const requestBody = {
        name: roomName.trim(),
        creator: currentUser.username,
        // isPrivate는 보내지 않음 - 백엔드가 password 유무로 판단
        // password: isPrivate ? password.trim() : null,
        ...(isPrivate ?{ password: password.trim() } : {})
      };
      
      // 디버깅용 로그 (개발 환경에서만)
      if (process.env.NODE_ENV === 'development') {
        console.log('방 생성 요청:', requestBody);
      }
      
      const res = await fetch(`${API_BASE_URL}/api/rooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        mode: "cors",
        body: JSON.stringify(requestBody),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${res.status}`);
      }
      
      const body = await res.json();
      if (!body.roomId) {
        throw new Error("서버 응답이 올바르지 않습니다.");
      }
      
      alert(isPrivate
        ? `비공개방 "${roomName}" 생성 완료! ID: ${body.roomId}`
        : `공개방 "${roomName}" 생성 완료! ID: ${body.roomId}`
      );
      
      setCreateRoomForm({ roomName: "", isPrivate: false, password: "" });
      setShowCreateRoom(false);
      await fetchRoomList();
      
      navigate("/meetpage", {
        state: {
          roomId: body.roomId,
          roomName,
          isPrivate,
          isCreator: true,
          userName: currentUser.username,
        },
      });
    } catch (e) {
      console.error('방 생성 실패:', e);
      alert(`방 생성 실패: ${e.message}`);
    } finally {
      setIsCreateLoading(false);
    }
  };

  return (
    <Wrapper>
      <Topbar />
      <Main>
        <LeftSection>
          <Card>
            <div style={{ display: "flex", alignItems: "center" }}>
              <SectionTitle style={{ margin: 0 }}>공개 공부방 입장</SectionTitle>
              <RefreshButton onClick={fetchRoomList} disabled={isLoading}>
                {isLoading ? "새로고침 중..." : "새로고침"}
              </RefreshButton>
            </div>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            {isLoading ? (
              <LoadingMessage>방 목록을 불러오는 중...</LoadingMessage>
            ) : publicRooms.length === 0 ? (
              <EmptyMessage>
                공개된 방이 없습니다.
                {privateCount > 0 && <div>비공개방만 {privateCount}개 있습니다.</div>}
              </EmptyMessage>
            ) : (
              <RoomList>
                {rooms.map(({ roomId, roomName, isPrivate }) => (
                  <RoomItem key={roomId}>
                    <RoomInfo>
                      <RoomName>{roomName}</RoomName>
                      <RoomType $isPrivate={isPrivate}>
                        {isPrivate ? "비공개" : "🌐 공개"}
                      </RoomType>
                    </RoomInfo>
                    <JoinButton onClick={() => handleJoinPublicRoom(roomId, roomName, isPrivate)}>
                      입장하기
                    </JoinButton>
                  </RoomItem>
                ))}
              </RoomList>
            )}
          </Card>
        </LeftSection>

        <RightSection>
          <Card>
            <SectionTitle>비공개 공부방 입장</SectionTitle>
            <FormGroup>
              <Label>방 ID</Label>
              <Input
                type="text"
                value={privateRoomForm.id}
                onChange={e => setPrivateRoomForm({ ...privateRoomForm, id: e.target.value })}
                disabled={isPrivateLoading}
              />
            </FormGroup>
            <FormGroup>
              <Label>비밀번호</Label>
              <Input
                type="password"
                value={privateRoomForm.password}
                onChange={e => setPrivateRoomForm({ ...privateRoomForm, password: e.target.value })}
                onKeyPress={e => e.key === 'Enter' && !isPrivateLoading && handleJoinPrivateRoom()}
                disabled={isPrivateLoading}
              />
            </FormGroup>
            <PrimaryButton onClick={handleJoinPrivateRoom} disabled={isPrivateLoading}>
              {isPrivateLoading ? "입장 중..." : "비공개방 입장하기"}
            </PrimaryButton>
          </Card>
          <SecondaryButton onClick={() => setShowCreateRoom(true)}>
            공부방 생성하기
          </SecondaryButton>
        </RightSection>
      </Main>

      {/* 방 생성 모달 */}
      {showCreateRoom && (
        <Modal onClick={e => e.target === e.currentTarget && setShowCreateRoom(false)}>
          <ModalContent>
            <ModalTitle>공부방 생성하기</ModalTitle>
            <FormGroup>
              <Label>방 이름</Label>
              <Input
                type="text"
                value={createRoomForm.roomName}
                onChange={e => setCreateRoomForm({ ...createRoomForm, roomName: e.target.value })}
                disabled={isCreateLoading}
                autoFocus
              />
            </FormGroup>
            <CheckboxGroup>
              <Checkbox
                type="checkbox"
                checked={createRoomForm.isPrivate}
                onChange={e => setCreateRoomForm({ ...createRoomForm, isPrivate: e.target.checked, password: "" })}
                disabled={isCreateLoading}
              />
              <CheckboxLabel>비공개방 생성</CheckboxLabel>
            </CheckboxGroup>
            {createRoomForm.isPrivate && (
              <FormGroup>
                <Label>비밀번호</Label>
                <Input
                  type="password"
                  value={createRoomForm.password}
                  onChange={e => setCreateRoomForm({ ...createRoomForm, password: e.target.value })}
                  disabled={isCreateLoading}
                />
              </FormGroup>
            )}
            <ButtonGroup>
              <CancelButton onClick={() => setShowCreateRoom(false)} disabled={isCreateLoading}>
                취소
              </CancelButton>
              <CreateButton onClick={handleCreateRoom} disabled={isCreateLoading}>
                {isCreateLoading ? "생성 중..." : "생성하기"}
              </CreateButton>
            </ButtonGroup>
          </ModalContent>
        </Modal>
      )}

      {/* 비밀번호 입력 모달 */}
      {showPasswordModal && (
        <PasswordModal onClick={e => e.target === e.currentTarget && setShowPasswordModal(false)}>
          <PasswordModalContent>
            <ModalTitle>비공개방 비밀번호 입력</ModalTitle>
            <p style={{ marginBottom: '1rem', color: '#6b7280' }}>
              "{selectedRoom?.roomName}" 방에 입장하려면 비밀번호를 입력하세요.
            </p>
            <FormGroup>
              <Label>비밀번호</Label>
              <Input
                type="password"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handlePasswordSubmit()}
                autoFocus
              />
            </FormGroup>
            <ButtonGroup>
              <CancelButton onClick={() => setShowPasswordModal(false)}>
                취소
              </CancelButton>
              <CreateButton onClick={handlePasswordSubmit}>
                입장하기
              </CreateButton>
            </ButtonGroup>
          </PasswordModalContent>
        </PasswordModal>
      )}
    </Wrapper>
  );
};

export default Meetlist;