export type DemoRole = 'admin' | 'user';

export const demoCredentials: Record<DemoRole, { email: string; password: string }> = {
  admin: {
    email: 'admin@museu.test',
    password: 'Admin123',
  },
  user: {
    email: 'visitante@museu.test',
    password: 'Usuario123',
  },
};

export function getDemoRole(email: string, password: string): DemoRole | null {
  const normalizedEmail = email.trim().toLowerCase();
  const role = (Object.keys(demoCredentials) as DemoRole[]).find((candidate) => {
    const credential = demoCredentials[candidate];
    return credential.email === normalizedEmail && credential.password === password;
  });

  return role ?? null;
}

export function createDemoSession(role: DemoRole, email: string) {
  document.cookie = `museu_demo_role=${role}; path=/; max-age=86400; samesite=lax`;
  window.localStorage.setItem(
    'museu_demo_session',
    JSON.stringify({ email, role, createdAt: new Date().toISOString() }),
  );
}