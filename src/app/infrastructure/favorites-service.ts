import { BookDetails } from './../domain/interfaces/book-details';
import {
  computed,
  Injectable,
  signal,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private readonly STORAGE_KEY = 'itbook-favorites';
  private isBrowser: boolean;
  private platformId = inject<object>(PLATFORM_ID);

  // Signal para almacenar los favoritos
  private favoritesSignal = signal<BookDetails[]>([]);

  // Computed signal para obtener solo los ISBNs de los favoritos
  favoriteIds = computed(() =>
    this.favoritesSignal().map((book) => book.isbn13),
  );

  // Computed signal para obtener todos los libros favoritos
  favorites = computed(() => this.favoritesSignal());

  // Computed signal para obtener el count de favoritos
  favoritesCount = computed(() => this.favoritesSignal().length);

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);

    // Solo cargar favoritos si estamos en el browser
    if (this.isBrowser) {
      // Usar setTimeout para asegurar que el DOM esté completamente cargado
      setTimeout(() => {
        const favorites = this.loadFavoritesFromStorage();
        this.favoritesSignal.set(favorites);
      });
    }
  }

  /**
   * Verifica si un libro está en favoritos
   */
  isFavorite(isbn13: string): boolean {
    return this.favoriteIds().includes(isbn13);
  }

  /**
   * Agrega un libro a favoritos
   */
  addToFavorites(book: BookDetails): void {
    if (!this.isFavorite(book.isbn13)) {
      const currentFavorites = this.favoritesSignal();
      const updatedFavorites = [...currentFavorites, book];
      this.favoritesSignal.set(updatedFavorites);
      this.saveFavoritesToStorage(updatedFavorites);
    }
  }

  /**
   * Remueve un libro de favoritos
   */
  removeFromFavorites(isbn13: string): void {
    const currentFavorites = this.favoritesSignal();
    const updatedFavorites = currentFavorites.filter(
      (book) => book.isbn13 !== isbn13,
    );
    this.favoritesSignal.set(updatedFavorites);
    this.saveFavoritesToStorage(updatedFavorites);
  }

  /**
   * Toggle de favorito (agregar/quitar)
   */
  toggleFavorite(book: BookDetails): void {
    if (this.isFavorite(book.isbn13)) {
      this.removeFromFavorites(book.isbn13);
    } else {
      this.addToFavorites(book);
    }
  }

  /**
   * Limpia todos los favoritos
   */
  clearFavorites(): void {
    this.favoritesSignal.set([]);
    this.saveFavoritesToStorage([]);
  }

  /**
   * Carga favoritos del localStorage
   */
  private loadFavoritesFromStorage(): BookDetails[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error);
      return [];
    }
  }

  /**
   * Guarda favoritos en localStorage
   */
  private saveFavoritesToStorage(favorites: BookDetails[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error);
    }
  }
}
