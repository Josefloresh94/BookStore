import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { CategorySelector } from './components/category-selector/category-selector';
import { TitleCasePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { catchError, of } from 'rxjs';
import { BookService } from '../../infrastructure/book-service';
import { HomeBook } from './components/home-book/home-book';
import { Book } from '../../domain/interfaces/book';
import { register } from 'swiper/element/bundle';
import { NewBook } from './components/new-book/new-book';
register();

@Component({
  selector: 'app-home',
  imports: [CategorySelector, TitleCasePipe, HomeBook, NewBook],
  templateUrl: './home.html',
  styleUrl: './home.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
})
export class Home implements OnInit {
  books = signal<Book[]>([]);
  newBooks = signal<Book[]>([]);
  category = signal('');
  private route = inject(ActivatedRoute);
  private bookService = inject(BookService);

  ngOnInit(): void {
    this.bookService.getAllNewBooks().subscribe((books) => {
      this.newBooks.set(books as Book[]);
    });

    this.route.paramMap.subscribe((params) => {
      const category = params.get('category');
      if (category && category !== this.category()) {
        this.category.set(category);

        this.bookService
          .getBooks(category)
          .pipe(
            catchError(() => {
              return of([]);
            }),
          )
          .subscribe((books) => {
            // Ensure the books are of the correct type
            this.books.set(books as Book[]);
          });
      }
    });
  }
}
