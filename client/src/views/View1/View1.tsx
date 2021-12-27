import React, { useEffect, useState, useCallback } from 'react'
import styles from './styles.module.scss'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import {
  useGetAllTasksQuery,
  useAddTaskMutation,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
  useGetTaskQuery
} from "../../store/api/listsReducer";
import {
  useGetAllCardsQuery,
  useAddCardMutation,
  useDeleteCardMutation,
  useUpdateCardMutation,
  useDeleteAllMutation,
} from "../../store/api/cardsReducer";
import TasksList from '../../components/Tasks/TasksList/TasksList'
import TaskButton from '../../components/Tasks/TaskButton/TaskButton'
import TaskForm from '../../components/Tasks/TaskForm/TaskForm'
import TaskCard from '../../components/Tasks/TaskCard/TaskCard';

const View1: React.FC = () => {
  const { data: tasks, error, isLoading } = useGetAllTasksQuery();
  const { data: cards } = useGetAllCardsQuery();
  // const { data: carde } = useGetTaskQuery();

  const [addTask] = useAddTaskMutation()
  const [deleteTask] = useDeleteTaskMutation()
  const [deleteCard] = useDeleteCardMutation()
  const [updateTask] = useUpdateTaskMutation()


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
    if (listTitle.length > 0) {
      addTask({
        title: listTitle,
      })
      setListTitle('')
    }
    else alert('uzupełnij pole')
  }

  const handleDeleteList = () => {

  }

  const [lists, setList] = useState(tasks)
  // let el = tasks

  const reorder = (list: any, startIndex: number, endIndex: number) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    return result
  }

  const onDragEnd = async (result: DropResult) => {
    const { destination, source } = result
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;

    // if(tasks){

    //   const newItems = tasks;
    //   const [removed] = newItems.splice(source.index, 1);
    //   newItems.splice(destination.index, 0, removed);
    //   // użyć metod z baseQuery

    // }
    console.log(result)
    updateTask(destination.index)
    // const items = Array.from(lists);
    // const [newList] = items.splice(result.source.index, 1);
    // items.splice(destination.index, 0, newList);
    // setElements(items)
 
  }


  if (isLoading) return <h2>Loading...</h2>
  if (error) return <h2>error</h2>
  console.log(tasks)

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={styles.container}>
        <Droppable droppableId="all-list" direction="horizontal" type="list">
          {provided => (
            <div className={styles.listContainer}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {
                tasks?.map((list, index) => (
                  <TasksList
                    index={index}
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
  )
}

export default View1


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
