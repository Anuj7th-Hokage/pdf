import { useState, useRef } from 'react'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import styles from './Converter.module.css'

const SAMPLE = `<div style="font-family: Georgia, serif; padding: 24px; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #0000ff; font-size: 28px; margin-bottom: 8px;">Invoice #0042</h1>
  <p style="color: #888; font-size: 14px; margin-bottom: 32px;">April 17, 2026</p>

  <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
    <thead>
      <tr style="background: #f0f0f0;">
        <th style="text-align: left; padding: 10px 12px; font-size: 13px;">Item</th>
        <th style="text-align: right; padding: 10px 12px; font-size: 13px;">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr><td style="padding: 10px 12px; border-bottom: 1px solid #eee;">Web Design</td><td style="padding: 10px 12px; border-bottom: 1px solid #eee; text-align: right;">$1,200</td></tr>
      <tr><td style="padding: 10px 12px; border-bottom: 1px solid #eee;">Development</td><td style="padding: 10px 12px; border-bottom: 1px solid #eee; text-align: right;">$2,400</td></tr>
      <tr><td style="padding: 10px 12px; font-weight: bold;">Total</td><td style="padding: 10px 12px; font-weight: bold; text-align: right;">$3,600</td></tr>
    </tbody>
  </table>

  <p style="font-size: 13px; color: #666;">Thank you for your business!</p>
</div>`

export default function HtmlToPDF() {
  const [html, setHtml] = useState(SAMPLE)
  const [scale, setScale] = useState(2)
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const previewRef = useRef(null)

  const generate = async () => {
    if (!html.trim()) {
      setStatus('error')
      setTimeout(() => setStatus(null), 2000)
      return
    }

    setLoading(true)
    try {
      const container = document.createElement('div')
      container.style.cssText = 'position:fixed;left:-9999px;top:0;background:#fff;width:794px;'
      container.innerHTML = html
      document.body.appendChild(container)

      await new Promise(r => setTimeout(r, 100)) // let render settle

      const canvas = await html2canvas(container, { scale, useCORS: true, backgroundColor: '#ffffff' })
      document.body.removeChild(container)

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' })
      const pdfW = pdf.internal.pageSize.getWidth()
      const pdfH = (canvas.height * pdfW) / canvas.width

      pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH)
      pdf.save('html-export.pdf')
      setStatus('success')
      setTimeout(() => setStatus(null), 2500)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus(null), 2000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.converter}>
      <div className={styles.splitPane}>
        <div className={styles.splitLeft}>
          <div className={styles.field}>
            <label className={styles.label}>HTML Input</label>
            <textarea
              className={`${styles.textarea} ${styles.codeInput}`}
              value={html}
              onChange={e => setHtml(e.target.value)}
              rows={16}
              spellCheck={false}
            />
          </div>
        </div>
        <div className={styles.splitRight}>
          <label className={styles.label}>Preview</label>
          <div
            ref={previewRef}
            className={styles.htmlPreview}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>

      <div className={styles.options}>
        <div className={styles.field}>
          <label className={styles.label}>Render Scale</label>
          <select className={styles.select} value={scale} onChange={e => setScale(Number(e.target.value))}>
            <option value={1}>1x (draft)</option>
            <option value={2}>2x (standard)</option>
            <option value={3}>3x (high quality)</option>
          </select>
        </div>
        <div className={styles.field} style={{ alignSelf: 'flex-end' }}>
          <p className={styles.hint}>Rendered as image snapshot</p>
        </div>
      </div>

      <button className={styles.btn} onClick={generate} disabled={loading}>
        {loading ? 'Rendering...' : 'Generate PDF'}
        <span className={styles.btnArrow}>↓</span>
      </button>

      {status === 'success' && <p className={styles.success}>✓ PDF downloaded</p>}
      {status === 'error' && <p className={styles.error}>✗ {html.trim() ? 'Render failed' : 'Add some HTML'}</p>}
    </div>
  )
}
