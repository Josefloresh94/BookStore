import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.sass',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Navbar {

}
