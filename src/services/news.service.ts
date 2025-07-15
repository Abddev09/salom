import { News } from '../models/news.model'
import fs from 'fs'
import path from 'path'
import { User } from '../models'
import bot from '../bot'
import sanitizeHtml from 'sanitize-html'

const uploadsDir = path.join(__dirname, '../../uploads')



export const cleanHtmlForTelegram = (rawHtml: string): string => {
  const decoded = rawHtml.replace(/\\n/g, '\n')

  const lines = decoded
    .split('\n')
    .map(line => {
      const prepared = line
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/&nbsp;/gi, ' ')
        .replace(/<p[^>]*>/gi, '')
        .replace(/<\/p>/gi, '')
        .replace(/<div[^>]*>/gi, '')
        .replace(/<\/div>/gi, '')
        .replace(/<h[1-6][^>]*>/gi, '<b>')
        .replace(/<\/h[1-6]>/gi, '</b>')
        .replace(/<strong>/gi, '<b>')
        .replace(/<\/strong>/gi, '</b>')
        .replace(/<em>/gi, '<i>')
        .replace(/<\/em>/gi, '</i>')
        .replace(/<span[^>]*>/gi, '')
        .replace(/<\/span>/gi, '')

      return sanitizeHtml(prepared, {
        allowedTags: ['b', 'i', 'u', 's', 'a', 'code', 'pre'],
        allowedAttributes: {
          a: ['href'],
        },
      }).trim()
    })
    .filter(line => line.length > 0) // ❗️ faqat meaningful qatorlar

  return lines.join('\n\n') // 2 ta \n bo‘sh qator orasiga
}







export const createNewsService = async (content: string, image?: string) => {
  const news = await News.create({ content, image })

  const messageText = `${news.content}`
  const sentChatIds = new Set<number>()

  if (messageText.length > 1024) {
    return {
      success: false,
      error: "Message caption uzunligi 1024 ta belgidan oshmasligi kerak (Telegram limit). Iltimos, qisqartiring.",
    }
  }

  try {
    const users = await User.findAll()

    for (const user of users) {
      const chatId = Number(user.chatId)
      if (!chatId || sentChatIds.has(chatId)) continue

      sentChatIds.add(chatId)

     if (news.image) {
  const imagePath = path.join(uploadsDir, news.image)

  if (fs.existsSync(imagePath)) {
    console.log("📸 Sending image from:", imagePath)

    await bot.sendPhoto(chatId, fs.createReadStream(imagePath), {
  caption: cleanHtmlForTelegram(news.content),
  parse_mode: "HTML",
})
  } else {
    console.warn("⚠️ Image topilmadi:", imagePath)
  }
}
    }
  } catch (err) {
    console.error("❌ Telegramga yuborishda xatolik:", err)
    return {
      success: false,
      error: "Telegramga yuborishda xatolik yuz berdi.",
    }
  }

  return {
    success: true,
    data: news,
  }
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
