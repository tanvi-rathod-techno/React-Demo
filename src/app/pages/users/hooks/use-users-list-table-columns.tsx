import { ColumnDef } from '@tanstack/react-table'
import React from 'react'

import { User } from '@/models/user.model'

interface UseUserListTableColumnsProps {
  actionHandler: (vehicleInfo: User) => void
}

const useUserListTableColumns = ({
  actionHandler,
}: UseUserListTableColumnsProps) =>
  React.useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: 'id',
        cell: (info) => info.getValue(),
        header: 'Id',
        enableSorting: true,
        enableHiding: false,
      },

      {
        accessorKey: 'name',
        cell: ({ row: { original } }) => original.username,
        header: 'Name',
        enableSorting: true,
      },
      {
        accessorKey: 'email',
        cell: (info) => info.getValue(),
        header: 'Email',
        enableSorting: true,
      },
      {
        accessorKey: 'role',
        cell: (info) => info.getValue(),
        header: 'Role',
        enableSorting: true,
      },
      {
        accessorKey: 'actions',
        cell: ({ row: { original } }) => actionHandler(original),
        header: '',
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [actionHandler]
  )

export { useUserListTableColumns }
