import React, { useState, useEffect } from 'react'
import Board from '../../../components/Tasks/Board/Board';
import { useGetAllBoardsQuery, useGetBoardQuery } from '../../../store/api/boards';
import { Board as BoardResponse } from '../../../models/board'
import Loading from '../../../components/Details/Loading/Loading';
import { useParams, useSearchParams } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import { useAuth } from '../../../hooks/useAuth'

const TasksPage: React.FC = () => {
  const { data, error, isLoading, refetch } = useGetAllBoardsQuery()
  const [boards, setBoards] = useState<BoardResponse[]>([] as BoardResponse[])
  const { user } = useAuth()
  useEffect(() => {
    if (user) {
      refetch()
    }
  }, [])

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



