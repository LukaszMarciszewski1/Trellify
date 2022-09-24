import React, { useState  } from 'react'
import Board from '../../../components/Tasks/Board/Board';
import { useGetAllBoardsQuery  } from '../../../store/api/boards';
import { Board as BoardResponse } from '../../../models/board'
import Loading from '../../../components/Details/Loading/Loading';

const TasksPage: React.FC = () => {
  const { data, error, isLoading } = useGetAllBoardsQuery()
  const [boards, setBoards] = useState<BoardResponse[]>([] as BoardResponse[])

  return (
    <>
      {error && <h2>Error 500</h2>}
      {
        isLoading ? <Loading /> : (
          data?.map((board) => (
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



