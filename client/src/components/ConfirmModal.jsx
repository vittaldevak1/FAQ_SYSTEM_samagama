export default function ConfirmModal({ open, title, message, confirmLabel, cancelLabel, variant, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div onClick={onCancel} style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--bg-card)', borderRadius: 'var(--radius-md)',
        padding: 28, width: 420, maxWidth: '90vw',
        boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
        display: 'flex', flexDirection: 'column', gap: 16,
      }}>
        {title && <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>{title}</h3>}
        <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{message}</div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
          <button onClick={onCancel} style={{
            padding: '9px 20px', borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border)', background: 'transparent',
            color: 'var(--text-secondary)', fontSize: 14, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>{cancelLabel || 'Cancel'}</button>
          <button onClick={onConfirm} style={{
            padding: '9px 20px', borderRadius: 'var(--radius-sm)', border: 'none',
            background: variant === 'danger' ? '#ef4444' : 'var(--accent)',
            color: '#fff', fontSize: 14, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>{confirmLabel || 'Confirm'}</button>
        </div>
      </div>
    </div>
  );
}
