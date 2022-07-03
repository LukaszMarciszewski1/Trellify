import React, { forwardRef } from 'react'
import styles from './styles.module.scss'

export type InputProps = {
  id: string;
  name: string;
  label: string;
  type?: 'text' | 'email' | 'number' | 'password';
  placeholder: string
  disabled?: boolean
  onChange?: (value: any) => void
  error?: {} | undefined | ((value: any) => void)
  value?: number
}

const Input: React.FC<InputProps> = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      name,
      label,
      type,
      placeholder,
      disabled,
      onChange,
      value,
      ...props
    },
    ref
  ) => {
    return (
      <input
        id={id}
        ref={ref}
        name={name}
        type={type}
        value={value}
        aria-label={label}
        placeholder={placeholder}
        onChange={onChange}
        disabled={disabled}
        className={styles.input}
        {...props}
      />
    )
  }
)

export default Input