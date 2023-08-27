import { Component, Input } from '@angular/core';
import { ForoService } from 'src/app/core/service/foro/foro.service';
import { Home } from 'src/app/models/item';
import { forkJoin } from 'rxjs';
import { InteractionService } from 'src/app/core/service/interaction/interaction.service';
import { SwitchService } from 'src/app/core/service/modal/switch.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  constructor(private foroService: ForoService,
    private interactionService: InteractionService,
    private modalSS:SwitchService ){}


  @Input() publication: any;
  title = 'home';

  public listpublications: Home[] = [];
  public isLoading: boolean = true;

  imageURL: string = '';
  isModalVisible !: boolean;

  likedPublications: { [key: string]: boolean } = {};


  ngOnInit(): void {
    this.modalSS.$modal.subscribe((valu)=>{this.isModalVisible = valu})
    // Carga los "likes" guardados en el localStorage al inicio
    const storedLikes = localStorage.getItem('likedPublications');
    if (storedLikes) {
      this.likedPublications = JSON.parse(storedLikes);
    }
    this.loadData();
  }


  createPost() {
    const userId = localStorage.getItem('userId');
    const newPost = {
      user: userId,
      description: this.postText,
      date_create: new Date(),
      image: this.imageURL,
    };
    // Lógica para crear la publicación aquí
  }


  public loadData() {
    this.foroService.getTask('https://pooforoapi.onrender.com/publictpoofo/')
      .subscribe((data: Home[]) => {
        const requests = data.map(publication => this.foroService.getUsernameById(publication.user));

        forkJoin(requests).subscribe((responses: any[]) => {
          const usernames = responses.map(response => response.userName);
          const userimgs = responses.map(responses => responses.userImg )

          this.listpublications = data.map((publication, index) => ({
            ...publication,
            username: usernames[index],
            userimg: userimgs[index]
          }));
          this.isLoading = false;
        });
      });
  }


  insertImageUrl() {
    // Aquí puedes realizar la lógica para insertar la imagen en tu publicación
    this.imageURL = ''; // Limpia la URL
    this.isModalVisible = false;
    console.log("Insert Image Clicked")
  }




  openModal(){

    this.isModalVisible = true
  }


  postText: string = '';
  public publishPost() {
    // Lógica para publicar la entrada aquí
    console.log('Publicar entrada:', this.postText);
  }


  //interactions
  loadLikedPublicationsFromLocalStorage() {
    const likedPublicationsString = localStorage.getItem('likedPublications');
    if (likedPublicationsString) {
      this.likedPublications = JSON.parse(likedPublicationsString);
    }
  }


  likePublication(publication: Home) {
    if (this.likedPublications[publication._id]) {
      // Ya dio "like", entonces quitar el "like"
      this.interactionService.unlikePublication(publication._id).subscribe(
        response => {
          publication.reactions = false;
          this.likedPublications[publication._id] = false;
          // Actualiza los "likes" en el localStorage después de quitar "like"
          localStorage.setItem('likedPublications', JSON.stringify(this.likedPublications));
        }
      );
    } else {
      // No dio "like", dar el "like"
      this.interactionService.likePublication(publication._id).subscribe(
        response => {
          publication.reactions = true;
          this.likedPublications[publication._id] = true;
          // Actualiza los "likes" en el localStorage después de dar "like"
          localStorage.setItem('likedPublications', JSON.stringify(this.likedPublications));
        }
      );
    }
  }
}
