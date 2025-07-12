import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Book } from '../../../../domain/interfaces/book';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-new-book',
  imports: [RouterLink, FontAwesomeModule],
  templateUrl: './new-book.html',
  styleUrl: './new-book.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewBook {
  book = input.required<Book>();
  faArrowRight = faArrowRight;
}
