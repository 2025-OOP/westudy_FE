import styled from 'styled-components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../Components/Topbar';
import InputText from '../Components/inputText';
import SubmitBtn from '../Components/SubmitBtn';
import users from '../Data/Userdata';
import { useUser } from '../Components/UserContext';

const Wrapper = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #fff;
`;

const Title = styled.div`
    color: #000;
    font-size: 28px;
    font-weight: 600;
`

const Signin_Wrapper = styled.div`
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const Signin = () => {
    const navigate = useNavigate();
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { setCurrentUser } = useUser();

    const handleLogin = () => {
        const match = users.find(user => user.id === id && user.password === password);

        if (match) {
            setCurrentUser(match); // 로그인한 사용자 정보 저장
            navigate('/mypage');
            alert('로그인 성공');
            setError('');
        }
        else {
            setError('아이디 또는 비밀번호가 일치하지 않습니다.');
        }
    };


    return (
        <Wrapper>
            <Topbar />
            <Signin_Wrapper>
                <Title>로그인</Title>
                <InputText 
                    value={id}
                    onChange={e => setId(e.target.value)}
                    placeholder="아이디"
                />
                <InputText 
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="비밀번호"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleLogin();
                        }
                    }}
                />
                {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
                <SubmitBtn 
                    text="로그인"
                    onClick={handleLogin}
                />
                <SubmitBtn
                    text="회원가입"
                    onClick={() => navigate('/signup')}
                    bg="#034C8C"
                    color="#fff"
                />
            </Signin_Wrapper>
        </Wrapper>
    )
}
export default Signin;
