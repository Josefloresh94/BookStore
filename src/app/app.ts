import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './common/components/navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.sass',
})
export class App {}
