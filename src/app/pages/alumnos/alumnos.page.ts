import { Component, OnInit } from '@angular/core';
import { DatabaseService, Student } from 'src/app/services/database.service';

@Component({
  selector: 'app-alumnos',
  templateUrl: './alumnos.page.html',
  styleUrls: ['./alumnos.page.scss'],
})
export class AlumnosPage implements OnInit {

  constructor(private db: DatabaseService) { }
  studentsData = {};
  students : Student[] = [];

  ngOnInit() {
    this.db.getDatabaseState().subscribe(rdy => {
      if(rdy){
        this.db.getStudents().subscribe(studs => {
          this.students = studs;
          console.log(this.students)
        })
      }
    });
  }

}
