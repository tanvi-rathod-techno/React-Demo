import { Button } from '@/components/custom/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import {
  ForgotPasswordRequest,
  forgotPasswordSchema,
} from '@/validations/auth.validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { HTMLAttributes, useState } from 'react'
import { useForm } from 'react-hook-form'

interface ForgotFormProps extends HTMLAttributes<HTMLDivElement> {}

export function ForgotForm({ className, ...props }: ForgotFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ForgotPasswordRequest>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  function onSubmit() {
    // data: ForgotPasswordRequest
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
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
            <Button className='mt-2' loading={isLoading}>
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
