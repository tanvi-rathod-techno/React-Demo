import { ChangeEvent, useState } from 'react'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { useReactTable, getCoreRowModel } from '@tanstack/react-table'
import { userService } from '@/api'
import { useUserListTableColumns } from '../hooks/use-users-list-table-columns'
import { User, UserListFilter } from '@/models/user.model'
import { Button } from '@/components/custom/button'
import { Search } from '@/components/search'
import { IconEdit, IconTrash } from '@tabler/icons-react'
import { useTableState } from '@/hooks/use-table-state'
import DataTable from '@/components/ui/data-table'
import { DataTableRowActions } from '@/components/ui/data-table-row-actions'
import { DataTablePagination } from '@/components/ui/data-table-pagination'
import { DataTableViewOptions } from '@/components/ui/data-table-view-options'
import { QueryKeys } from '@/data/constants/query-key'
import { DataTableFilter } from '@/components/ui/data-table-filter'
import { Cross2Icon } from '@radix-ui/react-icons'
import { roleOptions } from '@/data/options'
import { UserForm } from './user-form'
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog'
import { toast } from '@/components/ui/use-toast'
import { Roles } from '@/validations/user.validation'

const initialTableState = {
  pagination: {
    pageIndex: 0,
    pageSize: 10,
  },
  filter: {
    role: [],
    search: '',
  },
}

export const UsersList = () => {
  const queryClient = useQueryClient()
  const [userForm, setUserForm] = useState<{
    isOpen: boolean
    user?: User
  }>({ isOpen: false })

  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean
    user?: User
  }>({ isOpen: false })

  const { mutate: deleteUser } = useMutation({
    mutationFn: (userId: number) => userService.deleteUser(userId),
    onSuccess: (response) => {
      toast({
        title: response.message,
      })
      queryClient.invalidateQueries({ queryKey: [QueryKeys.USER_LIST] })
    },
  })

  const {
    tableState,
    handlePaginationChange,
    handleSortChange,
    handleFilterChange,
    resetFilters,
    canReset,
  } = useTableState<UserListFilter>({
    initialState: initialTableState,
  })

  const { data, isFetching, error, isPending } = useQuery({
    queryKey: [QueryKeys.USER_LIST, tableState],
    queryFn: () => userService.getAllUsers(tableState),
  })

  const getActionItems = (user: User) => {
    const actionItems = [
      {
        label: 'Edit',
        icon: <IconEdit className='mr-2' />,
        onClick: () => handleUserFormOpen(user),
      },
      {
        label: 'Delete',
        icon: <IconTrash className='mr-2' />,
        onClick: () => !isPending && handleDeleteUser(user),
        className: 'text-red focus:text-red',
      },
    ]
    return <DataTableRowActions items={actionItems} />
  }

  const columns = useUserListTableColumns({
    actionHandler: getActionItems,
  })

  const tableProps = useReactTable({
    data: data?.data?.users || [],
    columns,
    rowCount: data?.data?.count ?? 0,
    state: {
      pagination: tableState.pagination,
      sorting: tableState.sorting.data,
    },
    onPaginationChange: handlePaginationChange,
    onSortingChange: handleSortChange,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
  })

  const handleUserFormOpen = (user?: User) => {
    setUserForm({ isOpen: true, user })
  }

  const handleUserFormClose = (hasChanges?: boolean) => {
    if (hasChanges) {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.USER_LIST] })
    }
    setUserForm({ isOpen: false })
  }

  const handleDeleteUser = (user: User) => {
    setConfirmDelete({ isOpen: true, user })
  }

  const confirmDeleteUser = () => {
    if (confirmDelete.user) {
      deleteUser(confirmDelete.user.id)
    }
    setConfirmDelete({ isOpen: false })
  }

  const handleRoleChange = (newSelectedValues: string[]) => {
    const role = newSelectedValues as Roles[]
    handleFilterChange({
      ...tableState.filter,
      role,
    })
  }

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFilterChange({
      ...tableState.filter,
      search: event.target.value ?? '',
    })
  }

  return (
    <>
      <div className='flex items-center justify-between'>
        <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
          <Search
            onChange={handleSearchChange}
            searchTerm={tableState.filter.search}
            placeholder='Search User...'
            className='h-8'
          />
          <div className='flex gap-x-2'>
            <DataTableFilter
              title='Role'
              options={roleOptions}
              selectedValues={tableState.filter.role}
              onChange={handleRoleChange}
            />
          </div>
          {canReset() && (
            <Button
              variant='ghost'
              onClick={resetFilters}
              className='h-8 px-2 lg:px-3'
            >
              Reset
              <Cross2Icon className='ml-2 h-4 w-4' />
            </Button>
          )}
          <div className='flex flex-row items-center justify-center gap-2 sm:!ml-auto'>
            <DataTableViewOptions table={tableProps} />
            <Button
              variant='default'
              onClick={() => handleUserFormOpen()}
              className='h-8 px-2 lg:px-3'
            >
              Add User
            </Button>
          </div>
        </div>
      </div>

      <div className='mt-4 rounded-md border'>
        <DataTable<User>
          tableProps={tableProps}
          isFetching={isFetching}
          isError={!!error}
          totalColumn={columns.length}
          hasRecord={!!data?.data?.users?.length}
        />
      </div>
      <div className='mt-4'>
        <DataTablePagination table={tableProps} isFetching={isFetching} />
      </div>

      <UserForm
        isOpen={userForm.isOpen}
        initialData={userForm.user}
        handleClose={handleUserFormClose}
      />
      <ConfirmationDialog
        isOpen={confirmDelete.isOpen}
        message={`Are you sure you want to delete ${confirmDelete.user?.username}?`}
        onConfirm={confirmDeleteUser}
        confirmBtnText='Delete'
        closeBtnText='No'
        onClose={() => setConfirmDelete({ isOpen: false })}
      />
    </>
  )
}
