import { createAnimation } from '@ionic/angular/standalone';

export function slideAnimation(direction: 'forward' | 'back') {
  return (baseEl: HTMLElement, opts: any) => {
    const enteringEl = opts.enteringEl;
    const leavingEl = opts.leavingEl;

    enteringEl.classList.remove('ion-page-invisible');

    const enterFrom = direction === 'forward' ? '100%' : '-100%';
    const leaveTo = direction === 'forward' ? '-100%' : '100%';

    const enteringAnimation = createAnimation()
      .addElement(enteringEl)
      .fromTo('transform', `translateX(${enterFrom})`, 'translateX(0)')
      .duration(200)
      .easing('ease-out');

    const leavingAnimation = createAnimation()
      .addElement(leavingEl)
      .fromTo('transform', 'translateX(0)', `translateX(${leaveTo})`)
      .duration(200)
      .easing('ease-out');

    return createAnimation()
      .addAnimation([enteringAnimation, leavingAnimation]);
  };
}
