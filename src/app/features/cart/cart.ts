import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-cart',
  imports: [],
  templateUrl: './cart.html',
  styleUrl: './cart.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Cart {}
