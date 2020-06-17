import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router'
import {DatabaseService, Student} from 'src/app/services/database.service';
import {ToastController} from '@ionic/angular';

@Component({
  selector: 'app-alumno',
  templateUrl: './alumno.page.html',
  styleUrls: ['./alumno.page.scss'],
})
export class AlumnoPage implements OnInit {
  student: Student = null;
  constructor(private router:Router, private route: ActivatedRoute, private db: DatabaseService, private toast: ToastController) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params =>{
      let studID = params.get('id');
      this.db.getStudentByID(studID).then(data =>{
        this.student = data;
      })
    })
  }

  updateStudentData(){
    this.db.updateStudent(this.student).then(async (res) =>{
      let toast = await this.toast.create({
        message: 'Actulizaste al estudiante',
        duration : 3000
      });
      toast.present();
    }).then(() => this.router.navigateByUrl('students'));
  }
  delete(){
    this.db.deleteStudent(this.student.studID).then(() =>{
      this.router.navigateByUrl('students');
    })
  }
}
