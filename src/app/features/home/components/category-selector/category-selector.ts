import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-category-selector',
  imports: [RouterLink, TitleCasePipe],
  templateUrl: './category-selector.html',
  styleUrl: './category-selector.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategorySelector {
  categories = signal([
    'new',
    'angular',
    'javascript',
    'python',
    'java',
    'react',
    'nodejs',
    'typescript',
  ]);
}
