import styled from "styled-components";
import { useState } from "react";
import Topbar from "../Components/Topbar";
import Dummydata from "../Data/Dummydata";
import { useNavigate } from "react-router-dom";

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
`

const RightSection = styled.div`
    width: 320px;
    height: 90vh;
    background-color: #022859;
    padding: 1.5rem;
`

const Card = styled.div`
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
    display: flex;
    flex-direction: column;
    gap: 1rem;
    height: 70vh;
    overflow-y: auto;
    max-height: 65vh;
    padding-right: 0.5rem;

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

`;

const RoomItem = styled.div`
    display: flex;
    align-items: center;
    justify-content: between;
    padding: 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background-color: white;
`;

const RoomInfo = styled.div`
    flex: 1;
`;

const RoomName = styled.span`
    color: #374151;
    font-weight: 500;
`;

const ParticipantCount = styled.span`
    color: #6b7280;
    font-size: 0.875rem;
    margin-left: 0.5rem;
`;

const JoinButton = styled.button`
    background-color: #034C8C;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    border: none;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: #022859;
    }
`;

const FormGroup = styled.div`
    margin-bottom: 1rem;
`;

const Label = styled.label`
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    margin-bottom: 0.5rem;
`;

const Input = styled.input`
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 1rem;
    box-sizing: border-box;

    &:focus {
        outline: none;
        ring: 2px;
        ring-color: #3b82f6;
        border-color: #d1d5db;
  }
`;

const PrimaryButton = styled.button`
    width: 100%;
    background-color: #2481A6;
    color: white;
    padding: 0.75rem;
    border-radius: 6px;
    border: none;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
    margin-bottom: 1rem;

    &:hover {
        background-color:rgba(36, 129, 166, 0.82);
    }
`;

const SecondaryButton = styled.button`
    width: 100%;
    background-color: white;
    color: #034C8C;
    font-size: 18px;
    padding: 0.75rem;
    border-radius: 6px;
    border: 2px solid white;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: #f9fafb;
    }
`;

const Modal = styled.div`
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
`;

const ModalContent = styled.div`
    background-color: white;
    border-radius: 8px;
    padding: 1.5rem;
    width: 24rem;
    max-width: 90%;
    margin: 1rem;
`;

const ModalTitle = styled.h2`
    font-size: 1.25rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
    color: #374151;
`;

const CheckboxGroup = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
`;

const Checkbox = styled.input`
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

const CheckboxLabel = styled.label`
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 0.75rem;
    margin-top: 1.5rem;
`;

const CancelButton = styled.button`
    flex: 1;
    background-color: #d1d5db;
    color: #374151;
    padding: 0.5rem;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: #9ca3af;
    }
`;

const CreateButton = styled.button`
    flex: 1;
    background-color: #034C8C;
    color: white;
    padding: 0.5rem;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color:rgb(1, 62, 115);
    }
`;

const Meetlist = () => {
    const [showCreateRoom, setShowCreateRoom] = useState(false);
    const [privateRoomForm, setPrivateRoomForm] = useState({
        id: '',
        password: ''
    });
    const [createRoomForm, setCreateRoomForm] = useState({
        roomName: '',
        isPrivate: false,
        password: ''
    })
    const [publicRooms, setPublicRooms] = useState(Dummydata.public_rooms);
    const [privateRooms, setPrivateRooms] = useState(Dummydata.private_rooms);
    const navigate = useNavigate();

    const handleJoinPublicRoom = (roomId) => {
        // 공개방 정보 찾기
        const room = publicRooms.find(room => room.id === roomId);
        if (room) {
            // 방 정보를 state로 전달하면서 MeetPage로 이동
            navigate('/meetpage', { 
                state: { 
                    roomId: room.id, 
                    roomName: room.name, 
                    isPrivate: false 
                } 
            });
        }
    };

    const handleJoinPrivateRoom = () => {
        if (!privateRoomForm.id || !privateRoomForm.password) {
            alert(`ID와 비밀번호를 모두 입력하세요.`);
            return;
        }

        // 비공개방 목록에서 ID와 비밀번호 검증
        const foundRoom = privateRooms.find(room => 
            room.id === privateRoomForm.id && room.password === privateRoomForm.password
        );

        if (foundRoom) {
            // 방 정보를 state로 전달하면서 MeetPage로 이동
            navigate('/meetpage', { 
                state: { 
                    roomId: foundRoom.id, 
                    roomName: foundRoom.name, 
                    isPrivate: true 
                } 
            });
            setPrivateRoomForm({ id: '', password: '' });
        } else {
            alert('존재하지 않는 방이거나 ID 또는 비밀번호가 올바르지 않습니다.');
        }
    };
    
    const handleCreateRoom = () => {
        if (!createRoomForm.roomName) {
            alert('방이름을 입력하세요.');
            return ;
        }
        
        if (createRoomForm.isPrivate) {
            // 비공개방 생성
            if (!createRoomForm.password) {
                alert('비공개방 생성 시 비밀번호를 입력하세요.');
                return;
            }
            
            const newPrivateRoom = {
                id: `private_${Date.now()}`, // 고유한 ID 생성
                name: createRoomForm.roomName,
                password: createRoomForm.password,
                participants: 0
            };
            
            setPrivateRooms([...privateRooms, newPrivateRoom]);
            alert(`비공개 공부방 "${createRoomForm.roomName}"이 생성되었습니다.\nID: ${newPrivateRoom.id}`);
            
            // 생성 후 바로 입장
            navigate('/meetpage', { 
                state: { 
                    roomId: newPrivateRoom.id, 
                    roomName: newPrivateRoom.name, 
                    isPrivate: true 
                } 
            });
        } else {
            // 공개방 생성
            const newRoom = {
                id: publicRooms.length + 1,
                name: createRoomForm.roomName,
                participants: 0
            };
            
            setPublicRooms([...publicRooms, newRoom]);
            alert(`공개 공부방 "${createRoomForm.roomName}"이 생성되었습니다.`);
            
            // 생성 후 바로 입장
            navigate('/meetpage', { 
                state: { 
                    roomId: newRoom.id, 
                    roomName: newRoom.name, 
                    isPrivate: false 
                } 
            });
        }

        setCreateRoomForm({ roomName: '', isPrivate: false, password: '' });
        setShowCreateRoom(false);
    };

    return (
        <Wrapper>
            <Topbar/>
            <Main>
                <LeftSection>
                    <Card>
                        <SectionTitle>공개 공부방 입장</SectionTitle>

                        <RoomList>
                            {publicRooms.map((room) => (
                                <RoomItem key={room.id}>
                                    <RoomInfo>
                                        <RoomName>{room.name}</RoomName>
                                        <ParticipantCount>({room.participants}명)</ParticipantCount>
                                    </RoomInfo>
                                    <JoinButton onClick={() => handleJoinPublicRoom(room.id)}>
                                        입장하기
                                    </JoinButton>
                                </RoomItem>
                            ))}
                        </RoomList>
                    </Card>
                </LeftSection>

                <RightSection>
                    <Card>
                        <SectionTitle>비공개 공부방 입장</SectionTitle>

                        <FormGroup>
                            <Label>ID입력</Label>
                            <Input
                                type="text"
                                value={privateRoomForm.id}
                                onChange={(e) => setPrivateRoomForm({...privateRoomForm, id: e.target.value})}
                                placeholder="ID를 입력하세요."
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleJoinPrivateRoom();
                                    }
                                }}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label>비밀번호 입력</Label>
                            <Input
                                type="password"
                                value={privateRoomForm.password}
                                onChange={(e) => setPrivateRoomForm({...privateRoomForm, password: e.target.value})}
                                placeholder="비밀번호를 입력하세요"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleJoinPrivateRoom();
                                    }
                                }}
            
                            />
                        </FormGroup>

                        <PrimaryButton onClick={handleJoinPrivateRoom}>
                            입장하기
                        </PrimaryButton>
                    </Card>

                    <SecondaryButton onClick={() => setShowCreateRoom(true)}>
                        공부방 생성하기
                    </SecondaryButton>
                </RightSection>
            </Main>

            {showCreateRoom && (
                <Modal>
                    <ModalContent>
                        <ModalTitle>공부방 생성하기</ModalTitle>

                        <FormGroup>
                            <Label>방 이름</Label>
                            <Input
                                type="text"
                                value={createRoomForm.roomName}
                                onChange={(e) => setCreateRoomForm({...createRoomForm, roomName: e.target.value })}
                                placeholder="방 이름을 입력하세요"
                            />
                        </FormGroup>

                        <CheckboxGroup>
                            <Checkbox
                                type="checkbox"
                                id="isPrivate"
                                checked={createRoomForm.isPrivate}
                                onChange={(e) => setCreateRoomForm({...createRoomForm, isPrivate: e.target.checked})}
                            />
                            <CheckboxLabel htmlFor="isPrivate">비공개방으로 생성</CheckboxLabel>
                        </CheckboxGroup>

                        {createRoomForm.isPrivate && (
                            <FormGroup>
                            <Label>비밀번호</Label>
                            <Input
                                type="password"
                                value={createRoomForm.password}
                                onChange={(e) => setCreateRoomForm({...createRoomForm, password: e.target.value})}
                                placeholder="비밀번호를 입력하세요"
                            />
                            </FormGroup>
                        )}
                        
                        <ButtonGroup>
                            <CancelButton onClick={() => setShowCreateRoom(false)}>
                                취소
                            </CancelButton>
                            <CreateButton onClick={handleCreateRoom}>
                                생성하기
                            </CreateButton>
                        </ButtonGroup>
                    </ModalContent>
                </Modal>
            )}
        </Wrapper>
    );
};

export default Meetlist;