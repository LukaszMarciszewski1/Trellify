import React, { useEffect, useState, useCallback } from 'react'
import styles from './styles.module.scss'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import {
  useGetAllBoardsQuery,
  useGetBoardQuery,
  useUpdateBoardMutation,
} from '../../../store/api/boardsReducer'
import {
  useGetAllTasksQuery,
  useAddTaskMutation,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
  useGetTaskQuery,
  useGetCardsQuery,
} from "../../../store/api/listsReducer";
import {
  useGetAllCardsQuery,
  // useAddCardMutation,
  useDeleteCardMutation,
  useUpdateCardMutation,
  useDeleteAllMutation,
} from "../../../store/api/cardsReducer";
import TasksList from '../TasksList/TasksList'
import TaskButton from '../TaskButton/TaskButton'
import TaskForm from '../TaskForm/TaskForm'
import TaskCard from '../TaskCard/TaskCard';

import { initialData } from '../../../data';

const Board: React.FC = () => {
  const boardID = '61dc8d9fc607ebe1a1363e06'
  const { data: board, error, isLoading } = useGetBoardQuery(boardID);
  const { data: lists } = useGetAllTasksQuery();
  const { data: cards } = useGetAllCardsQuery();

  const [addTask] = useAddTaskMutation()
  const [deleteTask] = useDeleteTaskMutation()
  const [deleteCard] = useDeleteCardMutation()
  const [updateTask] = useUpdateTaskMutation()

  const [updateBoard] = useUpdateBoardMutation()


  const [listTitle, setListTitle] = useState<string>('');
  const [toogleForm, setToogleForm] = useState<boolean>(false)
  const [taskValue, setTaskValue] = useState<string>('')


  const handleToogleTaskForm = () => {
    setToogleForm(form => !form)
  }

  const handleChangeTaskValue = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (e.target.id === 'task-title') setListTitle(e.target.value)
  }


  const handleSubmitTaskForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (lists === undefined) return
    if (listTitle.length > 0) {
      addTask({
        title: listTitle,
        // sourceIndex: lists?.length,
        // destinationIndex: lists?.length,
        boardId: boardID,
        // sortIndex: lists?.length + 1,
      })
      setListTitle('')
    }
    // else alert('uzupełnij pole')
  }

  

  // const preload = async () => {
  //   try {
  //     const newList = lists
  //     setColumns(newList);
  //   } catch (error) {
  //     alert("Couldn't find any Todos! ");
  //   }
  // };
  const [columns, setColumns] = useState(lists)

 
  const onDragEnd = (result: DropResult) => {
    const { destination, source, type, draggableId } = result
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    let newBoard = { ...board }
    newBoard.listOrder = lists?.map(c => c._id)

    if (board) {
      let newList = [...board.lists]
      const [removed] = newList.splice(source.index, 1)
      newList.splice(destination.index, 0, removed)

      updateBoard({
        title: 'zmiana',
        id: boardID,
        listOrder: newBoard.listOrder,
        lists: newList,
        sourceIndex: destination.index,
        destinationIndex: destination.index,
        // sortIndex: destination.index,
      })
    }
  }
console.log(board)
  // console.log(newList)
 //////////////// przetestować bezpośrenie wrzucenie do board.list
 
 if (isLoading) return <h2>Loading...</h2>
 if (error) return <h2>error</h2>
//  const sortedByCreationDate = lists?.slice().sort( (a, b) => (b.index) - (a.index) );
  return (
    <div>
      <h2>{board.title}</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className={styles.container}>
          <Droppable droppableId="all-list" direction="horizontal" type="list">
            {provided => (
              <div className={styles.listContainer}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {
                 board.lists?.map((list: { _id: string; title: string | undefined; }, index: number) => (
                    <TasksList
                      index={index}
                      // sortIndex={list.sortIndex}
                      id={list._id}
                      key={list._id}
                      title={list.title}
                      onClickDelete={() => {
                        deleteTask(list._id)
                      }}
                    >
                      {/* {
                        cards?.map((card, index) => (
                          card.listId === list._id ? (<TaskCard index={index} key={card._id} id={card._id} title={card.title} listId={list._id} />) : null
                        ))
                      } */}
                    </TasksList>
                  ))
                }
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <div>
            {toogleForm ?
              <TaskForm
                handleChange={handleChangeTaskValue}
                handleSubmit={handleSubmitTaskForm}
                titleValue={listTitle}
                placeholder={'dodaj listę zadań'}
              />
              : null}
            <TaskButton onClick={handleToogleTaskForm} />
          </div>
        </div>
      </DragDropContext>
    </div>
  )
}

export default Board

{/* {
              list.cards.map(card => (
                <TaskCard key={card._id} title={card.title} listId={list._id} />
              ))
            } */}
{/* {
              cards?.map((card, index) => (
                card.listId === list._id ? (<TaskCard index={index} key={card._id} id={card._id} title={card.title} listId={list._id}/>) : null
              ))
            } */}
