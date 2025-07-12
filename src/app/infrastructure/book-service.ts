import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Book } from '../features/book/book';
import { catchError, map, of } from 'rxjs';
import { BookDetails } from '../domain/interfaces/book-details';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private http = inject(HttpClient);
  private apiUrl = environment.API_URL;

  getBooks(category: string) {
    return this.http
      .get<{ books: Book[] }>(`${this.apiUrl}/search/${category}`)
      .pipe(map((response) => response.books));
  }

  getAllNewBooks() {
    return this.http.get<{ books: Book[] }>(`${this.apiUrl}/new`).pipe(
      map((response) => response.books),
      catchError((error) => {
        console.error('Error fetching books:', error);
        return of([]);
      }),
    );
  }

  getBookDetails(isbn: string) {
    return this.http.get<BookDetails>(`${this.apiUrl}/books/${isbn}`);
  }
}
