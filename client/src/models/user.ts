export interface User {
  _id?: string
  name: string
  email: string
  password: string
  confirm_password: string
  isAdmin?: boolean
  token?: string
}