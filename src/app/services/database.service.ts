import { Injectable } from '@angular/core';
import {Platform} from '@ionic/angular';
import {SQLitePorter} from '@ionic-native/sqlite-porter/ngx';
import {HttpClient} from '@angular/common/http';
import {SQLite, SQLiteObject} from '@ionic-native/sqlite/ngx';
import {BehaviorSubject, Observable} from 'rxjs';

export interface Student{
  studID: number;
  name: string;
  age: number;
  genero: number;
  birtday: string;
  photo: string;
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  students = new BehaviorSubject([]);
  constructor(private plt: Platform,private sqlitePorter: SQLitePorter, private sqlite: SQLite, private http: HttpClient) { 
    this.plt.ready().then(() =>{
      this.sqlite.create({
        name: 'studentsDatabase.db',
        location : 'default'
      }).then((db: SQLiteObject) =>{
        this.database = db;
        this.seedDatabase();
      });
    });
  }
  seedDatabase(){
    this.http.get('assets/studentScript.sql', {responseType: 'text'})
    .subscribe(sql =>{
      this.sqlitePorter.importSqlToDb(this.database, sql)
      .then(_ =>{
        this.loadStudents();
        this.dbReady.next(true);
      }).catch(e => console.error(e));
    });
  }

  getDatabaseState(){
    return this.dbReady.asObservable();
  }

  getStudents() : Observable<Student[]>{
    return this.students.asObservable();
  }

  loadStudents(){
    return this.database.executeSql('SELECT * from students', []).then(data =>{
      let students : Student[] = [];
      if(data.rows.length > 0){
        for(let i = 0; i<data.rows.length; i++){
          students.push({
            studID: data.rows.item(i).studID,
            age : data.rows.item(1).age,
            name: data.rows.item(i).namee,
            genero : data.rows.item(i).genero,
            birtday : data.rows.item(i).birtday,
            photo: data.rows.item(i).photo
          });
        }
      }
      this.students.next(students);
    });
  }

  addStudentData(studName,age, genero, nacimiento, photo){
    let data = [studName,age, genero, nacimiento, photo];
    return this.database.executeSql('INSERT INTO students (namee,age,genero,birtday,photo) VALUES (?,?,?,?,?', data)
    .then(data => {
      this.loadStudents();
    })
  }

  getStudentByID(id): Promise<Student>{
    return this.database.executeSql('SELECT * from students WHERE studID = ?', [id]).then(data =>{
      return{
        studID : data.rows.item(0).studID,
        name: data.rows.item(0).namee,
        age : data.rows.item(0).age,
        genero: data.rows.item(0).genero,
        birtday: data.rows.item(0).birtday,
        photo : data.rows.item(0).photo
      };
    });
  }

  updateStudent(student: Student){
    let data = [student.name,student.age, student.genero, student.birtday, student.photo];
    return this.database.executeSql(`UPDATE students Set namee = '?', age ='?', genero='?', birtday='?', photo='?' WHERE studID= ${student.studID}`, data)
    .then(data => {
      this.loadStudents();
    });
  }

  deleteStudent(stuId){
    return this.database.executeSql('DELETE FROM students WHERE studID=?',[stuId]).then(_ => {
      this.loadStudents();
    })
  }
}
