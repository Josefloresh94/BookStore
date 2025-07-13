import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { BookDetails } from '../../domain/interfaces/book-details';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../../infrastructure/book-service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCartShopping, faStar } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-book',
  imports: [FontAwesomeModule],
  templateUrl: './book.html',
  styleUrl: './book.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Book implements AfterViewInit {
  faHeart = faHeart;
  faCartShopping = faCartShopping;
  faStar = faStar;
  book = signal<BookDetails | undefined>(undefined);

  route = inject(ActivatedRoute);
  booksService = inject(BookService);

  ngAfterViewInit() {
    this.route.paramMap.subscribe((params) => {
      const isbn = params.get('isbn');
      if (isbn) {
        this.booksService.getBookDetails(isbn).subscribe((book) => {
          this.book.set(book);
        });
      }
    });
  }

  getStars(rating: string | number): number[] {
    const value = Number(rating) || 0;
    return Array(value).fill(0);
  }
}
