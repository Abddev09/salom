// src/services/news.service.ts
import { News } from '../models/news.model'
import fs from 'fs'
import path from 'path'
import { User } from '../models'
import bot from '../bot'
import { Op } from 'sequelize'

const uploadsDir = path.join(__dirname, '../../uploads')

export const createNewsService = async (content: string, image?: string) => {
  const news = await News.create({ content, image })

  const messageText = `${news.content}`
  const sentChatIds = new Set<number>() // 🔑 faqat unikal chatId lar

  try {
    const users = await User.findAll()

    for (const user of users) {
      const chatId = Number(user.chatId)
      if (!chatId || sentChatIds.has(chatId)) continue // ❗ agar oldin yuborilgan bo‘lsa, o'tkazib yubor

      sentChatIds.add(chatId) // ✅ keyin qo‘shib qo‘y
      if (news.image) {
        const imagePath = path.join(uploadsDir, news.image)
        if (fs.existsSync(imagePath)) {
          await bot.sendPhoto(chatId, imagePath, { caption: messageText , parse_mode: "HTML", })
          console.log(`✅ Telegramga yuborildi: ${chatId}`)
        }
      }
    }
  } catch (err) {
    console.error('❌ Telegramga yuborishda xatolik:', err)
  }

  return news
}

export const getAllNewsService = async () => {
  return await News.findAll({ order: [['createdAt', 'DESC']] })
}

export const getNewsByIdService = async (id: number) => {
  return await News.findByPk(id)
}

export const updateNewsService = async (
  id: number,
  content: string,
  newImage?: string
) => {
  const news = await News.findByPk(id)
  if (!news) return null

  // Eski rasmni o‘chirish
  if (newImage && news.image) {
    const oldPath = path.join(uploadsDir, news.image)
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath)
  }

  news.content = content
  if (newImage) news.image = newImage
  await news.save()

  return news
}

export const deleteNewsService = async (id: number) => {
  const news = await News.findByPk(id)
  if (!news) return null

  if (news.image) {
    const imagePath = path.join(uploadsDir, news.image)
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath)
  }

  await news.destroy()
  return news
}
