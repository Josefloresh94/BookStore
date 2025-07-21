import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { CartService } from '../../infrastructure/cart-service';
import { toast } from 'ngx-sonner';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faMinus,
  faPlus,
  faTrash,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { CurrencyPipe } from '@angular/common';
import { CartProduct } from '../../domain/interfaces/cart-product';

@Component({
  selector: 'app-cart',
  imports: [FontAwesomeModule, CurrencyPipe],
  templateUrl: './cart.html',
  styleUrl: './cart.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Cart {
  private cartService = inject(CartService);

  faPlus = faPlus;
  faMinus = faMinus;
  faTrash = faTrash;
  faArrowRight = faArrowRight;

  // Computed signals para acceder a los productos del carrito
  cartProducts = computed(() => this.cartService.cartProducts());
  cartProductsCount = computed(() => this.cartService.cartProductsCount());
  hasCartProducts = computed(() => this.cartProductsCount() > 0);
  cartTotal = computed(() => this.cartService.getCartTotal());

  // Método para limpiar todo el carrito
  clearCart(): void {
    toast('¿Estás seguro de que quieres eliminar todos los libros?', {
      description: 'Esta acción no se puede deshacer',
      action: {
        label: 'Eliminar',
        onClick: () => {
          this.cartService.clearCart();
          toast.success('Todos los libros han sido eliminados');
        },
      },
      cancel: {
        label: 'Cancelar',
        onClick: () => {
          toast.info('Operación cancelada');
        },
      },
    });
  }

  // Método para remover un libro específico del carrito
  removeFromCart(isbn13: string): void {
    this.cartService.removeFromCart(isbn13);
  }

  // Actualizar la cantidad de un producto
  updateQuantity(isbn13: string, change: number): void {
    this.cartService.updateQuantity(isbn13, change);
  }

  // Calcular el total para un producto específico
  getProductTotal(cartProduct: CartProduct): number {
    const priceString = cartProduct.product.price;
    const price = parseFloat(priceString.replace('$', '')) || 0;
    return price * cartProduct.quantity;
  }
}
