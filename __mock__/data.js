export const cards = [
  {
    id: '1',
    order: 1,
    boardId: '1',
    listId: '1',
    content: '1st keep item',
    like: ['demo'],
    author: 'demo'
  },
  {
    id: '2',
    order: 2,
    boardId: '1',
    listId: '1',
    content: '2nd keep item',
    like: [],
    author: 'test'
  },
  {
    id: '3',
    order: 3,
    boardId: '1',
    listId: '2',
    content: '1st problem item',
    like: ['demo'],
    author: 'test'
  },
  {
    id: '4',
    order: 2,
    boardId: '1',
    listId: '2',
    content: '2nd problem item',
    like: ['demo'],
    author: 'demo'
  },
  {
    id: '5',
    order: 1,
    boardId: '1',
    listId: '2',
    content: '3rd problem item',
    like: [],
    author: 'sample'
  },
  {
    id: '6',
    order: 2,
    boardId: '1',
    listId: '3',
    content: '1st try item',
    like: [],
    author: 'sample'
  },
  {
    id: '7',
    order: 1,
    boardId: '1',
    listId: '3',
    content: '2nd try item',
    like: [],
    author: 'demo'
  }
]

export const lists = [
  { id: '1', order: 1, boardId: '1', title: 'keep' },
  { id: '2', order: 2, boardId: '1', title: 'problem' },
  { id: '3', order: 3, boardId: '1', title: 'try' }
]

export const boards = [{ id: '1', order: 1, title: 'retrospective' }]
