import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom, forkJoin, map } from 'rxjs';
import { APP_CONFIG } from './app-config';
import {
  MovieDetails,
  MovieSummary,
  SearchResult,
  TmdbMovieDetailsDto,
  TmdbMovieSummaryDto,
  TmdbSearchResponseDto
} from '../models/movie';

@Injectable({ providedIn: 'root' })
export class MovieApiService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(APP_CONFIG);

  async searchMovies(
    query: string,
    year: number | null,
    minRating: number | null,
    page: number
  ): Promise<SearchResult> {
    const response = await firstValueFrom(
      this.getSearchResponse(query, year, page).pipe(
        map((data) => {
          let results = data.results;

          if (this.config.useMock) {
            const normalizedQuery = query.trim().toLowerCase();
            results = results.filter((movie) =>
              movie.title.toLowerCase().includes(normalizedQuery)
            );
            if (year) {
              results = results.filter((movie) =>
                movie.release_date?.startsWith(year.toString())
              );
            }
          }

          if (minRating) {
            results = results.filter((movie) => movie.vote_average >= minRating);
          }

          return { ...data, results };
        })
      )
    );

    return {
      page: response.page,
      totalResults: response.total_results,
      totalPages: response.total_pages,
      results: response.results.map(this.mapSummary)
    };
  }

  async getMovieDetails(id: number): Promise<MovieDetails> {
    const response = await firstValueFrom(this.getDetailsResponse(id));
    return this.mapDetails(response);
  }

  private getSearchResponse(query: string, year: number | null, page: number) {
    if (this.config.useMock) {
      return this.http.get<TmdbSearchResponseDto>('/mock/search.json');
    }

    let params = new HttpParams()
      .set('query', query)
      .set('include_adult', 'false')
      .set('page', page.toString());

    if (year) {
      params = params.set('year', year.toString());
    }

    return this.http.get<TmdbSearchResponseDto>(`${this.config.apiBase}/search/movie`, {
      params
    });
  }

  private getDetailsResponse(id: number) {
    if (this.config.useMock) {
      return forkJoin({
        details: this.http.get<TmdbMovieDetailsDto>('/mock/details.json'),
        search: this.http.get<TmdbSearchResponseDto>('/mock/search.json')
      }).pipe(
        map(({ details, search }) => {
          const match = search.results.find((movie) => movie.id === id);
          return {
            ...details,
            id,
            title: match?.title ?? details.title,
            poster_path: match?.poster_path ?? details.poster_path,
            release_date: match?.release_date ?? details.release_date,
            vote_average: match?.vote_average ?? details.vote_average
          };
        })
      );
    }

    return this.http.get<TmdbMovieDetailsDto>(`${this.config.apiBase}/movie/${id}`, {
      params: new HttpParams().set('append_to_response', 'credits,recommendations')
    });
  }

  private mapSummary(movie: TmdbMovieSummaryDto): MovieSummary {
    return {
      id: movie.id,
      title: movie.title,
      posterPath: movie.poster_path,
      releaseDate: movie.release_date,
      voteAverage: movie.vote_average
    };
  }

  private mapDetails(movie: TmdbMovieDetailsDto): MovieDetails {
    return {
      ...this.mapSummary(movie),
      overview: movie.overview,
      genres: movie.genres.map((genre) => genre.name),
      runtime: movie.runtime,
      cast: movie.credits.cast.slice(0, 5).map((member) => ({
        id: member.id,
        name: member.name,
        character: member.character,
        profilePath: member.profile_path
      })),
      recommendations: movie.recommendations.results.map(this.mapSummary)
    };
  }
}
