import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './common/components/navbar/navbar';
import { NgxSonnerToaster } from 'ngx-sonner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, NgxSonnerToaster],
  templateUrl: './app.html',
  styleUrl: './app.sass',
})
export class App {}
