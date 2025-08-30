export const metadata = {
  title: '植树问题学习平台 - 五年级数学',
  description: '面向小学五年级的植树问题学习平台：AI智能学习助手与系统化练习，帮助同学夯实数学思维。'
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <link rel="stylesheet" href="/assets/css/main.css" />
        <link rel="icon" type="image/svg+xml" href={"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Ctext x='50%25' y='50%25' dominant-baseline='central' text-anchor='middle' font-size='96'%3E🌳%3C/text%3E%3C/svg%3E"} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}


