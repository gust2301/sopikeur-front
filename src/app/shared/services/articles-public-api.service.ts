import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Article, ArticleListItem } from '../models/article.model';
import { apiUrl } from '../utils/api-url';

@Injectable({ providedIn: 'root' })
export class ArticlesPublicApiService {
  private readonly baseUrl = apiUrl('/articles');

  constructor(private readonly http: HttpClient) {}

  getArticles(): Observable<ArticleListItem[]> {
    return this.http.get<ArticleListItem[]>(this.baseUrl);
  }

  getArticleBySlug(slug: string): Observable<Article> {
    return this.http.get<Article>(`${this.baseUrl}/${encodeURIComponent(slug)}`);
  }
}
