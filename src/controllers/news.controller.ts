// src/controllers/news.controller.ts
import { Request, Response } from 'express'
import {
  createNewsService,
  getAllNewsService,
  getNewsByIdService,
  updateNewsService,
  deleteNewsService,
} from '../services/news.service'

export const createNews = async (req: Request, res: Response) => {
  try {
    const { content } = req.body
    const image = req.file?.filename

    const news = await createNewsService(content, image)
    res.status(201).json({
      success: true,
      message: 'Yangilik muvaffaqiyatli yaratildi',
      data: news,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Xatolik yaratishda',
      error: err,
    })
  }
}

export const getAllNews = async (_req: Request, res: Response) => {
  const news = await getAllNewsService()
  res.json({
    success: true,
    message: 'Barcha yangiliklar',
    data: news,
  })
}

export const getNewsById = async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const news = await getNewsByIdService(id)

  if (!news) {
    return res.status(404).json({
      success: false,
      message: 'Yangilik topilmadi',
    })
  }

  res.json({
    success: true,
    message: 'Yangilik topildi',
    data: news,
  })
}

export const updateNews = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    const { content } = req.body
    const newImage = req.file?.filename

    const updated = await updateNewsService(id, content, newImage)

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Yangilik topilmadi',
      })
    }

    res.json({
      success: true,
      message: 'Yangilik muvaffaqiyatli yangilandi',
      data: updated,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Xatolik yangilashda',
      error: err,
    })
  }
}

export const deleteNews = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    const deleted = await deleteNewsService(id)

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Yangilik topilmadi',
      })
    }

    res.json({
      success: true,
      message: 'Yangilik o‘chirildi',
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Xatolik o‘chirishda',
      error: err,
    })
  }
}
