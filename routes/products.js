import express from 'express'
import * as auth from '../middlewares/auth.js'
import upload from '../middlewares/upload.js'
import admin from '../middlewares/admin.js'
import contentType from '../middlewares/contentType.js'
import { create, getAll, get, getId, edit, getfish, getshrimpcrab, getshellmollusk, getpreparedfood, getmeat, getothersitems } from '../controllers/products.js'

const router = express.Router()

router.post('/', auth.jwt, admin, contentType('multipart/form-data'), upload, create)
router.get('/all', auth.jwt, admin, getAll)
router.get('/', get)
router.get('/fish', getfish)
router.get('/shrimpcrab', getshrimpcrab)
router.get('/shellmollusk', getshellmollusk)
router.get('/preparedfood', getpreparedfood)
router.get('/meat', getmeat)
router.get('/othersitems', getothersitems)
router.get('/:id', getId)
router.patch('/:id', auth.jwt, admin, contentType('multipart/form-data'), upload, edit)

export default router
