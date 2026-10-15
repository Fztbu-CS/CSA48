import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const DATA_FILE = path.join(rootDir, 'src', 'data', 'shameData.json');
const AVATARS_DIR = path.join(rootDir, 'public', 'avatars');
const ADMIN_HTML = path.join(__dirname, 'index.html');
const PORT = process.env.ADMIN_PORT || 4399;

// Ensure public/avatars directory exists
if (!fs.existsSync(AVATARS_DIR)) {
  fs.mkdirSync(AVATARS_DIR, { recursive: true });
}

function readData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read shameData.json:', err);
    return { persons: [], incidents: [] };
  }
}

function writeData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Failed to write shameData.json:', err);
    return false;
  }
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(payload));
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      // 10MB limit
      if (body.length > 10 * 1024 * 1024) {
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const urlObj = new URL(req.url, `http://${req.headers.host}`);
  const pathname = urlObj.pathname;

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    return res.end();
  }

  // Static: Admin UI (GET / or GET /index.html)
  if (pathname === '/' || pathname === '/index.html') {
    if (fs.existsSync(ADMIN_HTML)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return fs.createReadStream(ADMIN_HTML).pipe(res);
    } else {
      res.writeHead(404);
      return res.end('Admin UI not found');
    }
  }

  // Static: Public files (GET /avatars/*, /pig.svg)
  if (pathname.startsWith('/avatars/') || pathname === '/pig.svg') {
    const targetFile = pathname.startsWith('/avatars/')
      ? path.join(AVATARS_DIR, path.basename(pathname))
      : path.join(rootDir, 'public', path.basename(pathname));
    if (fs.existsSync(targetFile)) {
      const ext = path.extname(targetFile).toLowerCase();
      const mimeMap = {
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.webp': 'image/webp',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
      };
      res.writeHead(200, { 'Content-Type': mimeMap[ext] || 'application/octet-stream' });
      return fs.createReadStream(targetFile).pipe(res);
    } else {
      res.writeHead(404);
      return res.end('File not found');
    }
  }

  // API: GET /api/data
  if (req.method === 'GET' && pathname === '/api/data') {
    const data = readData();
    return sendJson(res, 200, data);
  }

  // API: POST /api/upload-avatar
  if (req.method === 'POST' && pathname === '/api/upload-avatar') {
    try {
      const { filename, dataUrl } = await parseJsonBody(req);
      if (!filename || !dataUrl) {
        return sendJson(res, 400, { error: 'Missing filename or dataUrl' });
      }

      // Parse dataUrl
      const matches = dataUrl.match(/^data:image\/([a-zA-Z0-9\+\-]+);base64,(.+)$/);
      if (!matches) {
        return sendJson(res, 400, { error: 'Invalid image dataUrl' });
      }

      const rawExt = matches[1].replace('+xml', '');
      const ext = rawExt === 'jpeg' ? 'jpg' : rawExt;
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, 'base64');

      const safeName = `${Date.now()}_${path.parse(filename).name.replace(/[^a-zA-Z0-9_\-\u4e00-\u9fa5]/g, '_')}.${ext}`;
      const targetPath = path.join(AVATARS_DIR, safeName);

      fs.writeFileSync(targetPath, buffer);

      return sendJson(res, 200, {
        success: true,
        url: `/avatars/${safeName}`,
      });
    } catch (err) {
      console.error('Upload avatar error:', err);
      return sendJson(res, 500, { error: err.message });
    }
  }

  // API: POST /api/person (Add or Update Person)
  if (req.method === 'POST' && pathname === '/api/person') {
    try {
      const { id, name, avatar } = await parseJsonBody(req);
      if (!name || !name.trim()) {
        return sendJson(res, 400, { error: '姓名不能为空' });
      }

      const data = readData();
      let person;

      if (id) {
        // Update existing
        person = data.persons.find((p) => p.id === id);
        if (!person) {
          return sendJson(res, 404, { error: '人员不存在' });
        }
        person.name = name.trim();
        person.avatar = (avatar || '').trim() || person.name[0];
      } else {
        // Create new
        const newId = 'p_' + Date.now().toString(36);
        person = {
          id: newId,
          name: name.trim(),
          nickname: '',
          avatar: (avatar || '').trim() || name.trim()[0],
          joinedAt: new Date().toISOString().split('T')[0],
        };
        data.persons.push(person);
      }

      writeData(data);
      return sendJson(res, 200, { success: true, person });
    } catch (err) {
      console.error('Person save error:', err);
      return sendJson(res, 500, { error: err.message });
    }
  }

  // API: DELETE /api/person
  if (req.method === 'DELETE' && pathname === '/api/person') {
    try {
      const { id } = await parseJsonBody(req);
      if (!id) {
        return sendJson(res, 400, { error: '缺少人员 ID' });
      }

      const data = readData();
      data.persons = data.persons.filter((p) => p.id !== id);
      // Cascade: remove incidents associated with this person
      data.incidents = data.incidents.filter((i) => i.personId !== id);

      writeData(data);
      return sendJson(res, 200, { success: true });
    } catch (err) {
      console.error('Person delete error:', err);
      return sendJson(res, 500, { error: err.message });
    }
  }

  // API: POST /api/incident (Add or Update Incident)
  if (req.method === 'POST' && pathname === '/api/incident') {
    try {
      const { id, personId, title, description, date } = await parseJsonBody(req);
      if (!personId || !title || !title.trim()) {
        return sendJson(res, 400, { error: '请选择猪猪并输入事件标题' });
      }

      const data = readData();
      let incident;

      if (id) {
        // Update
        incident = data.incidents.find((i) => i.id === id);
        if (!incident) {
          return sendJson(res, 404, { error: '事迹不存在' });
        }
        incident.personId = personId;
        incident.title = title.trim();
        incident.description = (description || '').trim();
        incident.date = date || new Date().toISOString().split('T')[0];
      } else {
        // Create new
        const newId = 'inc-' + Date.now().toString(36);
        incident = {
          id: newId,
          personId,
          title: title.trim(),
          description: (description || '').trim(),
          date: date || new Date().toISOString().split('T')[0],
          severity: 3,
          category: 'code',
          witnesses: [],
          tags: [],
        };
        data.incidents.unshift(incident); // Add to beginning
      }

      writeData(data);
      return sendJson(res, 200, { success: true, incident });
    } catch (err) {
      console.error('Incident save error:', err);
      return sendJson(res, 500, { error: err.message });
    }
  }

  // API: DELETE /api/incident
  if (req.method === 'DELETE' && pathname === '/api/incident') {
    try {
      const { id } = await parseJsonBody(req);
      if (!id) {
        return sendJson(res, 400, { error: '缺少事迹 ID' });
      }

      const data = readData();
      data.incidents = data.incidents.filter((i) => i.id !== id);

      writeData(data);
      return sendJson(res, 200, { success: true });
    } catch (err) {
      console.error('Incident delete error:', err);
      return sendJson(res, 500, { error: err.message });
    }
  }

  // Fallback 404
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log('================================================================');
  console.log('🚀 !?猪猪?! · 本地管理小工具已启动！');
  console.log(`👉 控制台管理地址: http://localhost:${PORT}`);
  console.log(`📁 数据源文件: ${DATA_FILE}`);
  console.log(`🖼️ 头像保存目录: ${AVATARS_DIR}`);
  console.log('🌐 前台页面地址: http://localhost:4321');
  console.log('================================================================');
});
