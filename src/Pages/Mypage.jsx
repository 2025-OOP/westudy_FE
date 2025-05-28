import styled from "styled-components";
import Topbar from "../Components/Topbar";
import Profile from "../Icons/Profile.svg";
import users from "../Data/Userdata";
import Calendar from "../Components/Calendar";
import Checkbox from "../Components/Checkbox";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Components/UserContext";

const Wrapper = styled.div`
  width: 100%;
  height: 100vh; /* 전체 화면 높이 사용 */
  margin: 0;
  padding: 0;
  overflow-x: hidden;

  body {
    -ms-overflow-style:none;
  }

  ::-webkit-scrollbar {
    display : none;
  }

`;

const ProfileWrapper = styled.div`
  width: calc(100% - 20vw);
  height: 10vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 5vh 10vw;

  img {
    width: 100px;
  }
`;

const UserName = styled.div`
  margin-left: 3vw;
  font-size: 30px;
`;

const Main = styled.div`
  flex: 1; /* 남은 공간을 모두 차지 */
  min-height: 0; /* flex 자식 요소가 축소될 수 있도록 */
  width: 100%;
  height: 70vh;
`;

const Mypage = () => {
  const navigate = useNavigate();
  const { currentUser } = useUser();

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
  },[currentUser, navigate]);

  if (!currentUser) {
    return null;
  }

  return (
    <Wrapper>
      <Topbar />
      <ProfileWrapper>
        <img src={Profile} alt="" />
        <UserName>{currentUser.id}</UserName>
      </ProfileWrapper>
      <Main>
        <Calendar />
      </Main>
    </Wrapper>
  );
};

export default Mypage;
