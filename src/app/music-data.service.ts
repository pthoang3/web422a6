import { HttpParams, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { SpotifyTokenService } from './spotify-token.service';

import { mergeMap } from 'rxjs/operators';
import { environment } from './../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MusicDataService {

  constructor(private spotifyToken: SpotifyTokenService, private http: HttpClient) { }  

  getNewReleases(): Observable<SpotifyApi.ListOfNewReleasesResponse> {
      return this.spotifyToken.getBearerToken().pipe(mergeMap(token=>{
        return this.http.get<any>("https://api.spotify.com/v1/browse/new-releases", { headers: { "Authorization": `Bearer ${token}` } });
      }));
  }
  getArtistById(id): Observable<SpotifyApi.SingleArtistResponse> {    
    return this.spotifyToken.getBearerToken().pipe(mergeMap(token=>{
      return this.http.get<any>(`https://api.spotify.com/v1/artists/${id}`, { headers: { "Authorization": `Bearer ${token}` } });
    }));
}
  getAlbumsByArtistId(id): Observable<SpotifyApi.ArtistsAlbumsResponse> {
    const params = new HttpParams()
    .set('include_groups', "album,single")
    .set('limit', "50");
    return this.spotifyToken.getBearerToken().pipe(mergeMap(token=>{
      return this.http.get<any>(`https://api.spotify.com/v1/artists/${id}/albums`, { headers: { "Authorization": `Bearer ${token}`}, params: params});
    }));
  }
  getAlbumById(id): Observable<SpotifyApi.SingleAlbumResponse> {
    return this.spotifyToken.getBearerToken().pipe(mergeMap(token=>{
      return this.http.get<any>(`https://api.spotify.com/v1/albums/${id}`, { headers: { "Authorization": `Bearer ${token}` }});
    }));
  }
  searchArtists(searchString): Observable<SpotifyApi.ArtistSearchResponse> {
    const params = new HttpParams()
    .set('q', searchString)
    .set('type', "artist")
    .set('limit', "50");
    return this.spotifyToken.getBearerToken().pipe(mergeMap(token=>{
      return this.http.get<any>(`https://api.spotify.com/v1/search`, { headers: { "Authorization": `Bearer ${token}` }, params: params});
    }));
  }
  
  addToFavourites(id): Observable<any> {
    return this.http.put<[String]>(`${environment.userAPIBase}/favourites/${id}`, {});
  }
  
  removeFromFavourites(id): Observable<any> {
    return this.http.delete<[String]>(`${environment.userAPIBase}/favourites/${id}`).pipe(mergeMap(favouritesArray => {
      
      return this.getFavourites(); 
    }));
  }
  
  getFavourites(): Observable<any> {
    return this.http.get<[String]>(`${environment.userAPIBase}/favourites/`).pipe(mergeMap(favouritesArray => {
      if(favouritesArray.length > 0){
      const params = new HttpParams().set('ids', favouritesArray.join(','));
      return this.spotifyToken.getBearerToken().pipe(mergeMap(token=>{
        return this.http.get<any>(`https://api.spotify.com/v1/tracks`, { headers: { "Authorization": `Bearer ${token}` }, params: params});
      }));
    }
    else {
      return new Observable(o=>{o.next({tracks: []})});  
    }}));
  }
}