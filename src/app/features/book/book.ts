import { FavoritesService } from './../../infrastructure/favorites-service';
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { BookDetails } from '../../domain/interfaces/book-details';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../../infrastructure/book-service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faStar as faStarSolid,
  faHeart as faHeartSolid,
  faStarHalf,
  faCartShopping,
} from '@fortawesome/free-solid-svg-icons';
import {
  faStar as faStarRegular,
  faHeart as faHeartRegular,
} from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-book',
  imports: [FontAwesomeModule],
  templateUrl: './book.html',
  styleUrl: './book.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Book implements AfterViewInit {
  private favoritesService = inject(FavoritesService);
  book = signal<BookDetails | null>(null);

  // Icons
  faHeartSolid = faHeartSolid;
  faHeartRegular = faHeartRegular;
  faCartShopping = faCartShopping;
  faStarSolid = faStarSolid;
  faStarRegular = faStarRegular;
  faStarHalf = faStarHalf;

  route = inject(ActivatedRoute);
  booksService = inject(BookService);

  // Computed signal para saber si el libro actual está en favoritos
  isCurrentBookFavorite = computed(() => {
    const currentBook = this.book();
    return currentBook
      ? this.favoritesService.isFavorite(currentBook.isbn13)
      : false;
  });

  // Computed signal para el ícono del botón de favoritos
  getFavoriteIcon = computed((): { icon: any; class: string } => {
    const isFavorite = this.isCurrentBookFavorite();
    if (isFavorite) {
      return { icon: this.faHeartSolid, class: 'active' };
    } else {
      return { icon: this.faHeartRegular, class: 'inactive' };
    }
  });

  // Computed signal para la clase CSS del botón de favoritos
  favoriteButtonClass = computed(() =>
    this.isCurrentBookFavorite() ? 'heart active' : 'heart',
  );

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

  getStars(rating: string | number): { icon: any; class: string }[] {
    const value = Number(rating) || 0;
    const maxStars = 5;
    const fullStars = Math.floor(value);
    const hasHalfStar = value % 1 !== 0;
    const stars: { icon: any; class: string }[] = [];

    for (let i = 0; i < maxStars; i++) {
      if (i < fullStars) {
        // Estrella llena
        stars.push({ icon: this.faStarSolid, class: 'filled' });
      } else if (i === fullStars && hasHalfStar) {
        // Media estrella (si el rating es 4.5, 3.7, etc.)
        stars.push({ icon: this.faStarHalf, class: 'half' });
      } else {
        // Estrella vacía
        stars.push({ icon: this.faStarRegular, class: 'empty' });
      }
    }

    return stars;
  }

  // Método para toggle favorito
  onToggleFavorite(): void {
    const currentBook = this.book();
    if (currentBook) {
      this.favoritesService.toggleFavorite(currentBook);
    }
  }
}
