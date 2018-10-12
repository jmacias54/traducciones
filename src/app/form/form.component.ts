import { Component, OnInit } from '@angular/core';
import { ApiService as API } from '../api.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  private itemsByPage = 10;
  numberOfPages = 1;
  currentPage = 1;
  itemsInPage: Array<any> = [];

  listDeportes: Array<any> = [];
  listEventos: Array<any> = [];
  deporteSelected: string;
  textoEs: string;

  constructor(private api: API) { }

  async ngOnInit() {
    this.listDeportes = await this.api.post(API.END_POINTS.deportes, {}).toPromise();
    this.listEventos = await this.api.post(API.END_POINTS.CEventoFindAll, {}).toPromise();
    this.deporteSelected = this.listDeportes[0].fiIdWidget;
    this.changeDeporte();
  }

  async changeDeporte () {
    var params = this.deporteSelected
    this.listEventos = await this.api.post(API.END_POINTS.CEventoFindByWidget, {params}).toPromise();
    this.initItemsInPage();
  }


  editItem (item) {
    item.edit = true
  }

  async updateItem (item) {
    item.fcTituloEsp = this.textoEs;
    var body = {
      fcIdEvento: item.fcIdEvento,
      fiIdWidget: item.fiIdWidget,
      fcTituloEng: item.fcTituloEng,
      fcTituloEsp: item.fcTituloEsp
    }
    try {
      var response = await this.api.post(API.END_POINTS.CEventoUpdate, {body}).toPromise();
      this.textoEs = '';
      item.edit = false;
    } catch (err) {
      console.log(err);
      alert("ocurrio un error al actuizar la informacion")
    }
  }

  cancelEditItem (item) {
    item.edit = false;
  }

  private initItemsInPage() {
    if (this.listEventos.length === 0) {
      this.itemsInPage = [];
      this.numberOfPages = 1;
    } else {
      this.numberOfPages = Math.ceil(this.listEventos.length / this.itemsByPage);
      this.showDataPage(1);
    }
  }

  showDataPage(page) {
    this.currentPage = page;
    var init = this.itemsByPage * (page - 1);
    var end = this.itemsByPage * page;
    if (init > this.listEventos.length) return;
    this.itemsInPage = [];
    for (var i = init; i < end && i < this.listEventos.length; i++ ) {
      this.itemsInPage.push(this.listEventos[i]);
    }
  }

  range(init, end) {
    var array = [];
    for (var i = init; i < end; i++) {
      array.push(i)
    }
    return array;
  }

}
