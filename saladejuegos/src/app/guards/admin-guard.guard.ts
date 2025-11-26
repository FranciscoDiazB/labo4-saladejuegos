import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

export const adminGuardGuard: CanActivateFn = async (route, state) => {

  const supabase = inject(SupabaseService);
  const router = inject(Router);

  // 1) Traer user logueado
  const user = await supabase.getUser(); 
  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  // 2) Ver si es admin
  const isAdmin = await supabase.isAdmin();
  if (!isAdmin) {
    router.navigate(['/no-autorizado']); // o página de error
    return false;
  }

  return true;
};
