import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ArticlesPublicApiService } from '../../../shared/services/articles-public-api.service';
import { ArticleListItem } from '../../../shared/models/article.model';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './blog-list.component.html',
  styleUrl: './blog-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogListComponent implements OnInit {
  private readonly articlesApi = inject(ArticlesPublicApiService);

  readonly articles = signal<ArticleListItem[]>([]);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.articlesApi.getArticles().subscribe({
      next: articles => {
        this.articles.set(articles);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
