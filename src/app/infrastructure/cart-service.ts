import {
  computed,
  inject,
  Injectable,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { CartProduct } from '../domain/interfaces/cart-product';
import { BookDetails } from '../domain/interfaces/book-details';
import { isPlatformBrowser } from '@angular/common';
import { toast } from 'ngx-sonner';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly CART_KEY = 'cart-products';
  private isBrowser: boolean;
  private platformId = inject<object>(PLATFORM_ID);

  // Signal para almacenar los productos del carrito
  private cartSignal = signal<CartProduct[]>([]);

  // Computed signal para obtener solo los ISBNs de los libros
  booksIds = computed(() =>
    this.cartSignal().map((item) => item.product.isbn13),
  );

  // Computed signal para obtener todos los productos del carrito
  cartProducts = computed(() => this.cartSignal());

  // Computed signal para obtener el count de productos en el carrito
  cartProductsCount = computed(() => this.cartSignal().length);

  // Computed signal para obtener el total de items (considerando cantidades)
  totalItems = computed(() => {
    return this.cartSignal().reduce((total, item) => total + item.quantity, 0);
  });

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);

    // Solo cargar productos si estamos en el browser
    if (this.isBrowser) {
      // Usar setTimeout para asegurar que el DOM esté completamente cargado
      setTimeout(() => {
        const cartProducts = this.loadCartProductsFromStorage();
        this.cartSignal.set(cartProducts);
      });
    }
  }

  /**
   * Verifica si un libro está en el carrito
   */
  isBookInCart(isbn13: string): boolean {
    return this.booksIds().includes(isbn13);
  }

  /**
   * Agrega un libro al carrito
   */
  addToCart(book: BookDetails): void {
    if (!this.isBookInCart(book.isbn13)) {
      const currentCartProducts = this.cartSignal();
      const newCartProduct: CartProduct = { product: book, quantity: 1 };
      const updatedCartList = [...currentCartProducts, newCartProduct];
      this.cartSignal.set(updatedCartList);
      this.saveCartProductsToStorage(updatedCartList);

      toast.success('Libro agregado al carro de compras', {
        description: `"${book.title}" se ha añadido a tu lista de compras`,
      });
    } else {
      // Si ya está en el carrito, incrementar la cantidad
      this.updateQuantity(book.isbn13, 1);
    }
  }

  /**
   * Actualiza la cantidad de un producto en el carrito
   */
  updateQuantity(isbn13: string, change: number): void {
    const currentCartProducts = this.cartSignal();
    const productIndex = currentCartProducts.findIndex(
      (item) => item.product.isbn13 === isbn13,
    );

    if (productIndex !== -1) {
      const updatedCartProducts = [...currentCartProducts];
      const newQuantity = updatedCartProducts[productIndex].quantity + change;

      if (newQuantity <= 0) {
        // Si la cantidad es 0 o menos, remover el producto
        this.removeFromCart(isbn13);
      } else {
        // Actualizar la cantidad
        updatedCartProducts[productIndex] = {
          ...updatedCartProducts[productIndex],
          quantity: newQuantity,
        };
        this.cartSignal.set(updatedCartProducts);
        this.saveCartProductsToStorage(updatedCartProducts);
      }
    }
  }

  /**
   * Remueve un libro del carrito
   */
  removeFromCart(isbn13: string): void {
    const currentCartProducts = this.cartSignal();
    const productToRemove = currentCartProducts.find(
      (item) => item.product.isbn13 === isbn13,
    );
    const updatedCartList = currentCartProducts.filter(
      (item) => item.product.isbn13 !== isbn13,
    );
    this.cartSignal.set(updatedCartList);
    this.saveCartProductsToStorage(updatedCartList);

    // Toast con opción de deshacer
    if (productToRemove) {
      toast.success('Libro eliminado del carrito', {
        description: `"${productToRemove.product.title}" ya no está en tu carrito`,
        action: {
          label: 'Deshacer',
          onClick: () => {
            this.addToCart(productToRemove.product as BookDetails);
          },
        },
      });
    }
  }

  /**
   * Limpia todo el carrito
   */
  clearCart(): void {
    this.cartSignal.set([]);
    this.saveCartProductsToStorage([]);
  }

  /**
   * Carga productos del carrito desde localStorage
   */
  private loadCartProductsFromStorage(): CartProduct[] {
    try {
      const stored = localStorage.getItem(this.CART_KEY);
      if (!stored) return [];

      // Intentar parsear como CartProduct[] primero
      const parsed = JSON.parse(stored);

      // Verificar si los datos tienen el formato esperado de CartProduct
      if (
        Array.isArray(parsed) &&
        parsed.length > 0 &&
        'product' in parsed[0] &&
        'quantity' in parsed[0]
      ) {
        return parsed as CartProduct[];
      }
      // Si son solo BookDetails[], convertirlos a CartProduct[]
      else if (Array.isArray(parsed)) {
        return parsed.map((book) => ({ product: book, quantity: 1 }));
      }

      return [];
    } catch (error) {
      console.error('Error loading cart products from localStorage:', error);
      toast.error('Error al cargar el carrito', {
        description: 'No se pudieron cargar tus libros guardados',
      });
      return [];
    }
  }

  /**
   * Guarda productos del carrito en localStorage
   */
  private saveCartProductsToStorage(cartProducts: CartProduct[]): void {
    try {
      localStorage.setItem(this.CART_KEY, JSON.stringify(cartProducts));
    } catch (error) {
      console.error('Error saving cart products to localStorage:', error);
      toast.error('Error al guardar el carrito', {
        description: 'No se pudieron guardar los cambios en tu carrito',
      });
    }
  }

  /**
   * Calcula el total del carrito
   */
  getCartTotal(): number {
    return this.cartSignal().reduce((total, item) => {
      const priceString = item.product.price;
      const price = parseFloat(priceString.replace('$', '')) || 0;
      return total + price * item.quantity;
    }, 0);
  }
}
