import './globals.css'

export const metadata = {
  title: 'Rug Pull Detector',
  description: 'Analyze Stellar assets for rug-pull risk and share public report pages with server-rendered previews.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen text-white">{children}</body>
    </html>
  )
}
