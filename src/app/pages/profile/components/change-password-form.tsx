import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/custom/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  ChangePasswordRequest,
  changePasswordSchema,
} from '@/validations/auth.validation'
import { PasswordInput } from '@/components/custom/password-input'
import { useMutation } from '@tanstack/react-query'
import { toast } from '@/components/ui/use-toast'
import { authService } from '@/api'

export function ChangePasswordForm() {
  const form = useForm<ChangePasswordRequest>({
    resolver: zodResolver(changePasswordSchema),
  })
  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (data: ChangePasswordRequest) =>
      authService.changePassword(data),
    onSuccess: (response) => {
      form.reset()
      toast({
        title: response.message,
      })
    },
    onError: (error) => {
      toast({
        title: error?.message,
      })
    },
  })

  async function onSubmit(data: ChangePasswordRequest) {
    mutateAsync(data)
  }

  return (
    <Form {...form}>
      <form className='mt-2' onSubmit={form.handleSubmit(onSubmit)}>
        <div className='grid gap-2 '>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <FormField
              control={form.control}
              name='oldPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Old password*</FormLabel>
                  <FormControl {...field}>
                    <PasswordInput placeholder='Enter old password' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='newPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password*</FormLabel>
                  <FormControl {...field}>
                    <PasswordInput
                      showTooltip
                      placeholder='Enter new password'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password*</FormLabel>
                  <FormControl {...field}>
                    <PasswordInput placeholder='Enter confirm password' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type='submit'
            className='mr-auto mt-3  w-auto rounded-lg'
            loading={isPending}
          >
            Update Password
          </Button>
        </div>
      </form>
    </Form>
  )
}
