import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [
    CdkMenu,
    CdkMenuItem,
    CdkMenuTrigger,
    FontAwesomeModule,
    RouterLink,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navbar {
  faBars = faBars;
}
