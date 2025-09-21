// import { yupResolver } from '@hookform/resolvers/yup'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'

import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'

import authApi from '@/apis/auth.api'
import { AppContext } from '@/contexts/app.context'
import type { ErrorResponse } from '@/types/utils.type'
import { LoginZodSchema, type LoginYupSchemaType } from '@/utils/rules'
import { isAxiosUnprocessableEntityError } from '@/utils/utils'
import { useContext } from 'react'

type FormData = LoginYupSchemaType

export default function Login() {
  const navigate = useNavigate()
  const { setIsAuthenticated, setProfile } = useContext(AppContext)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    // resolver: yupResolver(LoginYupSchema)
    resolver: zodResolver(LoginZodSchema)
  })

  const loginMutation = useMutation({
    mutationFn: authApi.loginAccount
  })

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await loginMutation.mutateAsync(data)
      setIsAuthenticated(true)
      setProfile(res.data.data.user)
      navigate('/')
    } catch (error) {
      if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
        const formError = error.response?.data.data

        if (formError) {
          Object.keys(formError).forEach((key) =>
            setError(key as keyof FormData, {
              message: formError[key as keyof FormData],
              type: 'Server'
            })
          )
        }
      }
    }
  })

  return (
    <div className='bg-orange'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='grid grid-cols-1 lg:grid-cols-5 py-12 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='p-10 rounded bg-white shadow-sm' onSubmit={onSubmit} noValidate>
              <div className='text-2xl'>Đăng nhập</div>

              <div className='mt-8'>
                <input
                  type='email'
                  className='p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                  placeholder='Email'
                  {...register('email')}
                />
                <div className='mt-1 text-red-500 min-h-[1rem] text-sm'>{errors.email?.message}</div>
              </div>
              <div className='mt-3'>
                <input
                  type='password'
                  className='p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                  placeholder='Password'
                  {...register('password')}
                />
                <div className='mt-1 text-red-500 min-h-[1rem] text-sm'>{errors.password?.message}</div>
              </div>

              <div className='mt-3'>
                <button className='button' type='submit'>
                  Đăng nhập
                </button>
              </div>

              <div className='flex items-center justify-center mt-8'>
                <span className='text-gray-400'>Bạn chưa có tài khoản?</span>
                <Link className='text-red-400 ml-1' to='/register'>
                  Đăng ký
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
