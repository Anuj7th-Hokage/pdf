import { useState } from 'react'
import TextToPDF from './components/TextToPDF.jsx'
import ImageToPDF from './components/ImageToPDF.jsx'
import HtmlToPDF from './components/HtmlToPDF.jsx'
import styles from './App.module.css'

const TABS = [
  { id: 'text', label: 'Text → PDF' },
  { id: 'image', label: 'Image → PDF' },
  { id: 'html', label: 'HTML → PDF' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('text')

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>⬛</span>
          <span className={styles.logoText}>PDFKIT</span>
        </div>
        <p className={styles.tagline}>Convert anything to PDF — fast.</p>
      </header>

      <main className={styles.main}>
        <nav className={styles.tabs}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className={styles.panel}>
          {activeTab === 'text' && <TextToPDF />}
          {activeTab === 'image' && <ImageToPDF />}
          {activeTab === 'html' && <HtmlToPDF />}
        </div>
      </main>

      <footer className={styles.footer}>
        <span className={styles.footerText}>PDFKIT — client-side only, nothing leaves your browser</span>
      </footer>
    </div>
  )
}
