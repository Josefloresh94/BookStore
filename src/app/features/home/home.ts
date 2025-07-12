import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { CategorySelector } from './components/category-selector/category-selector';
import { isPlatformBrowser, TitleCasePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { catchError, of } from 'rxjs';
import { BookService } from '../../infrastructure/book-service';
import { HomeBook } from './components/home-book/home-book';
import { Book } from '../../domain/interfaces/book';

@Component({
  selector: 'app-home',
  imports: [CategorySelector, TitleCasePipe, HomeBook],
  templateUrl: './home.html',
  styleUrl: './home.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home implements OnInit {
  books = signal<Book[]>([]);
  category = signal('');
  currentBookIndex = signal(0);
  loading = signal(false);
  isBrowser: boolean;
  private route = inject(ActivatedRoute);
  private bookService = inject(BookService);
  private platformId = inject(PLATFORM_ID);

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const category = params.get('category');
      if (category && category !== this.category()) {
        this.loading.set(true);
        this.category.set(category);
        this.currentBookIndex.set(0);

        this.bookService
          .getBooks(category)
          .pipe(
            catchError(() => {
              this.loading.set(false);
              return of([]);
            }),
          )
          .subscribe((books) => {
            // Ensure the books are of the correct type
            this.books.set(books as Book[]);
            this.loading.set(false);
          });
      }
    });
  }
}
