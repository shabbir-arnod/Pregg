function RemindersScreen({ state, setState }) {
  const { Button, ListRow, Badge, Modal, Input, DayPill, IconButton } = window.PreggDesignSystem_bd552d;
  const { formatDisplayDate } = window.PreggKit;
  const [modalOpen, setModalOpen] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [time, setTime] = React.useState('09:00');

  function toggleDone(id) {
    setState((s) => ({ ...s, reminders: s.reminders.map((r) => (r.id === id ? { ...r, done: !r.done } : r)) }));
  }

  function addReminder(e) {
    e.preventDefault();
    if (!title.trim()) return;
    setState((s) => ({ ...s, reminders: [...s.reminders, { id: 'r' + Date.now(), title, type: 'medicine', time, days: [], done: false }] }));
    setTitle('');
    setModalOpen(false);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontFamily: 'var(--font-sans)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, color: 'var(--text-heading)', margin: 0 }}>Reminders</h1>
        <Button variant="primary" onClick={() => setModalOpen(true)}>+ Add reminder</Button>
      </div>

      <section>
        <h2 style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--slate-500)', margin: '0 0 8px' }}>Today</h2>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: 0, padding: 0 }}>
          {state.reminders.map((r) => (
            <ListRow
              key={r.id}
              tone={r.done ? 'success' : 'default'}
              leading={
                <button
                  onClick={() => toggleDone(r.id)}
                  style={{
                    width: 28, height: 28, borderRadius: '999px', flexShrink: 0, cursor: 'pointer',
                    border: r.done ? 'none' : '2px solid var(--slate-300)',
                    background: r.done ? 'var(--emerald-500)' : 'transparent', color: '#fff',
                  }}
                >
                  {r.done ? '✓' : ''}
                </button>
              }
              title={r.title}
              subtitle={`${r.time} · ${r.type === 'medicine' ? 'Medicine' : 'Exercise'}`}
              trailing={<Badge tone={r.type === 'medicine' ? 'info' : 'neutral'}>{r.days.length === 0 ? 'Every day' : 'Some days'}</Badge>}
            />
          ))}
        </ul>
      </section>

      {modalOpen && (
        <Modal title="Add reminder" onClose={() => setModalOpen(false)}>
          <form onSubmit={addReminder} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Input placeholder="e.g. Prenatal vitamin" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d, i) => (
                <DayPill key={i} label={d} selected={false} onClick={() => {}} />
              ))}
            </div>
            <Button type="submit" variant="primary" fullWidth>Add reminder</Button>
          </form>
        </Modal>
      )}
    </div>
  );
}

window.PreggKit.RemindersScreen = RemindersScreen;
