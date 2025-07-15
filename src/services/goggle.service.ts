import { google, sheets_v4 } from 'googleapis';
import * as dotenv from 'dotenv';
import { format } from 'date-fns';

dotenv.config();

export class GoogleService {
  private sheets: sheets_v4.Sheets;
  private spreadsheetId: string;

  constructor() {
    const credentials = {
      type: process.env.GOOGLE_TYPE,
      project_id: process.env.GOOGLE_PROJECT_ID,
      private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      client_id: process.env.GOOGLE_CLIENT_ID,
      auth_uri: process.env.GOOGLE_AUTH_URI,
      token_uri: process.env.GOOGLE_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_CERT_URL,
      client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL,
      universe_domain: process.env.GOOGLE_UNIVERSE_DOMAIN,
    };

    this.spreadsheetId = process.env.SPREADSHEET_ID as string;

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    this.sheets = google.sheets({ version: 'v4', auth });
  }

  async ensureSheetExists(sheetTitle: string) {
    try {
      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: this.spreadsheetId,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: sheetTitle,
                },
              },
            },
          ],
        },
      });
    } catch (e) {
      // Sheet mavjud bo‘lsa, jim
    }
  }

  async clearSheet(sheetName: string) {
    try {
      await this.sheets.spreadsheets.values.clear({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!A:Z`,
      });
    } catch (e) {
      // Sheet topilmasa jim
    }
  }

  async writeUsersToSheet(sheetTitle: string, users: any[], includeReferrer = false) {
    await this.ensureSheetExists(sheetTitle);
    await this.clearSheet(sheetTitle);

    const headers = ['#', 'F.I.Sh.', 'Telefon', 'Qo‘shimcha tel', 'Telegram', 'Link', 'Status', 'Ariza vaqti'];
    if (includeReferrer) headers.push('Referrer Operator');

    const values = [
      headers,
      ...users.map((user, i) => {
        const formattedDate = user.applicationDate
          ? format(new Date(user.applicationDate), 'yyyy-MM-dd HH:mm')
          : '';

        const row = [
          i + 1,
          user.fullName || '',
          user.phone || '',
          user.additionalPhone || '',
          user.username || '',
          user.utmTag || '',
          user.status || '',
          formattedDate,
        ];

        if (includeReferrer) {
          row.push(user.referrerOperator?.name || '');
        }

        return row;
      }),
    ];

    await this.sheets.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range: `${sheetTitle}!A1`,
      valueInputOption: 'RAW',
      requestBody: {
        values,
      },
    });
  }
}
