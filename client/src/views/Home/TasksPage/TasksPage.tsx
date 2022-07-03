import React, { useState, useEffect } from 'react'
import Board from '../../../components/Tasks/Board/Board';
import { useGetAllBoardsQuery, useGetBoardQuery } from '../../../store/api/boards';
import { Board as BoardResponse } from '../../../models/board'
import Loading from '../../../components/Details/Loading/Loading';
import { useParams } from 'react-router-dom';
import { useLocation } from "react-router-dom";

const TasksPage: React.FC = () => {
  const { data, error, isLoading } = useGetAllBoardsQuery()
  const [boards, setBoards] = useState<BoardResponse[]>([] as BoardResponse[])
  const  params = useParams();

  // useEffect(() => {
  //   if (data) {
  //     setBoards(data)
  //   }
  // }, [data])

  return (
    <>
      {error && <h2>Error 500</h2>}
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



