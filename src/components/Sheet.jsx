import { useEffect, useRef } from 'react';

/** Bottom sheet acessível sobre <dialog> nativo (foco, Esc e backdrop resolvidos pelo navegador). */
export default function Sheet({ open, onClose, labelledBy, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  useEffect(() => {
    const d = ref.current;
    const onCancel = (e) => { e.preventDefault(); onClose(); };
    const onClick = (e) => { if (e.target === d) onClose(); };
    d?.addEventListener('cancel', onCancel);
    d?.addEventListener('click', onClick);
    return () => { d?.removeEventListener('cancel', onCancel); d?.removeEventListener('click', onClick); };
  }, [onClose]);
  return (
    <dialog ref={ref} className="sheet" aria-labelledby={labelledBy}>
      <div className="sheet-inner">
        <div className="grabber" aria-hidden="true" />
        {open && children}
      </div>
    </dialog>
  );
}
