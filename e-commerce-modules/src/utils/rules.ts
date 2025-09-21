import * as yup from 'yup'
import * as z from 'zod'

const handleConfirmPasswordYup = (refString: string) => {
  return yup
    .string()
    .required('Nhập lại password là bắt buộc')
    .min(6, 'Độ dài từ 6 - 160 ký tự')
    .max(160, 'Độ dài từ 6 - 160 ký tự')
    .oneOf([yup.ref(refString)], 'Nhập lại password không khớp')
}

export const RegisterYupSchema = yup
  .object({
    email: yup
      .string()
      .required('Email Address is required')
      .email('Email Address is Invalid')
      .min(5, 'Length from 5-160 characters')
      .max(160, 'Length from 5-160 characters')
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email must contain a dot (.) after the "@" symbol.'),

    password: yup
      .string()
      .required('Password is required')
      .min(5, 'Length from 5-160 characters')
      .max(160, 'Length from 5-160 characters'),

    confirm_password: handleConfirmPasswordYup('password')
  })
  .required()

export const RegisterZodSchema = z
  .object({
    email: z
      // .string() version moi khong can
      .email('Email Address is Invalid')
      .min(1, 'Email Address is required')
      .min(5, 'Length from 5-160 characters')
      .max(160, 'Length from 5-160 characters'),

    password: z
      .string()
      .min(1, 'Password is required')
      .min(5, 'Length from 5-160 characters')
      .max(160, 'Length from 5-160 characters'),

    confirm_password: z
      .string()
      .min(1, 'Nhập lại password là bắt buộc')
      .min(6, 'Độ dài từ 6 - 160 ký tự')
      .max(160, 'Độ dài từ 6 - 160 ký tự')
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ['confirm_password'],
    message: 'Mật khẩu không khớp'
  })

export const LoginYupSchema = RegisterYupSchema.omit(['confirm_password'])
export const LoginZodSchema = RegisterZodSchema.omit({ confirm_password: true })

export type LoginYupSchemaType = yup.InferType<typeof LoginYupSchema>
export type LoginZodSchemaType = z.infer<typeof LoginZodSchema>
