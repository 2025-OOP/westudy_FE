import styled from 'styled-components';

const StyledButton = styled.button`
    width:  ${({ width }) => width || '400px'};
    height: 60px;
    border-radius: 12px;
    background-color: ${({ bg }) => bg || '#022859'};
    color: ${({ color }) => color || '#fff'};
    border: ${({ border }) => border || 'none'};
    margin-top: ${({ marginTop }) => marginTop || '2rem'};
    padding: ${({ padding }) => padding || '0 16px'};
    font-size: 20px;
    font-weight: 500;
    cursor: pointer;

    &:focus {
        outline: none;
    }

    &:hover {
        background-color:#2481A6;
    }
`;

const SubmitBtn = ({ text, onClick, bg, color, border, marginTop, padding, width }) => {
    return (
        <StyledButton onClick={onClick} bg={bg} color={color} marginTop={marginTop} border={border} padding={padding} width={width}>
            {text}
        </StyledButton>
    );
};

export default SubmitBtn;
