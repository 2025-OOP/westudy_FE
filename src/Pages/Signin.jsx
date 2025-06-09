import styled from 'styled-components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../Components/Topbar';
import InputText from '../Components/inputText';
import SubmitBtn from '../Components/SubmitBtn';
import users from '../Data/Userdata';
import { useUser } from '../Components/UserContext';
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080',
    timeout : 10000, 
    headers : {
        'Content-Type' : 'application/json'
    }
})

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
    const [loading, setLoading] = useState(false);
    const { login } = useUser(); // setCurrentUser 대신 login 함수 사용

    const handleLogin = async () => {
        if (!id.trim() || !password.trim()) {
            setError('아이디와 비밀번호를 입력하세요.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await api.post('/api/login', {
                username: id,
                password: password
            });

            if (response.data) {
                console.log('전체 응답 데이터:', response.data);
                
                // 서버 응답에서 사용자 정보와 토큰 추출
                const userData = {
                    username: response.data.username || response.data.user?.username || id,
                    // 필요한 다른 사용자 정보 필드들도 여기에 추가
                };
                const token = response.data.token || 'dummy-token';
                
                console.log('가공된 사용자 정보:', userData);
                
                // UserContext의 login 함수 사용
                login(userData, token);
                
                navigate('/mypage');
                alert('로그인 성공');
            }
        }
        catch (error) {
            if (error.response) {
                const statusCode = error.response.status;
                const errorMessage = error.response.data?.message || '로그인에 실패했습니다.';

                if (statusCode === 401) {
                    setError('아이디 또는 비밀번호가 일치하지 않습니다.');
                }
                else if (statusCode === 400) {
                    setError('잘못된 요청입니다. 입력값을 확인해주세요.');
                }
                else {
                    setError(errorMessage);
                }
            }
            else if (error.request) {
                setError('서버와 연결할 수 없습니다. 네트워크를 확인해주세요.');
            }
            else {
                setError('로그인 중 오류가 발생했습니다.');
            }
            console.error('Login error : ', error);
        } finally {
            setLoading(false);
        }
    };

    // 개발용 로컬 로그인 (필요시 사용)
    // const handleLocalLogin = () => {
    //     const match = users.find(user => user.id === id && user.password === password);

    //     if (match) {
    //         login(match, 'local-token'); // 로컬 로그인도 login 함수 사용
    //         navigate('/mypage');
    //         alert('로그인 성공');
    //         setError('');
    //     }
    //     else {
    //         setError('아이디 또는 비밀번호가 일치하지 않습니다.');
    //     }
    // };

    return (
        <Wrapper>
            <Topbar />
            <Signin_Wrapper>
                <Title>로그인</Title>
                <InputText 
                    value={id}
                    onChange={e => setId(e.target.value)}
                    placeholder="아이디"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleLogin();
                        }
                    }}
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
                    text={loading ? "로그인 중..." : "로그인"}
                    onClick={handleLogin}
                    disabled={loading}
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