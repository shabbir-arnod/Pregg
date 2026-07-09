function BabyScreen({ state, setState }) {
  const { Chip, Button, Blob } = window.PreggDesignSystem_bd552d;
  const { getPregnancyWeek, getBabySize, getBabyEmoji, formatDisplayDate } = window.PreggKit;
  const week = getPregnancyWeek();
  const SYMPTOMS = ['Nausea', 'Fatigue', 'Cramping', 'Headache', 'Backache', 'Heartburn'];

  function toggleSymptom(s) {
    setState((st) => ({ ...st, symptoms: st.symptoms.includes(s) ? st.symptoms.filter((x) => x !== s) : [...st.symptoms, s] }));
  }

  function recordKick() {
    setState((st) => ({ ...st, kickCount: st.kickCount + 1, kickActive: true }));
  }

  const sectionStyle = { borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)', background: '#fff', padding: 20 };
  const h2Style = { fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--slate-600)', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 8 };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontFamily: 'var(--font-sans)' }}>
      <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, color: 'var(--text-heading)', margin: 0 }}>Baby</h1>

      <section style={sectionStyle}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 16 }}>
          <Blob size={80}>👶</Blob>
          <Blob size={80} gradient={false}>{getBabyEmoji()}</Blob>
        </div>
        <p style={{ fontSize: 'var(--text-xs)', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)', margin: 0 }}>Week {week} · Trimester 2</p>
        <p style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--text-heading)', margin: '2px 0' }}>Baby is about the size of {getBabySize()}</p>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', margin: 0 }}>112 days to go until your due date</p>
        <div style={{ marginTop: 12, height: 8, borderRadius: '999px', background: 'var(--brand-tint)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(week / 40) * 100}%`, background: 'var(--rose-400)', borderRadius: '999px' }} />
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>📷 Bump photos</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {state.photos.map((p) => (
            <div key={p.id} style={{ aspectRatio: '1', borderRadius: 8, background: 'var(--brand-tint)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--rose-300)', fontSize: 28 }}>
              🤰
              <span style={{ position: 'absolute', bottom: 4, right: 4, fontSize: 10, fontWeight: 500, background: 'rgba(0,0,0,0.5)', color: '#fff', padding: '2px 6px', borderRadius: 4 }}>Week {p.week}</span>
            </div>
          ))}
          <div style={{ aspectRatio: '1', borderRadius: 8, border: '1px dashed var(--border-dashed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 20 }}>+</div>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>🙂 How are you feeling today?</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {SYMPTOMS.map((s) => (
            <Chip key={s} label={s} selected={state.symptoms.includes(s)} onClick={() => toggleSymptom(s)} />
          ))}
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>📈 Kick counter</h2>
        {!state.kickActive ? (
          <>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', margin: '0 0 12px' }}>Start a session, then tap each time baby moves.</p>
            <Button variant="primary" onClick={() => setState((s) => ({ ...s, kickActive: true, kickCount: 0 }))}>Start session</Button>
          </>
        ) : (
          <>
            <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 600, color: 'var(--text-heading)', margin: 0 }}>{state.kickCount} kick{state.kickCount === 1 ? '' : 's'}</p>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <Button variant="primary" size="lg" fullWidth onClick={recordKick}>I felt a kick</Button>
              <Button variant="secondary" onClick={() => setState((s) => ({ ...s, kickActive: false }))}>End</Button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

window.PreggKit.BabyScreen = BabyScreen;
