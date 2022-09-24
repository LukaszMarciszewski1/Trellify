export interface Product {
  _id: string
  name: string
  category: string
  quantity: number | string
  unit: string
  price: number | string
  actions?: any
}
