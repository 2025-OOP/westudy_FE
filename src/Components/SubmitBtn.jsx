import styled from 'styled-components';

const StyledButton = styled.button`
    width: 400px;
    height: 60px;
    border-radius: 12px;
    background-color: ${({ bg }) => bg || '#022859'};
    color: ${({ color }) => color || '#fff'};
    border: ${({ border }) => border || 'none'};
    font-size: 20px;
    font-weight: 500;
    cursor: pointer;
    padding: 0 16px;
    margin-top: 2rem;

    &:focus {
        outline: none;
    }

    &:hover {
        background-color:#2481A6;
    }
`;

const SubmitBtn = ({ text, onClick, bg, color, border }) => {
    return (
        <StyledButton onClick={onClick} bg={bg} color={color} border={border}>
            {text}
        </StyledButton>
    );
    };

export default SubmitBtn;
