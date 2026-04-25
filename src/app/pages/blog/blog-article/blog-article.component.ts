import { DOCUMENT, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, Renderer2, inject, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Article } from '../../../shared/models/article.model';
import { ArticlesPublicApiService } from '../../../shared/services/articles-public-api.service';

@Component({
  selector: 'app-blog-article',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './blog-article.component.html',
  styleUrl: './blog-article.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogArticleComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly renderer = inject(Renderer2);
  private readonly document = inject(DOCUMENT);
  private readonly articlesApi = inject(ArticlesPublicApiService);

  readonly article = signal<Article | null>(null);
  readonly loading = signal(true);

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (!slug) {
      void this.router.navigate(['/blog']);
      return;
    }

    this.articlesApi.getArticleBySlug(slug).subscribe({
      next: article => {
        this.article.set(article);
        this.applySeo(article);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        void this.router.navigate(['/blog']);
      },
    });
  }

  private applySeo(article: Article): void {
    const seoTitle = article.metaTitle || `${article.title} | SOPIKËR`;
    const seoDescription = article.metaDescription || article.excerpt;
    const canonicalUrl = `https://sopikeur.sn/blog/${article.slug}`;

    this.title.setTitle(seoTitle);
    this.meta.updateTag({ name: 'description', content: seoDescription });
    this.meta.updateTag({ property: 'og:title', content: seoTitle });
    this.meta.updateTag({ property: 'og:description', content: seoDescription });
    this.meta.updateTag({ property: 'og:url', content: canonicalUrl });

    if (article.coverUrl) {
      this.meta.updateTag({ property: 'og:image', content: article.coverUrl });
    } else {
      this.meta.removeTag("property='og:image'");
    }

    let canonical = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = this.renderer.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      this.renderer.appendChild(this.document.head, canonical);
    }
    canonical.setAttribute('href', canonicalUrl);
  }
}
