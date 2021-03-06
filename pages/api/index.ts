import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
const apikey = process.env.COINMARKETCAP_KEY
const DOGECOIN_ID = 74
const url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest'
const apikey_header_name = 'X-CMC_PRO_API_KEY'

// crash the build if we dont have an api key
if (!apikey) {
  console.error('No API key in environment')
  process.exit(1)
}

const api = async (_: NextApiRequest, res: NextApiResponse) => {
  // make it so value only updates every 5 minutes to prevent overusing api requests
  res.setHeader('Cache-Control', 's-maxage=300, public')

  try {
    const price = await getPrice()
    return res.json({ error: false, price })
  } catch (e) {
    const price = 0.05
    console.error(e)
    return res.status(500).json({ error: true, message: e.message, price })
  }
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
