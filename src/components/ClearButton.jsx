import { MdRefresh } from 'react-icons/md'
import { useI18n } from '../lang'
import { trackEvent } from '../analytics'

// Resets the current page's inputs (current time, no boxes, 1 person, nothing checked).
function ClearButton({ onClear }) {
  const { t } = useI18n()
  return (
    <div className="clear-row">
      <button type="button" className="clear-btn" onClick={() => { trackEvent('clear_page'); onClear() }}>
        <MdRefresh aria-hidden />
        <span>{t('clear')}</span>
      </button>
    </div>
  )
}

export default ClearButton
