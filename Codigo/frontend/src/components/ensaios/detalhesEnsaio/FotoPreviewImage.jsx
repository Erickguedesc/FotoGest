import { useEffect, useState } from 'react'

const RETRY_DELAYS = [1200, 2500, 5000, 10000]

function getPreviewUrl(url, width = 720) {
  if (!url || !url.includes('/image/upload/')) return url || ''

  return url.replace(
    '/image/upload/',
    `/image/upload/f_auto,q_auto,w_${width},c_limit/`,
  )
}

function addRetryParam(url, attempt) {
  if (!url) return ''
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}fgPreviewRetry=${attempt}`
}

export default function FotoPreviewImage({
  foto,
  alt,
  className = 'h-40 w-full object-cover',
}) {
  const watermarkUrl = foto?.urlWatermark || ''
  const originalUrl = foto?.urlOriginal || ''
  const previewWatermarkUrl = getPreviewUrl(watermarkUrl)
  const previewOriginalUrl = getPreviewUrl(originalUrl)
  const initialUrl = previewWatermarkUrl || previewOriginalUrl
  const [src, setSrc] = useState(initialUrl)
  const [failed, setFailed] = useState(!initialUrl)

  useEffect(() => {
    const nextUrl = previewWatermarkUrl || previewOriginalUrl
    setSrc(nextUrl)
    setFailed(!nextUrl)
  }, [previewWatermarkUrl, previewOriginalUrl])

  useEffect(() => {
    if (!previewWatermarkUrl || !previewOriginalUrl || src !== previewOriginalUrl) return undefined

    let cancelled = false
    let timeoutId
    let attempt = 0

    const tryWatermarkPreview = () => {
      if (attempt >= RETRY_DELAYS.length) return

      timeoutId = window.setTimeout(() => {
        const retryUrl = addRetryParam(previewWatermarkUrl, attempt + 1)
        const image = new Image()

        image.onload = () => {
          if (cancelled) return
          setSrc(retryUrl)
          setFailed(false)
        }

        image.onerror = () => {
          attempt += 1
          if (!cancelled) tryWatermarkPreview()
        }

        image.src = retryUrl
      }, RETRY_DELAYS[attempt])
    }

    tryWatermarkPreview()

    return () => {
      cancelled = true
      window.clearTimeout(timeoutId)
    }
  }, [previewWatermarkUrl, previewOriginalUrl, src])

  const handleError = () => {
    if (src !== previewOriginalUrl && previewOriginalUrl) {
      setSrc(previewOriginalUrl)
      setFailed(false)
      return
    }

    setFailed(true)
  }

  if (failed) {
    return (
      <div className={`${className} flex items-center justify-center bg-black/30 px-4 text-center text-[11px] uppercase tracking-[0.12em] text-white/30`}>
        Prévia indisponível
      </div>
    )
  }

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={className}
        loading="lazy"
        decoding="async"
        onError={handleError}
      />
    </>
  )
}
