import { z } from 'zod'

export enum Roles {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
  GUEST = 'guest',
}

export enum Language {
  ENGLISH = 'english',
  FRENCH = 'french',
  GERMEN = 'germen',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

const roleSchema = z.nativeEnum(Roles, {
  errorMap: () => ({ message: 'Role is required' }),
})

const languageSchema = z.nativeEnum(Language, {
  errorMap: () => ({ message: 'Language is required' }),
})

const genderSchema = z.nativeEnum(Gender, {
  errorMap: () => ({ message: 'Gender is required' }),
})

const emailSchema = z
  .string()
  .min(1, { message: 'Please enter your email' })
  .email({ message: 'Invalid email address' })

export const userSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: 'Username must be at least 2 characters.',
    })
    .max(30, {
      message: 'Username must not be longer than 30 characters.',
    }),
  email: emailSchema,
  role: roleSchema,
})

export type UserAddOrUpdateRequest = z.infer<typeof userSchema>

export const profileFormSchema = z.object({
  firstName: z
    .string()
    .min(2, {
      message: 'First name must be at least 2 characters.',
    })
    .max(30, {
      message: 'First name must not be longer than 30 characters.',
    }),
  lastName: z
    .string()
    .min(2, {
      message: 'Last name must be at least 2 characters.',
    })
    .max(30, {
      message: 'Last name must not be longer than 30 characters.',
    }),
  email: emailSchema,
  dob: z.date({
    required_error: 'A date of birth is required.',
  }),
  language: languageSchema,
  gender: genderSchema,
})

export type ProfileUpdateRequest = z.infer<typeof profileFormSchema>
