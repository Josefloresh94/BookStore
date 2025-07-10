import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-book',
  imports: [],
  templateUrl: './book.html',
  styleUrl: './book.sass',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Book {

}
