export interface Product {
  _id: string
  name: string
  category: string
  quantity: number
  unit: string
  price: number
  actions?: any
  used?: number
}
