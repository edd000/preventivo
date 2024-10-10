import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { file } = req.query

  if (typeof file !== 'string') {
    return res.status(400).json({ error: 'Invalid file parameter' })
  }

  const filePath = path.join(process.cwd(), 'data', file)

  try {
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' })
    }

    const fileContents = fs.readFileSync(filePath)
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.send(fileContents)
  } catch (error) {
    console.error('Error reading file:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}