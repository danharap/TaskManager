import { Component } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-animations',
  templateUrl: './animations.component.html',
  styleUrls: ['./animations.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [ style({ opacity: 0 }), animate('600ms', style({ opacity: 1 })) ]),
      transition(':leave', [ animate('600ms', style({ opacity: 0 })) ])
    ]),
    trigger('slideInOut', [
      transition(':enter', [ style({ transform: 'translateX(-100%)' }), animate('500ms ease-out', style({ transform: 'translateX(0)' })) ]),
      transition(':leave', [ animate('500ms ease-in', style({ transform: 'translateX(100%)' })) ])
    ]),
    trigger('scaleInOut', [
      transition(':enter', [ style({ transform: 'scale(0.5)', opacity: 0 }), animate('400ms', style({ transform: 'scale(1)', opacity: 1 })) ]),
      transition(':leave', [ animate('400ms', style({ transform: 'scale(0.5)', opacity: 0 })) ])
    ]),
    trigger('rotateInOut', [
      transition(':enter', [ style({ transform: 'rotate(-180deg)', opacity: 0 }), animate('600ms', style({ transform: 'rotate(0)', opacity: 1 })) ]),
      transition(':leave', [ animate('600ms', style({ transform: 'rotate(180deg)', opacity: 0 })) ])
    ])
  ]
})
export class AnimationsComponent {
  showFade = true;
  showSlide = true;
  showScale = true;
  showRotate = true;
}