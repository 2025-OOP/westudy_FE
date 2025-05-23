    import styled from 'styled-components';

    const StyledInput = styled.input`
    appearance: none;
    border: 2px solid #D1D1D1;
    border-radius: 12px;
    width: 400px;
    height: 60px;
    padding: 0 18px;
    font-size: 16px;
    box-sizing: border-box;
    outline: none;
    margin-top: 2rem;

    &:focus {
        border-color: #022859;
    }

    &::placeholder {
        color: #4C4C4C;
    }
    `;

    const InputText = ({
    type = "text",
    value,
    onChange,
    placeholder,
    required = false,
    name,
    disabled = false,
    maxLength
    }) => {
    return (
        <StyledInput 
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        name={name}
        disabled={disabled}
        maxLength={maxLength}
        />
    );
    };

    export default InputText;
