import styled from 'styled-components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../Components/Topbar';
import InputText from '../Components/inputText';
import SubmitBtn from '../Components/SubmitBtn';
import users from '../Data/Userdata';

const Wrapper = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: cetner;
    color: #fff;
`;

const SignupWrapper = styled.div`
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const Title = styled.div`
    color: #000;
    font-size: 28px;
    font-weight: 600;
`
const LoginBtn = styled.div`
    margin-top: 1rem;
    color: #022859;
    cursor: pointer;
    text-decoration: underline;
    font-size: 16px;
`;


const Signup = () => {
    const navigate = useNavigate();
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSignup = () => {
        const exist = users.find(user => user.id === id);

        if (exist) {
            setError('이미 존재하는 아이디입니다.');
            setSuccess('');
        }
        else if (!id || !password) {
            setError('아이디와 비밀번호를 입력하세요.');
            setSuccess('');
        }
        else {
            users.push({ id, password });
            setSuccess('회원가입 성공!');
            setError('');
            setId('');
            setPassword('');
        }
    };


    return (
        <Wrapper>
            <Topbar />
            <SignupWrapper>
                <Title>회원가입</Title>
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
                />
                {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
                {success && <p style={{ color: 'green', marginTop: '1rem' }}>{success}</p>}

                <SubmitBtn 
                    text="회원가입"
                    onClick={handleSignup}
                />

                <LoginBtn
                    onClick={() => navigate('/')}
                >
                    로그인 하러가기
                </LoginBtn>
            </SignupWrapper>
        </Wrapper>
    );
}
export default Signup;
