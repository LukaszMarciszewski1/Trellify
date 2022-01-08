export const mapOrder = (array, order, key) => {
  array.sort((a, b) => order.indexOf(a[key]) - order.indexOf(b[key]))
  return array
}

// const sortedTasks = tasks?.slice().sort((a, b) => +new Date(b.createdDate) - +new Date(a.createdDate))