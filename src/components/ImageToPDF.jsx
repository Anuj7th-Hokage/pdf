import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { jsPDF } from 'jspdf'
import styles from './Converter.module.css'

export default function ImageToPDF() {
  const [images, setImages] = useState([])
  const [fit, setFit] = useState('contain') // 'contain' | 'fill'
  const [status, setStatus] = useState(null)

  const onDrop = useCallback(accepted => {
    const newImgs = accepted
      .filter(f => f.type.startsWith('image/'))
      .map(f => ({
        file: f,
        url: URL.createObjectURL(f),
        name: f.name,
      }))
    setImages(prev => [...prev, ...newImgs])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: true,
  })

  const remove = (index) => {
    setImages(prev => {
      URL.revokeObjectURL(prev[index].url)
      return prev.filter((_, i) => i !== index)
    })
  }

  const generate = async () => {
    if (!images.length) {
      setStatus('error')
      setTimeout(() => setStatus(null), 2000)
      return
    }

    try {
      const doc = new jsPDF({ orientation: 'portrait' })
      let first = true

      for (const img of images) {
        const dataUrl = await toDataUrl(img.file)
        const { width: imgW, height: imgH } = await getImgSize(dataUrl)
        const ratio = imgW / imgH

        const pageW = doc.internal.pageSize.getWidth()
        const pageH = doc.internal.pageSize.getHeight()

        let drawW, drawH, x, y

        if (fit === 'fill') {
          drawW = pageW
          drawH = pageH
          x = 0
          y = 0
        } else {
          if (ratio > pageW / pageH) {
            drawW = pageW
            drawH = pageW / ratio
          } else {
            drawH = pageH
            drawW = pageH * ratio
          }
          x = (pageW - drawW) / 2
          y = (pageH - drawH) / 2
        }

        if (!first) doc.addPage()
        doc.addImage(dataUrl, 'JPEG', x, y, drawW, drawH)
        first = false
      }

      doc.save('images.pdf')
      setStatus('success')
      setTimeout(() => setStatus(null), 2500)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus(null), 2000)
    }
  }

  return (
    <div className={styles.converter}>
      <div
        {...getRootProps()}
        className={`${styles.dropzone} ${isDragActive ? styles.dropzoneActive : ''}`}
      >
        <input {...getInputProps()} />
        <span className={styles.dropIcon}>⊕</span>
        <p className={styles.dropText}>
          {isDragActive ? 'Drop images here' : 'Drag & drop images, or click to browse'}
        </p>
        <p className={styles.dropHint}>PNG, JPG, WEBP supported · Multiple files OK</p>
      </div>

      {images.length > 0 && (
        <div className={styles.imageList}>
          {images.map((img, i) => (
            <div key={i} className={styles.imageItem}>
              <img src={img.url} alt={img.name} className={styles.thumb} />
              <span className={styles.imageName}>{img.name}</span>
              <button className={styles.removeBtn} onClick={() => remove(i)}>✕</button>
            </div>
          ))}
        </div>
      )}

      <div className={styles.options}>
        <div className={styles.field}>
          <label className={styles.label}>Image Fit</label>
          <select className={styles.select} value={fit} onChange={e => setFit(e.target.value)}>
            <option value="contain">Contain (letterbox)</option>
            <option value="fill">Fill page</option>
          </select>
        </div>
        <div className={styles.field} style={{ alignSelf: 'flex-end' }}>
          <p className={styles.hint}>{images.length} image{images.length !== 1 ? 's' : ''} · {images.length} page{images.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <button className={styles.btn} onClick={generate}>
        Generate PDF
        <span className={styles.btnArrow}>↓</span>
      </button>

      {status === 'success' && <p className={styles.success}>✓ PDF downloaded</p>}
      {status === 'error' && <p className={styles.error}>✗ {images.length ? 'Something went wrong' : 'Add at least one image'}</p>}
    </div>
  )
}

function toDataUrl(file) {
  return new Promise((res, rej) => {
    const r = new FileReader()
    r.onload = () => res(r.result)
    r.onerror = rej
    r.readAsDataURL(file)
  })
}

function getImgSize(dataUrl) {
  return new Promise((res) => {
    const img = new Image()
    img.onload = () => res({ width: img.width, height: img.height })
    img.src = dataUrl
  })
}
