import React from 'react'
import Board from 'components/TasksBoard/TasksBoard';
import { useGetAllBoardsQuery } from 'store/api/boards';
import ErrorMessage from 'components/common/Messages/ErrorMessage'

const TasksPage: React.FC = () => {
  const { data, error, isLoading } = useGetAllBoardsQuery()
  return (
    <>
      {error && <ErrorMessage message={'Wystąpił błąd serwera, nie można wyświetlić zawartości'} />}
      {
        isLoading ? <div>Loading...</div> : (
          data?.map((board) => (
            < Board
              key={board._id}
              _id={board._id}
              lists={board.lists}
            />
          ))
        )
      }
    </>
  )
}

export default TasksPage



