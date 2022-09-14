import mongoose, { Schema, Types } from 'mongoose'

interface Labels {
  uuid: String,
  color: {
    type: String,
    default: '#61bd4f',
  },
  title: String,
  active: {
    type: Boolean,
    default: false,
  },
}

interface IBoard {
  title: string
  user: Types.ObjectId
  background: string
  lists: Types.Array<Types.ObjectId>
  labels: Labels[]
}


const BoardSchema = new Schema(
  {
    title: String,
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    background: String,
    lists: [{ type: Schema.Types.ObjectId, ref: 'List' }],
    labels: [
      {
        uuid: String,
        color: {
          type: String,
          default: '#61bd4f',
        },
        title: String,
        active: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
)

const Board = mongoose.model('Board', BoardSchema)

export default Board
