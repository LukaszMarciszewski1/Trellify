import React from 'react'
import { useGetAllBoardsQuery } from '../../store/api/boards'
import Board from '../../components/Tasks/Board/Board';
// import SideMenu from '../../components/Tasks/SideMenu/SideMenu';
// import BoardHeader from '../../components/Tasks/BoardHeader/BoardHeader';
import styles from './styles.module.scss'
import { useParams } from 'react-router-dom';
const boardId = '620b88e199b7a598ce7b7187'

const TasksPage: React.FC = () => {
  // const { data: boardApi, error, isLoading } = useGetAllBoardsQuery();
  // console.log(boardApi)
  return (
    <>
      < Board />
    </>
  )
}

export default TasksPage



