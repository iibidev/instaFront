import { CanActivateFn, Router } from '@angular/router';

export const movilGuard: CanActivateFn = (route, state) => {
  const router = new Router();

  if(document.querySelector("body")!.clientWidth < 600){
    return true;
  }else{
    router.navigate(["explorar"]);
    return false;
  }
};

