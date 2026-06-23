// dist/api/submit.js
// Vercel Serverless Function — 接收前端表单数据并写入 Supabase
// 部署后在 Vercel 控制台 Settings → Environment Variables 填入：
//   SUPABASE_URL      例：https://xxxxxxxxxxxx.supabase.co
//   SUPABASE_ANON_KEY 例：eyJhbGciOi...（anon public key）

export default async function handler(req, res) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '仅支持 POST 请求' });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

  // 检查环境变量是否已配置
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return res.status(500).json({ error: 'Supabase 环境变量未配置，请联系管理员' });
  }

  try {
    // 拿到前端发来的表单数据
    const { name, company, phone, email, requirement_type, description } = req.body;

    // 直接写入 Supabase 的 submits 表
    const response = await fetch(`${SUPABASE_URL}/rest/v1/submits`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        name,
        company,
        phone,
        email,
        requirement_type,
        description
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`存入数据库失败: ${errText}`);
    }

    return res.status(200).json({ success: true, msg: '提交成功！' });
  } catch (error) {
    console.error('[submit.js] 错误：', error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
}
