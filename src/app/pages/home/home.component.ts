import { outputAst } from '@angular/compiler';
import { Component } from '@angular/core';
import { ForoService } from 'src/app/core/service/foro/foro.service';
import { Home } from 'src/app/models/item';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  template: '<app-home (addModel) = "receiveData($event)>"</app-home>',
})
export class HomeComponent {
  constructor(private foroService: ForoService){}

  title = 'home';
  public listpublications: Home[] = []
  public isLoading:boolean = true


  ngOnInit():void{
    this.loadData()
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
          this.isLoading = false
        });
      });
  }
  postText: string = '';

  public insertImage() {
    // Lógica para insertar imagen aquí
    console.log('Insertar imagen');
  }

  public publishPost() {
    // Lógica para publicar la entrada aquí
    console.log('Publicar entrada:', this.postText);
  }
}
