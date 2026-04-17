import { useState } from 'react'
import { jsPDF } from 'jspdf'
import styles from './Converter.module.css'

const FONTS = ['helvetica', 'courier', 'times']
const SIZES = [10, 12, 14, 16, 18]
const ORIENTATIONS = ['portrait', 'landscape']

export default function TextToPDF() {
  const [text, setText] = useState('')
  const [title, setTitle] = useState('')
  const [font, setFont] = useState('helvetica')
  const [fontSize, setFontSize] = useState(12)
  const [orientation, setOrientation] = useState('portrait')
  const [status, setStatus] = useState(null) // 'success' | 'error' | null

  const generate = () => {
    if (!text.trim()) {
      setStatus('error')
      setTimeout(() => setStatus(null), 2000)
      return
    }

    try {
      const doc = new jsPDF({ orientation })
      const margin = 20
      const pageWidth = doc.internal.pageSize.getWidth()
      const maxWidth = pageWidth - margin * 2

      doc.setFont(font)
      doc.setFontSize(fontSize)

      if (title.trim()) {
        doc.setFontSize(fontSize + 4)
        doc.setFont(font, 'bold')
        doc.text(title.trim(), margin, margin + 4)
        doc.setFont(font, 'normal')
        doc.setFontSize(fontSize)
      }

      const lines = doc.splitTextToSize(text.trim(), maxWidth)
      const startY = title.trim() ? margin + 16 : margin + 4
      doc.text(lines, margin, startY)

      const filename = (title.trim() || 'document').replace(/\s+/g, '_').toLowerCase()
      doc.save(`${filename}.pdf`)
      setStatus('success')
      setTimeout(() => setStatus(null), 2500)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus(null), 2000)
    }
  }

  return (
    <div className={styles.converter}>
      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Document Title <span className={styles.optional}>(optional)</span></label>
          <input
            className={styles.input}
            type="text"
            placeholder="Untitled document"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Content</label>
        <textarea
          className={styles.textarea}
          placeholder="Paste or type your text here..."
          value={text}
          onChange={e => setText(e.target.value)}
          rows={12}
        />
        <span className={styles.charCount}>{text.length} chars</span>
      </div>

      <div className={styles.options}>
        <div className={styles.field}>
          <label className={styles.label}>Font</label>
          <select className={styles.select} value={font} onChange={e => setFont(e.target.value)}>
            {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Font Size</label>
          <select className={styles.select} value={fontSize} onChange={e => setFontSize(Number(e.target.value))}>
            {SIZES.map(s => <option key={s} value={s}>{s}pt</option>)}
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Orientation</label>
          <select className={styles.select} value={orientation} onChange={e => setOrientation(e.target.value)}>
            {ORIENTATIONS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      </div>

      <button className={styles.btn} onClick={generate}>
        Generate PDF
        <span className={styles.btnArrow}>↓</span>
      </button>

      {status === 'success' && <p className={styles.success}>✓ PDF downloaded</p>}
      {status === 'error' && <p className={styles.error}>✗ {text.trim() ? 'Something went wrong' : 'Please enter some text'}</p>}
    </div>
  )
}
