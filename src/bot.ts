import TelegramBot from 'node-telegram-bot-api'
import dotenv from 'dotenv'
dotenv.config()

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN as string, { polling: false })

export default bot