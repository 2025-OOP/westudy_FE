import styled from "styled-components";
import Topbar from "../Components/Topbar";
import Profile from "../Icons/Profile.svg";
import Calendar from "../Components/Calendar";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Components/UserContext";

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
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
  flex: 1;
  min-height: 0;
  width: 100%;
  height: 70vh;
`;

const Mypage = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useUser();

  if (!isAuthenticated || !currentUser) {
    // 로그인 안 했으면 로그인 페이지로
    navigate("/");
    return null;
  }

  return (
    <Wrapper>
      <Topbar />
      <ProfileWrapper>
        <img src={Profile} alt="" />
        <UserName>{currentUser.username}</UserName>
      </ProfileWrapper>
      <Main>
        <Calendar />
      </Main>
    </Wrapper>
  );
};

export default Mypage;
