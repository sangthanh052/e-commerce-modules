/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useState } from 'react'
import InputNumber from '../InputNumber'
import type { InputNumberPropsType } from '../InputNumber/InputNumber'


interface PropsType extends InputNumberPropsType {
  max?: number
  onIncrease?: (value: number) => void
  onDecrease?: (value: number) => void
  onType?: (value: number) => void
  onFocusOut?: (value: number) => void
}

export default function QuantityController(props: PropsType) {
  const { max, onIncrease, onDecrease, onType, value, onFocusOut, ...rest } = props
  const [localValue, setLocalValue] = useState<number>(Number(value) || 1)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let _value = Number(e.target.value)
    if (max !== undefined && _value > max) {
      _value = max
    } else if (_value < 1) {
      _value = 1
    }

    if (onType) {
      onType(_value)
    }
    setLocalValue(_value)
  }

  const increase = () => {
    let _value = Number(value || localValue) + 1
    if (max !== undefined && _value > max) {
      _value = max
      return
    }

    if (onIncrease) {
      onIncrease(_value)
    }
    setLocalValue(_value)
  }

  const decrease = () => {
    let _value = Number(value || localValue) - 1
    if (_value < 1) {
      _value = 1
      return
    }

    if (onDecrease) {
      onDecrease(_value)
    }
    setLocalValue(_value)
  }

  const handleBlue = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    onFocusOut && onFocusOut(Number(e.target.value))
  }

  return (
    <div className='flex items-center'>
      <button
        className='border-gray-ccc grid size-8 cursor-pointer place-items-center border disabled:bg-gray-300'
        aria-label='minus'
        onClick={decrease}
        disabled={rest.disabled}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='size-2.5'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M5 12h14' />
        </svg>
      </button>
      <InputNumber
        type='text'
        value={localValue}
        aria-live='assertive'
        className='z-10'
        onChange={handleChange}
        onBlur={handleBlue}
        classNameInput=' border-gray-ccc text-red-52c52 focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 grid h-8 w-12.5 outline-none cursor-text place-items-center border-y'
        {...rest}
      />
      <button
        className='border-gray-ccc grid size-8 cursor-pointer place-items-center border disabled:bg-gray-300'
        aria-label='plus'
        onClick={increase}
        disabled={rest.disabled}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='size-2.5'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
        </svg>
      </button>
    </div>
  )
}
