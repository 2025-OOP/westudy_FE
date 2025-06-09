import styled from 'styled-components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../Components/Topbar';
import InputText from '../Components/inputText';
import SubmitBtn from '../Components/SubmitBtn';
import users from '../Data/Userdata';
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
})

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
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    const handleSignup = async () => {
        if (!id.trim() || !password.trim()) {
            setError('아이디와 비밀번호를 입력하세요.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            console.log('Sending request:', { username: id, password: password }); // 디버깅용
            
            const response = await api.post('/api/signup', {
                username: id,
                password: password
            });
    
            console.log('Response received:', response.data); // 디버깅용
            
            if (response.data.status === 'success') {
                setSuccess(response.data.message);
                alert('회원가입 성공!');
                setTimeout(() => {
                    navigate('/');
                }, 500);
            }
        } catch (error) {
            console.error('Full error object:', error); // 전체 에러 정보
            console.error('Error response:', error.response); // 응답 에러 정보
            
            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else if (error.response) {
                setError(`서버 오류: ${error.response.status}`);
            } else {
                setError('네트워크 오류가 발생했습니다.');
            }
        }
    

        // try {
        //     const response = await api.post('/signup', {
        //         username: id,
        //         password: password
        //     });

        //     if (response.data) {
        //         setSuccess('회원가입 성공!');
        //         alert('회원가입 성공!');
        //         navigate('/');
        //     }
        // }
        // catch (error) {
        //     if (error.response) {
        //         const statusCode = error.response.status;
        //         const errorMessage = error.response.data?.message || '회원가입에 실패했습니다.';

        //         if (statusCode === 400) {
        //             setError('이미 존재하는 아이디입니다.');
        //         }
        //         else if (statusCode === 500) {
        //             setError('서버 오류가 발생했습니다. 다시 시도해주세요.');
        //         }
        //         else {
        //             setError(errorMessage);
        //         }
                
        //     } else if (error.request) {
        //         setError('서버와 연결할 수 없습니다. 네트워크를 확인해주세요.');
        //     }
        //     else {
        //         setError('회원가입 중 오류가 발생했습니다.');
        //     }
        //     console.error('Signup error : ', error); }
        finally {
            setLoading(false);
        }
    };


    // const handleSignup = () => {
    //     const exist = users.find(user => user.id === id);

    //     if (exist) {
    //         setError('이미 존재하는 아이디입니다.');
    //         setSuccess('');
    //     }
    //     else if (!id || !password) {
    //         setError('아이디와 비밀번호를 입력하세요.');
    //         setSuccess('');
    //     }
    //     else {
    //         users.push({ id, password });
    //         setSuccess('회원가입 성공!');
    //         setError('');
    //         setId('');
    //         setPassword('');
    //     }
    // };


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
