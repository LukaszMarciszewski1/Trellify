import mongoose from 'mongoose'
const { Schema } = mongoose

const ListSchema = mongoose.Schema(
  {
    title: String,
    index: Number,
    sourceIndex: Number,
    destinationIndex: Number,
    sortIndex: Number,
    boardId: {
      type: Schema.Types.ObjectId,
      ref: 'Board',
      // required: true,
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
    updateddAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)
ListSchema.statics.getListAndCards = (id) => {
  return List.find({ _id: id }).populate('cards')
}

ListSchema.statics.updateOne = (id, data) => {
  return List.findByIdAndUpdate(id, data)
}

ListSchema.statics.addCard = (id, newCardId) => {
  console.log('addCard', id, newCardId)
  return List.findById(id).then((list) => {
    list.cards = [...list.cards, newCardId]
    return list.save()
  })
}

ListSchema.statics.removeCard = (id, removedCardId) => {
  console.log('removeCard', id, removedCardId)
  return List.findById(id).then((list) => {
    list.cards = list.cards.filter((thisCardId) => {
      console.log(
        'thisCardId',
        thisCardId,
        'removedCardId',
        removedCardId,
        thisCardId != removedCardId
      )
      return thisCardId != removedCardId
    })
    console.log('List after filter', list.listTitle, list.cards)
    return list.save()
  })
}

// ListSchema.virtual('id').get(() => this._id)
const List = mongoose.model('List', ListSchema)

export default List
