import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
const apikey = process.env.COINMARKETCAP_KEY
const DOGECOIN_ID = 74
const url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest'
const apikey_header_name = 'X-CMC_PRO_API_KEY'

const api = async (req: NextApiRequest, res: NextApiResponse) => {
  const dev = req.query.dev
  if (!apikey) {
    return res
      .status(500)
      .json({ error: true, dev: !!dev, message: 'No API key in environment' })
  }
  let price = 0.05
  if (!dev) {
    try {
      price = await getPrice()
    } catch (e) {
      price = 0.05
      console.error(e)
      return res.status(500).json({ error: true, dev: !!dev, price })
    }
  }
  return res.status(500).json({ error: false, dev: !!dev, price })
}

const getPrice = async () => {
  const res = await axios
    .get(url, {
      headers: { [apikey_header_name]: apikey, json: true, gzip: true },
      params: { id: DOGECOIN_ID },
    })
    .then((r) => r.data)
  const price = res.data[DOGECOIN_ID].quote.USD.price

  return price
}

export default api
