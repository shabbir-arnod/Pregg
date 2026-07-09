function AuthScreen({ onSignIn }) {
  const { Button, Input, SegmentedControl, Blob } = window.PreggDesignSystem_bd552d;
  const [mode, setMode] = React.useState('signIn');

  return (
    <div style={{ minHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-app)', padding: '40px 16px', fontFamily: 'var(--font-sans)' }}>
      <div style={{ width: '100%', maxWidth: 360 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Blob size={56} style={{ margin: '0 auto 12px' }}>🌸</Blob>
          <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, color: 'var(--text-heading)', margin: 0 }}>Pregg</h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', margin: '4px 0 0' }}>Your pregnancy, tracked and always with you.</p>
        </div>

        <SegmentedControl
          options={[{ value: 'signIn', label: 'Sign in' }, { value: 'signUp', label: 'Create account' }]}
          value={mode}
          onChange={setMode}
          style={{ marginBottom: 20 }}
        />

        {mode === 'signIn' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Input type="email" placeholder="Email" />
            <Input type="password" placeholder="Password" />
            <Button variant="primary" fullWidth onClick={onSignIn}>Sign in</Button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Input type="text" placeholder="First name" />
              <Input type="text" placeholder="Last name" />
            </div>
            <Input type="email" placeholder="Email" />
            <Input type="password" placeholder="Password (min 6 characters)" />
            <Input type="tel" placeholder="Contact number (optional)" />
            <Input type="text" placeholder="Address (optional)" />
            <Button variant="primary" fullWidth onClick={onSignIn}>Create account</Button>
          </div>
        )}
      </div>
    </div>
  );
}

window.PreggKit.AuthScreen = AuthScreen;
