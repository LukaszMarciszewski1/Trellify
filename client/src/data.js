
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';



export const Test = () => {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  const time = new Date()
  console.log(dayjs(time).tz("Europe/Warsaw"))
}

export const historyTasks = [
  {
    id:1,
    title: 'Task 1',
    description: 'The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum',
    path: '#!',
  },
  {
    id:2,
    title: 'Task 2',
    description: 'The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum',
    path: '#!',
  },
  {
    id:3,
    title: 'Task 3',
    description: 'The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum',
    path: '#!',
  },
  {
    id:4,
    title: 'Task 4',
    description: 'The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum',
    path: '#!',
  },
  {
    id:5,
    title: 'Task 5',
    description: 'The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum',
    path: '#!',
  },
]