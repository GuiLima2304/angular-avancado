import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

import { Category } from "../shared/category.model";
import { CategoryService } from "../shared/category.service";

import { switchMap } from "rxjs/operators";

import toastr from "toastr";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit {

  public currentAction: string;
  public categoryForm: FormGroup;
  public pageTitle: string;
  public serverErrorMessages: string[] = null;
  public submittingForm: boolean = false;
  public category: Category = new Category();

  constructor(
     //injecao de dependencia
     private categoryService: CategoryService,
     private route: ActivatedRoute,
     private router: Router,
     private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.setCurrentAction();
    this.buildCategoryForm();
    this.loadCategory();
  }

  ngAfterContentChecked(){
    this.setPageTitle();
  }

  submitForm() {
    if(this.currentAction == "new")
      this.createCategory();
    else
      this.updateCategory();
    
  }

  private createCategory() {
    const category: Category = Object.assign(new Category(), this.categoryForm.value);

    this.categoryService.create(category).subscribe(
      category => this.actionsForSucess(category),
      error => this.actionsForError(error)
    )
  }

  private updateCategory() {
    
  }

  private setCurrentAction() {
    if(this.route.snapshot.url[0].path == "new")
      this.currentAction = "new";
    else
      this.currentAction = "edit";
  }

  private buildCategoryForm() {
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null]
    });
  }

  loadCategory() {
    if(this.currentAction == "edit"){
      this.route.paramMap.pipe(
        switchMap(params => this.categoryService.getById(+params.get("id")))
      )
      .subscribe(
        (category) => {
          this.category = category;
          this.categoryForm.patchValue(category) //bind loaded category data to CategoryForm
        }
      )
    }
  }

  setPageTitle() {
    if(this.pageTitle == 'new'){
      this.pageTitle = 'Cadastro de Nova Categoria'
    }else{
      const categoryName = this.category.name || ""
      this.pageTitle = 'Editando Categoria: ' + categoryName;
    }
  }

  private actionsForSucess(category: Category) {
    toastr.sucess("Solicitação processada com sucesso");

    this.router.navigateByUrl('categories', {skipLocationChange: true}).then(
      () => this.router.navigate(['categories', category.id, 'edit'])
    )
  }

  private actionsForError(error){
    toastr.error("Ocorreu um erro com sua solicitação");

    this.submittingForm = false;

    if(error.status === 422)
      this.serverErrorMessages = JSON.parse(error.body).errors;
    else
      this.serverErrorMessages = ["Falha na comunicação com o servidor, por favor tente mais tarde"];
  }
}
