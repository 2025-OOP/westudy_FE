import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Wrapper = styled.div`
    width: 100%;
    height: 10vh;
    display: flex;
    align-items: center;
    background-color: #022859;
    color: #fff;
`;

const Text = styled.div`
    font-size: 2rem;
    font-weight: 600;
    margin-left: 2rem;

    cursor: pointer;
`;

const Topbar = () => {
    const navigate = useNavigate();

    return (
        <Wrapper>
            <Text
                onClick={() => navigate('/mypage')}>
                We Study
            </Text>
        </Wrapper>
    )

}
export default Topbar;