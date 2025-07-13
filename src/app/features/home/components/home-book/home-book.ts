import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { RouterLink } from '@angular/router';
import { Book } from '../../../../domain/interfaces/book';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowPointer } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home-book',
  imports: [RouterLink, FontAwesomeModule],
  templateUrl: './home-book.html',
  styleUrl: './home-book.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeBook {
  book = input.required<Book>();

  faArrowPointer = faArrowPointer;
}
