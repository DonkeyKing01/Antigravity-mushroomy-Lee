import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

// 内存存储（在实际应用中应使用数据库）
const uploadStore = new Map();

// 中间件
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 上传图片接口
app.post('/api/upload/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const { imageData, fileName, fileSize, mimeType } = req.body;

  if (!imageData) {
    return res.status(400).json({ error: 'No image data provided' });
  }

  // 存储上传的数据
  uploadStore.set(sessionId, {
    sessionId,
    imageData,
    fileName: fileName || 'upload.jpg',
    fileSize: fileSize || 0,
    mimeType: mimeType || 'image/jpeg',
    uploadedAt: Date.now(),
  });

  console.log(`Image uploaded for session: ${sessionId}`);
  res.json({ success: true, message: 'Image uploaded successfully' });
});

// 获取上传的图片接口
app.get('/api/upload/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const data = uploadStore.get(sessionId);

  if (!data) {
    return res.status(404).json({ error: 'No upload found for this session' });
  }

  res.json(data);
});

// 删除上传的数据接口
app.delete('/api/upload/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  uploadStore.delete(sessionId);
  res.json({ success: true, message: 'Upload deleted' });
});

// 清理过期数据（30分钟）
setInterval(() => {
  const now = Date.now();
  const expireTime = 30 * 60 * 1000; // 30分钟

  for (const [sessionId, data] of uploadStore.entries()) {
    if (now - data.uploadedAt > expireTime) {
      uploadStore.delete(sessionId);
      console.log(`Expired session deleted: ${sessionId}`);
    }
  }
}, 5 * 60 * 1000); // 每5分钟清理一次

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Upload server running on http://0.0.0.0:${PORT}`);
});

