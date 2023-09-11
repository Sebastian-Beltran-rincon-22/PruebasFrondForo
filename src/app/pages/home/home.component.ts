import { Component, Input } from '@angular/core';
import { ForoService } from 'src/app/core/service/foro/foro.service';
import { Home, Interaction, Comment } from 'src/app/models/item';
import { forkJoin } from 'rxjs';
import { InteractionService } from 'src/app/core/service/interaction/interaction.service';
import { SwitchService } from 'src/app/core/service/modal/switch.service';
import { CommentsService } from 'src/app/core/service/comments/comments.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {

  constructor(private foroService: ForoService,
    private interactionService: InteractionService,
    private commentService: CommentsService,
    private modalSS:SwitchService ){}

  @Input() publication: any;
  title = 'home';

  //Data Homr
  public listpublications: Home[] = [];
  public comments: Comment[] = [];

  public isLoading: boolean = true;
  commentContent?: string;
  imageURL: string = '';
  isModalVisible !: boolean;
  isCommentModalVisible: boolean = false;

  likedPublications: { [key: string]: boolean } = {};
  interactions: {[key: string]: Interaction} = {};




  ngOnInit(): void {

    this.modalSS.$modal.subscribe((valu)=>{this.isModalVisible = valu})

    this.loadData();
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


  //Modal
  openModal(){

    this.isModalVisible = true
  }


  // Simulacion para publicaciones
  postText: string = '';

  public publishPost() {
    // Lógica para publicar la entrada aquí
    console.log('Publicar entrada:', this.postText);
  }


  //interactions

  likePublication(publicationId: string) {
    if (this.likedPublications[publicationId]) {
      // Ya dio "like", entonces quitar el "like"
      this.interactionService.unlikePublication(publicationId).subscribe(
        (response) => {
          this.likedPublications[publicationId] = false;
        },
        (error) => {
          console.error('Error al quitar like:', error);
        }
      );
    } else {
      // No dio "like", dar el "like"
      this.interactionService.likePublication(publicationId).subscribe(
        (response) => {
          this.likedPublications[publicationId] = true;
        },
        (error) => {
          console.error('Error al dar like:', error);
        }
      );
    }
  }


  //Comentarios
  openCommentModal(publicationId:string) {
    this.isCommentModalVisible = true;
    this.commentService.getComments(publicationId).subscribe((data: Comment[]) => {
      this.comments = data;
    });
  }

  createComment(publicationId: string) {
    const data = { content: this.commentContent, publication: publicationId };
    this.commentService.createComment(data).subscribe(
      (response) => {
        console.log('Comentario creado', response);
          this.commentService.getComments(publicationId).subscribe((data: Comment[]) => {
          this.comments = data;
          });
      },
      (error) => {
        console.error('Error al crear comentario:', error);
      }
    );
  }
  closeCommentModal() {
    this.isCommentModalVisible = false;
  }


}
