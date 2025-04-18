import { authService } from '@/api'
import { Button } from '@/components/custom/button'
import { PasswordInput } from '@/components/custom/password-input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'
import { Routes } from '@/utilities/routes'
import { LoginRequest, loginSchema } from '@/validations/auth.validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { HTMLAttributes, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'

interface UserAuthFormProps extends HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const form = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const mutation = useMutation({
    mutationFn: async (data: LoginRequest) => authService.login(data),
    onSuccess: (response) => {
      let refreshToken = null
      if (!import.meta.env.VITE_COOKIE_BASED_AUTHENTICATION) {
        refreshToken = response.data.tokens.refresh?.token ?? ''
      }
      login(response.data.user, refreshToken)
      setIsLoading(false)
      toast({
        title: response.message,
      })
      navigate(Routes.DASHBOARD)
    },
    onError: (error) => {
      setIsLoading(false)
      toast({
        title: error?.message,
      })
    },
  })

  async function onSubmit(data: LoginRequest) {
    setIsLoading(true)
    mutation.mutateAsync(data)
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-2'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='name@example.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <div className='flex items-center justify-between'>
                    <FormLabel>Password</FormLabel>
                  </div>
                  <FormControl>
                    <PasswordInput placeholder='********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='mt-2' loading={isLoading}>
              Login
            </Button>
            <Link
              to='/forgot-password'
              className='mt-2 text-right text-sm font-medium text-muted-foreground hover:opacity-75'
            >
              Forgot password?
            </Link>
          </div>
        </form>
      </Form>
    </div>
  )
}
