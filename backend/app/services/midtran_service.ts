// app/Services/MidtransService.ts
import midtrans from 'midtrans-client'

export default class MidtransService {
  private snap

  constructor() {
    this.snap = new midtrans.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
    })
  }

  async createTransaction(orderId: string, grossAmount: number, customerName: string) {
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount,
      },
      customer_details: {
        first_name: customerName,
      },
      vtweb: {
        finish_redirect_url: 'https://portfolio.setionugraha.my.id',
      },
    }

    const transaction = await this.snap.createTransaction(parameter)
    return transaction
  }
}
