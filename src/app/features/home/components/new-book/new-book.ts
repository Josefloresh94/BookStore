import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-new-book',
  imports: [],
  templateUrl: './new-book.html',
  styleUrl: './new-book.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewBook {}
