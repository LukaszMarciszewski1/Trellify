import React  from 'react'
import Board from '../../components/Tasks/Board/Board';
import { useGetAllBoardsQuery } from '../../store/api/boards';
import Loading from '../../components/Details/Loading/Loading';

const TasksPage: React.FC = () => {
  const { data, error, isLoading } = useGetAllBoardsQuery()

  return (
    <>
      {error && <h2>Connection error</h2>}
      {
        isLoading ? <Loading /> : (
          data?.map(board => (
            < Board
              key={board._id}
              _id={board._id}
              lists={board.lists}
              background={board.background}
            />
          ))
        )
      }
    </>
  )
}

export default TasksPage



