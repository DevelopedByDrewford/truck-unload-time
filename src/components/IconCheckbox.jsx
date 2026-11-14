import { MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md'

function IconCheckbox({ checked, onChange, Icon, label }) {
  const Box = checked ? MdCheckBox : MdCheckBoxOutlineBlank
  return (
    <label className={`icon-check${checked ? ' checked' : ''}`}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      <Box className="box" aria-hidden />
      <Icon aria-hidden />
      <span>{label}</span>
    </label>
  )
}

export default IconCheckbox
