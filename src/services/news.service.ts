import { News } from '../models/news.model'
import fs from 'fs'
import path from 'path'
import { User } from '../models'
import bot from '../bot'
import sanitizeHtml from 'sanitize-html'

const uploadsDir = path.join(__dirname, '../../uploads')



export const cleanHtmlForTelegram = (rawHtml: string): string => {
  const prepared = rawHtml
    .replace(/<br\s*\/?>/gi, '\n')        
    .replace(/&nbsp;/gi, '\n')         
    .replace(/<p>/gi, '\n')                
    .replace(/<\/p>/gi, '\n')          
    .replace(/<div>/gi, '\n')            
    .replace(/<\/div>/gi, '\n')        

  return sanitizeHtml(prepared, {
    allowedTags: ['b', 'i', 'u', 's', 'a', 'code', 'pre'], // faqat Telegramga ruxsat etilganlar
    allowedAttributes: {
      a: ['href'],
    },
     transformTags: {
      strong: 'b',
      em: 'i',
      span: 'b',
      h1: 'b',
      h2: 'b',
      h3: 'b',
      h4: 'b',
      h5: 'b',
      h6: 'b',
    },
    textFilter: (text) =>
      text
        .replace(/ +/g, ' ')             // ortiqcha bo‘sh joylar -> bitta
        .replace(/\n{3,}/g, '\n\n')      // 3 yoki undan ortiq \n -> 2 ta
        .trim(),
  })
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
