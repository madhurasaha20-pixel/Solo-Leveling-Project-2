import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { authTokenInterceptor } from './interceptors/auth-token.interceptor';
import { mockBackendInterceptor } from './interceptors/mock-backend.interceptor';

/**
 * Add this ONCE to AppModule:
 *
 *   @NgModule({
 *     ...
 *     providers: [provideCore()],
 *   })
 *
 * Order matters: the token is attached first, then the mock backend answers.
 */
export function provideCore(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideHttpClient(withInterceptors([authTokenInterceptor, mockBackendInterceptor]))
  ]);
}
