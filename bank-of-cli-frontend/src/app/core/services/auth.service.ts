import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Mocked login - returns success or error-shaped responses matching contracts
  login(email: string, password: string) {
    if (email === 'user@example.com' && password === 'password') {
      return Promise.resolve({ success: true, token: 'mock-token', user: { id: 'u1', name: 'Demo User', email } });
    }
    return Promise.resolve({ success: false, error: 'Invalid credentials' });
  }
}
