import { forwardRef, useState, type InputHTMLAttributes } from 'react'

export interface InputNumberPropsType extends InputHTMLAttributes<HTMLInputElement> {
  classNameInput?: string
  classNameError?: string
  errorMessage?: string
}

const InputNumber = forwardRef<HTMLInputElement, InputNumberPropsType>((props, ref) => {
  const {
    errorMessage,
    className,
    classNameInput = 'w-full border border-gray-300 bg-gray-50 p-2 outline-none focus:border-gray-500 focus:shadow-sm',
    classNameError = 'mt-1 min-h-4 text-red-500',
    onChange,
    value = '',
    ...rest
  } = props

  const [localValue, setLocalValue] = useState<string>(value as string)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target

    if (/^\d+$/.test(value) || value === '') {
      onChange?.(e)
      // gọi onChange của Cha.
      // không phải là onChange gốc của con, mà là hàm field.onChange do React Hook Form cung cấp.
      // Controller truyền field.onChange vào prop onChange của Cha.
      // Khi Cha gọi onChange(event/value), thực chất là gọi field.onChange(event/value), làm React Hook Form cập nhật state form.

      setLocalValue(value)
    }
  }

  return (
    <div className={className}>
      <input className={classNameInput} onChange={handleChange} value={value || localValue} {...rest} ref={ref} />
      {errorMessage && (
        <p className={classNameError} aria-live='polite'>
          {errorMessage}
        </p>
      )}
    </div>
  )
})

export default InputNumber
