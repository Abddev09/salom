import express from 'express'
import {
  createNews,
  getAllNews,
  getNewsById,
  updateNews,
  deleteNews,
} from '../controllers/news.controller'
import { upload } from '../middlewares/upload'

const router = express.Router()

router.post('/', upload.single('image'), createNews)
router.get('/', getAllNews)
router.get('/:id', getNewsById as any) 
router.put('/:id', upload.single('image'), updateNews as any)
router.delete('/:id', deleteNews as any)

export default router
