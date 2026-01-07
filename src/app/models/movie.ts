export interface MovieSummary {
  id: number;
  title: string;
  posterPath: string | null;
  releaseDate: string | null;
  voteAverage: number;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profilePath: string | null;
}

export interface MovieDetails extends MovieSummary {
  overview: string;
  genres: string[];
  runtime: number | null;
  cast: CastMember[];
  recommendations: MovieSummary[];
}

export interface SearchResult {
  page: number;
  totalResults: number;
  totalPages: number;
  results: MovieSummary[];
}

export interface TmdbMovieSummaryDto {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string | null;
  vote_average: number;
}

export interface TmdbMovieDetailsDto extends TmdbMovieSummaryDto {
  overview: string;
  genres: Array<{ id: number; name: string }>;
  runtime: number | null;
  credits: {
    cast: Array<{
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }>;
  };
  recommendations: {
    results: TmdbMovieSummaryDto[];
  };
}

export interface TmdbSearchResponseDto {
  page: number;
  total_results: number;
  total_pages: number;
  results: TmdbMovieSummaryDto[];
}
