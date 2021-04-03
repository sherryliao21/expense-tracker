const express = require('express')
const router = express.Router()

const Record = require('../../models/record')
const Category = require('../../models/category')

router.get('/new', (req, res) => {
  const categoryOptions = new Set()
  Category.find()
    .lean()
    .then(category => {
      category.forEach(item => {
        categoryOptions.add(item.name)
      })
      return res.render('new', { categoryOptions })
    })
    .catch(err => console.log(err))
})

router.get('/:id/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  const categoryOptions = new Set()
  Category.find()
    .lean()
    .then(category => {
      category.forEach(item => {
        categoryOptions.add(item.name)
      })
      return Record.findOne({ userId, _id })
        .lean()
        .then(record => res.render('edit', { record, categoryOptions }))
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))


})

router.post('/', (req, res) => {
  const userId = req.user._id
  const { name, date, category, amount, merchant } = req.body

  if (category) {
    return Category.find({ name: category })
      .lean()
      .then(item => {
        return Record.create({ name, date, icon: item[0].icon, category, amount, merchant, userId })
          .then(() => res.redirect('/'))
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
  }
})

router.put('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  const { name, date, category, amount, merchant } = req.body

  if (category) {
    Category.find({ name: category })
      .lean()
      .then(item => {
        return Record.findOne({ userId, _id })
          .then(record => {
            record.name = name
            record.date = date
            record.icon = item[0].icon
            record.category = category
            record.amount = amount
            record.merchant = merchant
            return record.save()
          })
          .then(() => res.redirect('/'))
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
  }
})

router.delete('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Record.findOne({ _id, userId })
    .then(record => record.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router