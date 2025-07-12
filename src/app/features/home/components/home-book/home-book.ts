import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { RouterLink } from '@angular/router';
import { Book } from '../../../../domain/interfaces/book';

@Component({
  selector: 'app-home-book',
  imports: [RouterLink],
  templateUrl: './home-book.html',
  styleUrl: './home-book.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeBook {
  book = input.required<Book>();
}
