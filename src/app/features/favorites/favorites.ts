import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { FavoritesService } from '../../infrastructure/favorites-service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faShoppingCart,
  faTrash,
  faHeart,
  faHeartCrack,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-favorites',
  imports: [FontAwesomeModule],
  templateUrl: './favorites.html',
  styleUrl: './favorites.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Favorites {
  private favoritesService = inject(FavoritesService);

  // Icons
  faHeartCrack = faHeartCrack;
  faHeart = faHeart;
  faTrash = faTrash;
  faCartShopping = faShoppingCart;

  // Computed signals para acceder a los favoritos
  favorites = computed(() => this.favoritesService.favorites());
  favoritesCount = computed(() => this.favoritesService.favoritesCount());
  hasFavorites = computed(() => this.favoritesCount() > 0);

  // Método para remover un libro específico de favoritos
  removeFromFavorites(isbn13: string): void {
    this.favoritesService.removeFromFavorites(isbn13);
  }

  // Método para limpiar todos los favoritos
  clearAllFavorites(): void {
    if (confirm('¿Estás seguro de que quieres eliminar todos los favoritos?')) {
      this.favoritesService.clearFavorites();
    }
  }
}
