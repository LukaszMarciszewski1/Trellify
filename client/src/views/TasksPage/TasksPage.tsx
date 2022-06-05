import React, { useState, useEffect } from 'react'
import Board from '../../components/Tasks/Board/Board';
import { useGetAllBoardsQuery } from '../../store/api/boards';
import { Board as BoardResponse } from '../../models/board'
import Loading from '../../components/Details/Loading/Loading';

const TasksPage: React.FC = () => {
  const { data, error, isLoading } = useGetAllBoardsQuery()
  const [boards, setBoards] = useState<BoardResponse[]>([] as BoardResponse[])

  useEffect(() => {
    if (data) {
      setBoards(data)
    }
  }, [data])

  return (
    <>
      {error && <h2>Brak połączenia</h2>}
      {
        isLoading ? <Loading /> : (
          boards?.map(board => (
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



