import React from 'react';

interface TextBoxProps {
    value: string
    readOnly: boolean
    handleChange: (event: React.FormEvent<HTMLInputElement>) => void
    setFocus: () => void
}


const TextBox = (props: TextBoxProps) => (
    <div className="square">
        <input className="squareInput"
            value={props.value}
            onChange={event => props.handleChange(event)}
            onFocus={() => props.setFocus()}
            readOnly={props.readOnly}
        />
    </div>
)

export default TextBox;