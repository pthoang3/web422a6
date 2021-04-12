import { Component, OnInit, OnDestroy } from '@angular/core';
import { MusicDataService } from '../music-data.service';
import { ActivatedRoute } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent implements OnInit, OnDestroy {
  album: any;  
  private id: String;
  private sub;
  private liveAlbumSub;
  private subFavourites;
  private favourites;



  constructor( private route: ActivatedRoute, private data: MusicDataService, private snackBar: MatSnackBar ) { }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
    this.id = params['id']; 
    this.liveAlbumSub = this.data.getAlbumById(this.id).subscribe(data => this.album = data);
    });
  }
  addToFavourites(id){
    this.subFavourites = this.data.addToFavourites(id).subscribe(
      favourites =>{
        this.favourites = favourites;
        this.snackBar.open("Adding to Favourites...", "Done", { duration: 1500 });
      },
      e => {
        this.snackBar.open("Unable to add song to Favourites", "Error", { duration: 1500 });
    });
  }
  ngOnDestroy(){
    this.sub?.unsubscribe();
    this.liveAlbumSub?.unsubscribe();
    this.subFavourites?.unsubscribe();
  }
}
