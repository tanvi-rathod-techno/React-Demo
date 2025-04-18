import { ProfilePictureImg } from '@/assets'
import { Button } from '@/components/custom/button'
import { IconUpload } from '@tabler/icons-react'

export function ProfilePictureForm() {
  return (
    <div className='items-center sm:flex sm:space-x-4 xl:block xl:space-x-0 2xl:flex 2xl:space-x-4'>
      <img
        className='mb-4 h-28 w-28 rounded-lg sm:mb-0 xl:mb-4 2xl:mb-0'
        src={ProfilePictureImg}
        alt='profile picture'
      />
      <div>
        <h3 className='mb-1 text-xl font-bold'>Profile picture</h3>
        <div className='mb-4 text-sm text-gray-500 dark:text-gray-400'>
          JPG, GIF or PNG. Max size of 800K
        </div>
        <div className='flex items-center space-x-4'>
          <Button type='button'>
            {' '}
            <IconUpload className='pr-2' /> Upload picture
          </Button>
          <Button type='button' variant='outline'>
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}
